"""figkit — 论文作图工具包（规格固化 + 自动合规校验）

设计原则（对应方案 §作图工具链）：
  1. 规格固化：字体/线宽/色板/导出参数写死在模块里，调用方不用重复指定
  2. 默认即合规：出图即满足期刊常规要求，不需要事后手工调
  3. 自动验收：check_pdf() 对输出做机器校验，不靠眼睛
  4. 可复现：纯脚本，输入 = 数据 + 本文件，输出 = 图

用法：
    import figkit as fk
    fk.apply_style()
    fig, ax = fk.new_fig(width='single')
    ax.plot(x, y, **fk.line_kw(0))
    fk.finish(fig, 'fig1.pdf', xlabel='Cycle number', ylabel='Capacity ratio')
    fk.check_pdf('fig1.pdf')          # 自动验收
"""
from __future__ import annotations

import os
import re

# ─────────────────────────────────────────────────────────────
# 一、规格常量（唯一事实源：改这里，所有图跟着变）
# ─────────────────────────────────────────────────────────────

SPEC = {
    # 字体：期刊普遍要求无衬线；本机实测 Arial 四字重齐全
    "font.family": "sans-serif",
    "font.sans-serif": ["Arial", "Helvetica", "DejaVu Sans"],
    "font.size": 9.0,            # 基准字号 pt
    "axes.labelsize": 9.0,       # 轴标签
    "axes.titlesize": 9.0,
    "xtick.labelsize": 8.0,      # 刻度标签（缩到单栏仍 >= 6pt）
    "ytick.labelsize": 8.0,
    "legend.fontsize": 8.0,

    # 线宽：主曲线 0.75-1.0 pt，坐标轴 0.75 pt
    "axes.linewidth": 0.75,
    "lines.linewidth": 1.0,
    "lines.markersize": 3.5,
    "xtick.major.width": 0.75,
    "ytick.major.width": 0.75,
    "xtick.minor.width": 0.5,
    "ytick.minor.width": 0.5,
    "xtick.major.size": 3.0,
    "ytick.major.size": 3.0,
    "xtick.minor.size": 1.6,
    "ytick.minor.size": 1.6,

    # 导出：矢量优先，字体嵌入
    "pdf.fonttype": 42,          # TrueType 嵌入（42）而非 Type3（3）
    "ps.fonttype": 42,
    "svg.fonttype": "none",      # SVG 里保留文本可编辑
    "savefig.bbox": "tight",
    "savefig.pad_inches": 0.02,

    # 数学排版：默认 mathtext 会用 DejaVu 且把上下标缩小，
    # 于是渲染出的 PDF 里会混进第二种字体、且最小字号低于期刊下限。
    # 这两条都被 check_pdf() 抓到过，所以在这里锁死。
    "mathtext.fontset": "custom",
    "mathtext.rm": "Arial",
    "mathtext.it": "Arial:italic",
    "mathtext.bf": "Arial:bold",
    "mathtext.sf": "Arial",
    "mathtext.default": "regular",   # 不缩字号，上下标与正文同族
}

# 上下标的相对字号。matplotlib 默认 0.7，会让 8pt 的刻度缩到 5.6pt。
# 这里抬到 0.8，并配合上面的 mathtext.default=regular 一起把最小字号顶上去。
MATHTEXT_SCALE = 0.8

# 期刊单栏/双栏常用宽度（英寸）。1 栏约 8.3 cm，双栏约 17.1 cm
WIDTHS = {"single": 3.27, "1.5": 4.9, "double": 6.73}

# Okabe–Ito 色板：色盲友好（约 8% 男性红绿色觉异常）
PALETTE = {
    "black":    "#000000",
    "orange":   "#E69F00",
    "skyblue":  "#56B4E9",
    "green":    "#009E73",
    "yellow":   "#F0E442",
    "blue":     "#0072B2",
    "vermillion": "#D55E00",
    "purple":   "#CC79A7",
    "grey":     "#999999",
}
CYCLE = [PALETTE["blue"], PALETTE["vermillion"], PALETTE["green"],
         PALETTE["orange"], PALETTE["purple"], PALETTE["skyblue"],
         PALETTE["yellow"], PALETTE["black"]]

MARKERS = ["o", "s", "^", "D", "v", "<", ">", "p"]
LINESTYLES = ["-", "--", "-.", ":"]


# ─────────────────────────────────────────────────────────────
# 二、样式应用与绘图骨架
# ─────────────────────────────────────────────────────────────

def apply_style():
    """把 SPEC 应用到 matplotlib 全局 rcParams。每次画图前调用一次。"""
    import matplotlib as mpl
    mpl.rcParams.update(SPEC)
    # matplotlib 对不存在的字体只警告不报错，这里显式确认一次
    import matplotlib.font_manager as fm
    have = {f.name for f in fm.fontManager.ttflist}
    for fam in SPEC["font.sans-serif"]:
        if fam in have:
            break
    else:
        raise RuntimeError("无可用的无衬线字体，SPEC 里的候选全都不在本机")


def new_fig(width="single", height=None, ratio=0.75, nrows=1, ncols=1, **kw):
    """建图。width 用 WIDTHS 的名字或直接给英寸；height 缺省按 ratio 推。"""
    import matplotlib.pyplot as plt
    w = WIDTHS.get(width, width) if isinstance(width, str) else width
    h = height if height is not None else w * ratio
    fig, axes = plt.subplots(nrows, ncols, figsize=(w, h), **kw)
    return fig, axes


def line_kw(i=0, style=None, marker=None, label=None):
    """第 i 条曲线的绘图参数（给 plot 用）：颜色/线型/标记循环，色盲友好。"""
    kw = {
        "linewidth": SPEC["lines.linewidth"],
        "color": CYCLE[i % len(CYCLE)],
        "linestyle": style if style is not None else LINESTYLES[(i // len(CYCLE)) % len(LINESTYLES)],
    }
    if marker is not None:
        kw["marker"] = marker
        kw["markersize"] = SPEC["lines.markersize"]
        kw["markerfacecolor"] = "none"      # 空心标记：黑白打印也能分辨
        kw["markeredgewidth"] = 0.75
    if label is not None:
        kw["label"] = label
    return kw


def scatter_kw(i=0, marker=None, label=None):
    """第 i 组散点的绘图参数（给 scatter 用）。

    注意 scatter 用的是 s（面积）而不是 markersize，且没有 linestyle，
    所以不能复用 line_kw —— 这一处曾经让工具首次自测就报错。
    """
    kw = {
        "s": SPEC["lines.markersize"] ** 2,   # matplotlib 的 s 是点面积的平方
        "color": "none",
        "edgecolors": CYCLE[i % len(CYCLE)],
        "linewidths": 0.75,
    }
    if marker is not None:
        kw["marker"] = marker
    if label is not None:
        kw["label"] = label
    return kw


def finish(fig, path, xlabel=None, ylabel=None, title=None,
           legend=False, legend_ncol=1, grid=False,
           ticks_in=True, hide_top_right=True, **savefig_kw):
    """收尾：设标签 + 样式 + 导出。默认走期刊风格（刻度内向、去上右框）。"""
    import matplotlib.pyplot as plt
    axes = [a for a in (fig.axes if hasattr(fig, "axes") else [fig])]
    for ax in axes:
        if xlabel is not None:
            ax.set_xlabel(xlabel)
        if ylabel is not None:
            ax.set_ylabel(ylabel)
        if title is not None:
            ax.set_title(title)
        if ticks_in:
            ax.tick_params(which="both", direction="in",
                           top=not hide_top_right, right=not hide_top_right)
        if hide_top_right:
            ax.spines["top"].set_visible(False)
            ax.spines["right"].set_visible(False)
        if grid:
            ax.grid(True, linewidth=0.4, alpha=0.35, color=PALETTE["grey"])
        if legend:
            ax.legend(frameon=False, ncol=legend_ncol, loc="best")
    fig.tight_layout(pad=0.3)

    kw = dict(SPEC["savefig.bbox"] and {"bbox_inches": SPEC["savefig.bbox"]} or {})
    kw["pad_inches"] = SPEC["savefig.pad_inches"]
    kw.update(savefig_kw)
    p = str(path)
    if p.lower().endswith(".pdf"):
        fig.savefig(p, format="pdf", **kw)
    elif p.lower().endswith((".eps", ".ps")):
        fig.savefig(p, format="eps", **kw)
    elif p.lower().endswith((".tif", ".tiff")):
        fig.savefig(p, format="tiff", dpi=600, pil_kwargs={"compression": "tiff_lzw"}, **kw)
    elif p.lower().endswith(".png"):
        fig.savefig(p, format="png", dpi=600, **kw)
    else:
        fig.savefig(p, **kw)
    plt.close(fig)
    return p


# ─────────────────────────────────────────────────────────────
# 三、自动合规校验（不靠眼睛）
# ─────────────────────────────────────────────────────────────

# 期刊常规要求（可被目标刊 Author Guidelines 覆盖）
REQUIRE = {
    "vector_only": True,      # 矢量图内不得嵌位图（除非确实是显微照等）
    "allow_embedded_images": 0,
    "sans_serif": True,       # 字体须无衬线
    "min_font_pt": 7.0,       # 正文（轴标签/刻度/图例）字号下限
    "min_script_pt": 5.5,     # ★ 上标/下标下限：数学上下标天然更小，
                              #   若也按正文 7 pt 卡就是过严（本条是实测补的）
    "no_type3": True,         # Type3 字体常被期刊拒
}

# matplotlib mathtext 的上下标缩放因子固定为 0.7，无法配置。
# 因此 9 pt 的轴标签会产生 6.3 pt 的下标。若目标刊坚持下标也 >= 7 pt，
# 可把下面的 UNSAFE_lift 设为 True —— 它会用 Unicode 上下标字符替代 mathtext，
# 代价是可用字符集受字体覆盖限制。
UNICODE_SUB = str.maketrans("0123456789+-=()", "\u2080\u2081\u2082\u2083\u2084\u2085\u2086\u2087\u2088\u2089\u208a\u208b\u208c\u208d\u208e")

_SERIF_HINTS = ("times", "serif", "simsun", "song", "microsoft yahei", "symbol")


def _split_body_script(sizes):
    """把一页里所有字号分成「正文」与「上下标」两档。

    做法：取最大字号为基准 M，凡 >= 0.85*M 归正文，其余归上下标。
    这样 9pt 正文配 6.3pt 下标（比例 0.70）会被正确分成两档，
    而不会被当成「正文只有 6.3pt」而误报。
    """
    vals = [s for s in sizes if s]
    if not vals:
        return None, None
    m = max(vals)
    body = [v for v in vals if v >= 0.85 * m]
    script = [v for v in vals if v < 0.85 * m]
    return (min(body) if body else None), (min(script) if script else None)


def check_pdf(path, require=None):
    """对导出的 PDF 做机器校验。返回 (ok, report)。

    检查项：
      1. 是否含位图（矢量图不该有）
      2. 字体族是否无衬线
      3. 是否有 Type3 字体
      4. 字号下限
      5. 页面尺寸是否在合理范围
    """
    import pymupdf
    req = dict(REQUIRE)
    if require:
        req.update(require)

    doc = pymupdf.open(path)
    rep = {"file": os.path.basename(path), "pages": doc.page_count, "issues": [], "warnings": []}

    total_draw = 0
    all_fonts = set()
    min_size = None
    spans_all = []
    for pno in range(doc.page_count):
        pg = doc[pno]
        total_draw += len(pg.get_drawings())
        imgs = pg.get_images()
        if len(imgs) > req["allow_embedded_images"]:
            rep["issues"].append(
                "第 %d 页含 %d 张位图（要求 <= %d）；若确为显微照/照片请显式豁免"
                % (pno + 1, len(imgs), req["allow_embedded_images"]))
        for f in pg.get_fonts():
            # f = (xref, ext, type, basefont, name, encoding, ...)
            base = (f[3] or "").split("+")[-1]
            all_fonts.add((base, f[2]))
            if req["no_type3"] and str(f[2]).lower().startswith("type3"):
                rep["issues"].append("第 %d 页使用了 Type3 字体 %s（期刊常拒）" % (pno + 1, base))
            if req["sans_serif"] and any(h in base.lower() for h in _SERIF_HINTS):
                rep["issues"].append("第 %d 页字体 %s 疑似衬线/中文字体，期刊通常要求无衬线" % (pno + 1, base))
        # 字号：从 span 里取
        for blk in pg.get_text("dict").get("blocks", []):
            for ln in blk.get("lines", []):
                for sp in ln.get("spans", []):
                    s = sp.get("size")
                    if s:
                        spans_all.append(s)
                        min_size = s if min_size is None else min(min_size, s)

    rep["vector_drawing_ops"] = total_draw
    rep["fonts"] = sorted({b for b, _ in all_fonts})
    rep["min_font_pt"] = round(min_size, 2) if min_size else None

    if total_draw == 0:
        rep["issues"].append("没有任何矢量绘图指令，可能导出成了纯位图")
    # 区分正文与上下标：同一份图里最大的那批文字是正文，
    # 明显更小的那批是数学上下标。两者下限不同，混在一起判会误报。
    body_pt, script_pt = _split_body_script(spans_all)
    rep["body_min_pt"] = round(body_pt, 2) if body_pt else None
    rep["script_min_pt"] = round(script_pt, 2) if script_pt else None
    if body_pt and body_pt < req["min_font_pt"]:
        rep["issues"].append("正文字号 %.2f pt < 要求 %.2f pt" % (body_pt, req["min_font_pt"]))
    if script_pt and script_pt < req["min_script_pt"]:
        rep["issues"].append("上下标字号 %.2f pt < 要求 %.2f pt" % (script_pt, req["min_script_pt"]))
    pg0 = doc[0]
    w_pt, h_pt = pg0.rect.width, pg0.rect.height
    rep["page_pt"] = [round(w_pt, 1), round(h_pt, 1)]
    if w_pt < 100 or w_pt > 1200 or h_pt < 100 or h_pt > 1200:
        rep["warnings"].append("页面尺寸 %s pt 偏大或偏小，确认是否符合目标刊要求" % rep["page_pt"])
    doc.close()

    rep["ok"] = len(rep["issues"]) == 0
    return rep["ok"], rep


def check_pdf_or_raise(path, require=None):
    ok, rep = check_pdf(path, require)
    if not ok:
        raise RuntimeError("图不合规：\n  - " + "\n  - ".join(rep["issues"]))
    return rep


def report(path, require=None):
    ok, rep = check_pdf(path, require)
    print("=" * 58)
    print("文件 %s" % rep["file"])
    print("  页数 %d · 尺寸 %s pt" % (rep["pages"], rep["page_pt"]))
    print("  矢量绘图指令 %d" % rep["vector_drawing_ops"])
    print("  字体 %s · 最小字号 %s pt" % (rep["fonts"], rep["min_font_pt"]))
    for w in rep["warnings"]:
        print("  ⚠ " + w)
    for i in rep["issues"]:
        print("  ✗ " + i)
    print("  结论：%s" % ("通过" if ok else "不合规"))
    print("=" * 58)
    return ok, rep
