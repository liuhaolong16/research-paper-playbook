#!/usr/bin/env node
/**
 * 节号索引（常驻工具 · Round 126）
 *
 * 用途：给定一个或一组 Markdown 文件，报告每个文件的节结构（编号节 / 中文顶层节 / 最大节号 / 缺口）。
 *
 * ★★★ 为什么要单独做一个工具（修正三十九）：
 *   Round 125 我用一个「顺手写的」统计脚本给 11 个维度生成了状态行，
 *   结果 11 行里 9 行是假的 —— 因为我把文件名前两位（"09"）当成了节号前缀，
 *   而文件里的节号是 9.10（无前导零），正则永不匹配 ⇒ 数出 0，且**不报错**。
 *   ⇒ 因此本工具的设计前提是：**先过反向测试，才允许把它的输出写进交付物。**
 *
 * ★ 本工具只读：不修改任何被索引的文件。
 *
 * 用法：
 *   node _sections.cjs --selftest                    # 反向测试（先跑这个）
 *   node _sections.cjs <file> [file...]              # 索引指定文件
 *   node _sections.cjs --dir <dir>                   # 索引目录下的 NN-*.md
 * 退出码：0 正常 / 1 反向测试未通过 / 2 参数错
 */
const fs = require('fs'), path = require('path');

// ══════════════════════════════════════════════════════════════════
// 核心：从一段 Markdown 里抽出节结构
//   ★ 只认【标题行】（^## ），不认正文里出现的「见 3.1 节」之类
//   ★ 编号节：## <N>.<M>[空格/★/…]  —— N 与 M 都是纯数字，**不假定前导零**
//   ★ 中文顶层节：## 一、 / ## 十一、
// ══════════════════════════════════════════════════════════════════
const CN = '一二三四五六七八九十';

function analyze(text, numPrefix) {
  const lines = text.split('\n');
  const numbered = [];   // { major, minor, line, title }
  const cnTop = [];      // { mark, line, title }

  for (let i = 0; i < lines.length; i++) {
    const L = lines[i];
    if (!/^##\s+\S/.test(L)) continue;                  // 必须是二级标题行
    const body = L.replace(/^##\s+/, '').trim();

    // 中文顶层节：一、 / 十一、
    const mCn = body.match(new RegExp('^([' + CN + ']{1,3})[、.．]'));
    if (mCn) { cnTop.push({ mark: mCn[1], line: i + 1, title: body.slice(0, 60) }); continue; }

    // 编号节：N.M
    const mNum = body.match(/^(\d{1,3})\.(\d{1,3})\b/);
    if (mNum) {
      const major = +mNum[1], minor = +mNum[2];
      // ★ 若调用方给了期望的大节号，则只收大节号匹配的（避免把参考文献里的编号当节）
      if (numPrefix == null || major === numPrefix) {
        numbered.push({ major, minor, line: i + 1, title: body.slice(0, 60) });
      }
    }
  }

  numbered.sort((a, b) => a.minor - b.minor);
  const minors = numbered.map(x => x.minor);
  const minMinor = minors.length ? Math.min(...minors) : 0;
  const maxMinor = minors.length ? Math.max(...minors) : 0;

  // ★★★★★ 缺口（Round 126 修正）：
  //   第一版从 1 算到 max ⇒ 在**真实语料**上产生大量**假警报**：
  //   许多维度是「前 N 个节用中文数字（一、二、…），后来补的节用 N.M」，
  //   于是 N.1 … N.(min-1) 这些位置【不是缺失】，而是被另一套编号方案占着。
  //   ⇒ 因此本工具的缺口**只报 min..max 之间**缺的；
  //     **低于 min 的一律不报**，并明确标注「未判」——
  //     这是本工具**能力的边界**，不是它「判断了那些位置不存在」。
  const gaps = [];
  if (minMinor > 0) for (let k = minMinor; k <= maxMinor; k++) if (!minors.includes(k)) gaps.push(k);

  return { numbered, cnTop, minors, minMinor, maxMinor, gaps, belowMinUnjudged: minMinor > 1 };
}

// ══════════════════════════════════════════════════════════════════
// ★★★ 反向测试：喂构造样本，确认它报的**确实是那个样本的真数**
//     每个用例：{名称, 文本, 期望:{编号节数, 最大节号, 中文节数, 缺口}}
// ══════════════════════════════════════════════════════════════════
const CASES = [
  {
    name: '① 基本：3 个连续编号节 + 2 个中文节',
    text: '# t\n\n## 7.1 甲\n正文\n## 7.2 乙\n正文\n## 7.3 丙\n\n## 一、前言\n## 二、方法\n',
    num: 7, exp: { n: 3, max: 3, cn: 2, gaps: [] },
  },
  {
    name: '② 无任何节',
    text: '# 只有标题\n\n一段正文，没有任何二级标题。\n',
    num: 7, exp: { n: 0, max: 0, cn: 0, gaps: [] },
  },
  {
    name: '③ 不连续（3.1 与 3.5）⇒ 必须报出缺口',
    text: '## 3.1 甲\n## 3.5 乙\n',
    num: 3, exp: { n: 2, max: 5, cn: 0, gaps: [2, 3, 4] },
  },
  {
    name: '④ ★ 正文里出现「见 3.1 节」—— 不得被当成节',
    text: '## 3.1 甲\n见 3.1 节所述，另参 3.9 节。\n## 3.2 乙\n',
    num: 3, exp: { n: 2, max: 2, cn: 0, gaps: [] },
  },
  {
    name: '⑤ ★ 三级标题（### 3.3）不得被当成二级节',
    text: '## 3.1 甲\n### 3.3 三级\n## 3.2 乙\n',
    num: 3, exp: { n: 2, max: 2, cn: 0, gaps: [] },
  },
  {
    name: '⑥ ★ 大节号不匹配的行（参考文献里的 7.1）不计入',
    text: '## 7.1 甲\n## 9.1 别维度的节\n## 7.2 乙\n',
    num: 7, exp: { n: 2, max: 2, cn: 0, gaps: [] },
  },
  {
    // ★★ 期望值修正（Round 126）：我第一版把 gaps 写成 []，那是错的 ——
    //    缺口是从 min 到 max 算出来的，稀疏编号【按定义就有缺口】。
    //    这是反向测试的第一层自省：期望值本身也会错。
    name: '⑦ ★ 前导零陷阱：大节号为 9 时，`## 9.10` 必须被数到（Round 125 的原始 bug）',
    text: '## 9.1 甲\n## 9.9 乙\n## 9.10 丙\n## 9.20 丁\n',
    num: 9, exp: { n: 4, max: 20, cn: 0, gaps: [2, 3, 4, 5, 6, 7, 8, 11, 12, 13, 14, 15, 16, 17, 18, 19] },
  },
  {
    name: '⑧ ★ 反向对照：同一份文本，用**错的前导零前缀**去调用 ⇒ 必须数出 0（证明旧 bug 可复现）',
    text: '## 9.1 甲\n## 9.10 丙\n',
    num: 9, exp: { n: 2, max: 10, cn: 0, gaps: [2, 3, 4, 5, 6, 7, 8, 9] },
    control: { num: '09', expN: 0 },   // 传入字符串 "09" ⇒ 一个都不该匹配
  },
  {
    name: '⑨ 中文节与编号节混排',
    text: '## 一、前言\n## 2.1 甲\n## 2.2 乙\n## 二、方法\n',
    num: 2, exp: { n: 2, max: 2, cn: 2, gaps: [] },
  },
  {
    name: '⑩ ★ 带 ★ 与 emoji 的标题仍要认（真实文件风格）',
    // ★ 期望值修正：4.1/4.2/4.15 ⇒ 缺口 3–14 是真实存在的（同 ⑦⑧）
    text: '## 4.1 ★ 甲\n## 4.2 ★★★ 乙\n## 4.15 ★★★★★ 丙\n',
    num: 4, exp: { n: 3, max: 15, cn: 0, gaps: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14] },
  },
  {
    // ★★★★★ Round 126 关键补充：真实语料的形态 ——
    //   前 5 个节用【中文数字】（一、二、三、四、五），后加的用【N.6 … N.12】。
    //   ⇒ 「缺 1..5」是【假警报】：那些位置是中文节占着的，不是缺失。
    //   ⇒ 若本工具把 gaps 报成 [1,2,3,4,5]，说明它【不知道两种方案共存】。
    name: '⑪ ★★★ 真实形态：中文节占住 1..5，编号节从 N.6 开始 ⇒ gaps 必须为空',
    text: '## 一、前言\n## 二、框架\n## 三、结构\n## 四、数据库\n## 五、参考文献\n' +
          '## 6.6 甲\n## 6.7 乙\n## 6.8 丙\n',
    num: 6, exp: { n: 3, max: 8, cn: 5, gaps: [] },
  },
];

function selftest() {
  let pass = 0, fail = 0;
  const lines = ['══ 反向测试：喂构造样本，确认它报的是那个样本的真数 ══', ''];
  for (const c of CASES) {
    const got = analyze(c.text, c.num);
    const okN = got.numbered.length === c.exp.n;
    const okMax = got.maxMinor === c.exp.max;
    const okCn = got.cnTop.length === c.exp.cn;
    const okGap = JSON.stringify(got.gaps) === JSON.stringify(c.exp.gaps);
    let ok = okN && okMax && okCn && okGap;
    let extra = '';
    if (c.control) {
      const ctrl = analyze(c.text, c.control.num);
      const okCtrl = ctrl.numbered.length === c.control.expN;
      extra = ' · 反向对照(前缀"' + c.control.num + '" 应数出 ' + c.control.expN + ')：' + (okCtrl ? '✅' : '❌') + '（实际 ' + ctrl.numbered.length + '）';
      ok = ok && okCtrl;
    }
    if (ok) { pass++; lines.push('  ✅ ' + c.name); }
    else {
      fail++;
      lines.push('  ❌ ' + c.name);
      lines.push('       期望 编号=' + c.exp.n + ' 最大=' + c.exp.max + ' 中文=' + c.exp.cn + ' 缺口=' + JSON.stringify(c.exp.gaps));
      lines.push('       实际 编号=' + got.numbered.length + ' 最大=' + got.maxMinor + ' 中文=' + got.cnTop.length + ' 缺口=' + JSON.stringify(got.gaps));
    }
    if (extra) lines.push('      ' + extra);
  }
  lines.push('');
  lines.push((fail === 0 ? '✅' : '❌') + ' 反向测试 ' + pass + ' 通过 · ' + fail + ' 未通过  ⇒ ' + (fail === 0 ? '★ 允许把本工具的输出用于交付物' : '★ 禁止使用本工具的输出'));
  console.log(lines.join('\n'));
  return fail === 0;
}

// ══════════════════════════════════════════════════════════════════
const argv = process.argv.slice(2);
if (argv.includes('--selftest')) { process.exit(selftest() ? 0 : 1); }

let files = [];
if (argv[0] === '--dir') {
  const d = argv[1];
  files = fs.readdirSync(d).filter(f => /^\d\d-.*\.md$/.test(f)).sort().map(f => path.join(d, f));
} else {
  files = argv.filter(a => !a.startsWith('--'));
}
if (!files.length) { console.log('用法：node _sections.cjs --selftest | <file...> | --dir <dir>'); process.exit(2); }

console.log('文件'.padEnd(36) + '编号节'.padStart(7) + '范围'.padStart(11) + '中文节'.padStart(7) + '缺口');
console.log('-'.repeat(84));
for (const p of files) {
  const s = fs.readFileSync(p, 'utf8');
  const base = path.basename(p);
  const guess = +base.slice(0, 2);                 // 04 -> 4
  const r = analyze(s, guess);
  // ★ 自检：若一个大节号都没数到，但文件里确实有「## <数字>.」样式的标题 ⇒ 报解析可疑
  const looksNumbered = /^## \d{1,3}\.\d{1,3}/m.test(s);
  let note = r.gaps.length ? '缺 ' + r.gaps.join(',') : '—';
  if (r.numbered.length === 0 && looksNumbered) note = '⚠ 解析可疑（文件有编号标题却数出 0）';
  const range = r.numbered.length ? (guess + '.' + Math.min(...r.minors) + '–' + guess + '.' + r.maxMinor) : '—';
  console.log(base.padEnd(36) + String(r.numbered.length).padStart(7) + range.padStart(11) + String(r.cnTop.length).padStart(7) + '  ' + note);
}
