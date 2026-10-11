# -*- coding: utf-8 -*-
"""
PDF 文本提取器（常驻工具 · Round 130）

★ 为什么有这个工具：本仓此前用「stream…endstream + inflate + 取 (…) 字面量」的自制提取器，
  经 Round 129 实测确认【普遍不可靠】：
    · 一份 CID/Identity-H 字体的 PDF，输出 101,723 字符全为垃圾（可打印仅 21.5%）
    · 一份真实 Frontiers 论文，输出仅 43.3% 可打印（约一半是垃圾）
    · 一份真实 J-STAGE 论文，一个字都取不出
  ⇒ 根因是它不读 /ToUnicode CMap、也不按版面重组，只拿到字形码。
★ 本工具改用 PyMuPDF（自带 Python 已装，无需安装），Round 130 实测：
    同一批样本 可打印占比 21.5% → 98.5% / 43.3% → 96.3%，且版面换行结构被保留。

★ 用法
    python _pdftext.py <file.pdf> [out.txt]        # 提取正文；给了 out.txt 则落盘
    python _pdftext.py --check <file.pdf> ...      # 只报五指标与完整性诊断，不落盘

★ 完整性诊断（Round 130 新增的一类失败）：文件可能是【截断的下载】——
  以 %PDF 开头、字节数正常，但【没有 %%EOF】、PyMuPDF 报 0 页。
  ⇒ 这类既不是加密、也不是类型不符，而是【下载不完整】，处置是【重新下载】。

★ 只读：不修改被读取的文件。
"""
import sys, os, io, re

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

try:
    import pymupdf
except ImportError:
    try:
        import fitz as pymupdf
    except ImportError:
        print('FATAL: 未找到 PyMuPDF。请先确认自带 Python 环境。')
        sys.exit(10)

KEYWORDS = ['error bar', 'replicate', 'sample size', 'statistic', 'standard deviation',
            'confidence interval', 'p value', 'significance', 'methods', 'results',
            'figure', 'table', 'median', 'mean']


def metrics(t):
    total = len(t) or 1
    no_space = len(re.sub(r'\s', '', t)) or 1
    printable = sum(1 for c in t if 32 <= ord(c) < 127 or 0x4e00 <= ord(c) <= 0x9fff)
    latin = sum(1 for c in t if c.isascii() and c.isalpha())
    words = len(re.findall(r'[A-Za-z]{4,}', t))
    low = t.lower()
    hits = sum(low.count(k) for k in KEYWORDS)
    nl = t.count('\n')
    lines = [l for l in t.split('\n') if l.strip()]
    return dict(printable=printable / total * 100, latin=latin / no_space * 100,
                words=words, keys=hits, per100=nl / total * 100,
                chars=len(t), lines=len(lines))


def diagnose(path):
    """返回 (是否可用, 诊断说明列表)"""
    notes = []
    with open(path, 'rb') as f:
        head = f.read(8)
        f.seek(max(0, os.path.getsize(path) - 2048))
        tail = f.read()
    if head[:4] != b'%PDF':
        notes.append('魔数不是 %PDF ⇒ 这不是 PDF（见修正三十八：先验输入物）')
        return False, notes
    if b'%%EOF' not in tail:
        notes.append('★ 尾部 2KB 内【没有 %%EOF】⇒ 疑似【截断的下载】⇒ 处置是重新下载，不是换工具')
    return True, notes


def run(paths, out=None):
    for p in paths:
        if not os.path.exists(p):
            print('缺少文件:', p)
            continue
        print('=' * 78)
        print('文件:', os.path.basename(p), '(%d 字节)' % os.path.getsize(p))
        ok, notes = diagnose(p)
        for n in notes:
            print('  [!]', n)
        if not ok:
            continue
        doc = pymupdf.open(p)
        enc = doc.is_encrypted
        pages = doc.page_count
        text = '\n'.join(pg.get_text('text') for pg in doc)
        doc.close()
        m = metrics(text)
        print('  页数 %d · 加密 %s' % (pages, enc))
        if pages == 0:
            print('  [!] PyMuPDF 报 0 页 ⇒ 与上面的 %%EOF 诊断互相印证：文件不完整')
        print('  可打印 %6.1f%% · 字母 %6.1f%% · >=4字母词 %6d · 关键词 %4d · 每百字符换行 %5.2f'
              % (m['printable'], m['latin'], m['words'], m['keys'], m['per100']))
        print('  提取 %d 字符 / %d 非空行' % (m['chars'], m['lines']))
        print('  前 160 字:', repr(text[:160]))
        if out:
            with open(out, 'w', encoding='utf-8') as f:
                f.write(text)
            print('  已写:', out)


if __name__ == '__main__':
    args = sys.argv[1:]
    if not args:
        print(__doc__)
        sys.exit(2)
    if args[0] == '--check':
        run(args[1:], None)
    else:
        run([args[0]], args[1] if len(args) > 1 else None)
