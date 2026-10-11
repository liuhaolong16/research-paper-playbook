// ═══════════════════════════════════════════════════════════════════
// _build-checklist.cjs ★ Round 176 · 跨 11 维「投稿前总检查表」生成器
//
// 为什么需要它：
//   11 个维度各有「验收判据」节（09 叫「自检清单」），合计 107 条 `- [ ]` 验收项。
//   但它们【散在 11 个文件里】⇒ 作为「照它做就能答辩/投 SCI」的方案，
//   最该有的【跨维总检查表】反而不存在。
//
// 两条设计纪律：
//   ① 【机械抽取，不手抄】—— 内容逐字来自各维度源文件；手抄必然引入转录误差。
//   ② 【可校验】—— 生成时记录每条来源与各维复选框集合的哈希；`--check` 能验
//      「总表与源文件是否仍然同步」⇒ 否则聚合产物必然过期（这正是聚合类风险的根）。
//
// 用法：
//   node _build-checklist.cjs            → 生成 投稿前总检查表.md
//   node _build-checklist.cjs --check    → 只校验同步（只读，供门使用）
//   node _build-checklist.cjs --stat     → 只打印统计
// ═══════════════════════════════════════════════════════════════════
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const W = __dirname;
const NL = String.fromCharCode(10);
const OUT = path.join(W, '投稿前总检查表.md');
const MAN = path.join(W, '_checklist-manifest.json');

const NAMES = {
  '01-topic-selection': '01 选题',
  '02-framework': '02 框架',
  '03-structure': '03 结构',
  '04-databases': '04 数据库',
  '05-references': '05 参考文献',
  '06-content': '06 内容',
  '07-abstract': '07 摘要',
  '08-writing-style': '08 写法',
  '09-dedup-and-ai-rate': '09 降重与降 AI 率',
  '10-statistics': '10 统计',
  '11-image-integrity': '11 图像完整性',
};

function collect() {
  const out = [];
  for (const f of fs.readdirSync(path.join(W, 'research')).filter(x => /^\d\d-/.test(x) && x.endsWith('.md')).sort()) {
    const key = f.replace('.md', '');
    const lines = fs.readFileSync(path.join(W, 'research', f), 'utf8').split(NL);
    const items = [];
    lines.forEach((l, i) => {
      const m = l.match(/^\s*-\s*\[ \]\s*(.+?)\s*$/);
      if (m) items.push({ text: m[1], line: i + 1 });
    });
    out.push({ key, name: NAMES[key] || key, file: 'research/' + f, items, hash: crypto.createHash('sha256').update(items.map(x => x.text).join('\u0001')).digest('hex').slice(0, 16) });
  }
  return out;
}

// 机械分类：只按题面自身出现的词（不做语义判断）
function classify(t) {
  const tags = [];
  if (/SCI|英文|投稿|期刊|目标刊|审稿/.test(t)) tags.push('SCI 线');
  if (/答辩|本校|学位论文|盲审|送审|学院|研究生院/.test(t)) tags.push('答辩线');
  if (!tags.length) tags.push('两线共用');
  return tags;
}

function build(dims) {
  const total = dims.reduce((x, d) => x + d.items.length, 0);
  const L = [];
  L.push('# 投稿前总检查表');
  L.push('');
  L.push('> **这份表是什么**：**把 11 个维度各自的「验收判据」节里的 **' + total + ' 条可勾选验收项**，**汇总成一张**交稿前能逐条打勾的总表****。');
  L.push('> **⇒ **为什么要汇总****：**它们本来**散在 11 个维度文件里****（**各自 3,400–4,000 字符**）** ⇒ **照单一维度执行的人**看不到别的维度的判据****；**而「照它做就能答辩 / 投 SCI」要求的是**全过**。');
  L.push('> **⇒ **★ 它不是手抄的**：**由 `_build-checklist.cjs` **从各维度源文件机械抽取****（**逐字**）**，**并记录每维复选框集合的哈希**** ⇒ **`--check` 可验是否仍同步****。');
  L.push('> **⇒ **★ 权威源始终是各维度文件**：**本表是**视图**，**若有冲突以源文件为准****。');
  L.push('');
  L.push('## 用法');
  L.push('');
  L.push('**⇒ **① 交稿前**逐条打勾**；**打不上勾的项**，回到它所属维度看细则****。');
  L.push('**⇒ **② 表中每条都带 `[维度 · 源文件行号]`** ⇒ **可一键跳回原文核对**。');
  L.push('**⇒ **③ 分线视图见第二部分** —— **★ 分类只按题面出现的词**（**`SCI` / `答辩` / `本校`…**）**，**不做语义判断** ⇒ **漏分或多分都可能，**以维度原文为准****。');
  L.push('');
  L.push('---');
  L.push('');
  L.push('## 一、按维度逐条（共 ' + total + ' 条）');
  L.push('');
  for (const d of dims) {
    L.push('### ' + d.name + '（' + d.items.length + ' 条） · `' + d.file + '`');
    L.push('');
    for (const it of d.items) L.push('- [ ] ' + it.text + '  `[' + d.name.split(' ')[0] + ' L' + it.line + ']`');
    L.push('');
  }
  L.push('---');
  L.push('');
  L.push('## 二、按线分组（**机械分类，仅按题面词**）');
  L.push('');
  const buckets = { 'SCI 线': [], '答辩线': [], '两线共用': [] };
  for (const d of dims) for (const it of d.items) for (const t of classify(it.text)) buckets[t].push({ d, it });
  for (const k of ['SCI 线', '答辩线', '两线共用']) {
    L.push('### ' + k + '（' + buckets[k].length + ' 条）');
    L.push('');
    for (const { d, it } of buckets[k]) L.push('- [ ] ' + it.text + '  `[' + d.name + ' L' + it.line + ']`');
    L.push('');
  }
  L.push('---');
  L.push('');
  L.push('## 三、统计');
  L.push('');
  L.push('| 维度 | 条数 | 复选框集合哈希 |');
  L.push('| --- | --- | --- |');
  for (const d of dims) L.push('| **' + d.name + '** | ' + d.items.length + ' | `' + d.hash + '` |');
  L.push('| **合计** | **' + total + '** | — |');
  L.push('');
  L.push('> **⚠ 本表的边界（如实记）**');
  L.push('> **① **只收 `- [ ]` 形态的验收项** ⇒ **维度里以其他形态写的判据 / 阈值**（**如 05 的「判据质量十七条」、07 的「四要素清单」**）**不进本表****，**它们是**判据的判据**或**写作指南**，**不是勾选项****。');
  L.push('> **② **09 维度的对应节标题是「**自检清单（交稿前逐条过）**」**（**其余 10 维叫「**验收判据**」**）** ⇒ **本表按\[内容\]收，**不按标题收****。');
  L.push('> **③ **分类是**机械的****（**`SCI` / `答辩` / `本校` 等词**）** ⇒ **★ **只作导航，**不作判据****。');
  L.push('');

  fs.writeFileSync(OUT, L.join(NL), 'utf8');
  fs.writeFileSync(MAN, JSON.stringify({ builtAt: new Date().toISOString(), total, dims: dims.map(d => ({ key: d.key, file: d.file, n: d.items.length, hash: d.hash })) }, null, 2), 'utf8');
  return total;
}

const dims = collect();
const mode = process.argv[2] || '';

if (mode === '--stat') {
  dims.forEach(d => console.log('  ' + d.name.padEnd(20) + String(d.items.length).padStart(3) + ' 条  ' + d.hash));
  console.log('  ⇒ 合计 ' + dims.reduce((x, d) => x + d.items.length, 0) + ' 条');
} else if (mode === '--check') {
  if (!fs.existsSync(MAN)) { console.log('  ❌ 无清单快照 —— 先跑 node _build-checklist.cjs'); process.exitCode = 1; }
  else {
    const m = JSON.parse(fs.readFileSync(MAN, 'utf8'));
    const cur = new Map(dims.map(d => [d.key, d]));
    const bad = [];
    for (const r of m.dims) {
      const c = cur.get(r.key);
      if (!c) { bad.push(r.key + ' 源文件消失'); continue; }
      if (c.hash !== r.hash) bad.push(r.key + ' 复选框集合已变（' + r.n + ' → ' + c.items.length + ' 条）');
    }
    for (const d of dims) if (!m.dims.some(r => r.key === d.key)) bad.push(d.key + ' 是新增维度，总表未含');
    const tot = dims.reduce((x, d) => x + d.items.length, 0);
    if (tot !== m.total) bad.push('总条数 ' + m.total + ' → ' + tot);
    console.log('  总表 vs 源文件：' + (bad.length ? '❌ ' + bad.join(' / ') : '✅ 同步（' + tot + ' 条 · ' + dims.length + ' 维）'));
    if (bad.length) process.exitCode = 1;
  }
} else {
  const total = build(dims);
  console.log('✅ 已生成 投稿前总检查表.md：' + total + ' 条 · ' + dims.length + ' 维');
  console.log('   文件 ' + fs.statSync(OUT).size + ' 字节');
}
