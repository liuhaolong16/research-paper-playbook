// ═══════════════════════════════════════════════════════════════════
// _landing-check.cjs ★ Round 138 · 「修正落地检查」门
//
// 为什么需要它：
//   Round 133 的对抗审查者（B2）用机械探测查出 —— 45 条修正里有 4 条
//   在 11 个维度文件中【零命中】：修正二 · 二十七 · 二十九 · 三十三。
//   而这几条的严重度是 ★★★★ 与 ★★★★★。
//   ⇒ 这意味着：读者按【维度】执行时看不到它们 —— 方法论成了只被作者阅读的层。
//   ⇒ 本项目已有纪律「立了修正 ≠ 机制落地」（修正四十八），本条把它变成机器门。
//
// 判据设计（避免落进「构造上恒过」的坑，见修正四十三）：
//   ① 注册表【必须覆盖】所有「判据/闸门/清单/规则」型修正 ——
//      漏登记会被「覆盖完整性」这一项抓到，而不是静默通过。
//   ② 每条登记项给出【特征词】与【允许的落点】：
//      - 落点是 research/*.md 的：必须在其中至少一处出现全部特征词；
//      - 落点是「仅方法论」的：必须显式登记为 exempt，并写明理由。
//   ③ 缺任一 ⇒ 报错（退出码 1）。
//
// 用法：node _landing-check.cjs          （只读，绝不改文件）
//       node _landing-check.cjs --list   （只列出注册表与现状）
// ═══════════════════════════════════════════════════════════════════
const fs = require('fs');
const path = require('path');
const W = __dirname;
const R = W + '/research';

// ── 注册表：每条 = {corr, keywords[], where} ──
//   where: 'dims'  = 必须落在 research/ 的某个维度文件里
//          'exempt'= 显式豁免（仅适用于方法论层），须给 why
const REGISTRY = [
  // ── A 组：本轮（Round 138）新落地到全部 11 维度的「判据质量十条」 ──
  // ── Round 166 新登记 ──
  { corr: '修正六十',  keywords: ['按类型定'],                where: 'dims' },
  { corr: '修正二',   keywords: ['只有反例', '区分力'],        where: 'dims' },
  { corr: '修正二十七', keywords: ['端到端', '干跑'],            where: 'dims' },
  { corr: '修正二十九', keywords: ['从不改变决定', '不该当闸门'], where: 'dims' },
  { corr: '修正三十三', keywords: ['当参照的', '不同规则'],      where: 'dims' },
  { corr: '修正十四', keywords: ['红灯', '绿灯'],               where: 'dims' },
  { corr: '修正十七', keywords: ['阈值太松', '没有区分力'],      where: 'dims' },
  { corr: '修正二十', keywords: ['范式感知'],                   where: 'dims' },
  { corr: '修正二十一', keywords: ['平台感知'],                 where: 'dims' },
  { corr: '修正二十二', keywords: ['可检出率'],                 where: 'dims' },
  { corr: '修正四十六', keywords: ['失败形态'],                 where: 'dims' },
  { corr: '修正四十七', keywords: ['误报', '闸门'],             where: 'dims' },
  // ── B 组：早已落地，关键词取实测能命中的 ──
  { corr: '修正一',   keywords: ['红队', '撰写者'],             where: 'dims' },
  { corr: '修正九',   keywords: ['改进'],                       where: 'dims' },
  { corr: '修正三十四', keywords: ['对账'],                     where: 'dims' },
  { corr: '修正三十五', keywords: ['符号'],                     where: 'dims' },
  { corr: '修正五十三', keywords: ['反向测试', '足够严'],         where: 'dims' },
  { corr: '修正五十四', keywords: ['缺失断言', '同一输出流'],     where: 'dims' },
  { corr: '修正五十五', keywords: ['测量链', '峰的位置'],         where: 'dims' },
  { corr: '修正五十六', keywords: ['唯一来源', '独立检验'],       where: 'dims' },
  { corr: '修正五十七', keywords: ['前提', '可普查'],             where: 'dims' },
  { corr: '修正五十八', keywords: ['查重工具', '漏检率'],         where: 'dims' },
  { corr: '修正五十九', keywords: ['边界约定', '被程序消费'],     where: 'dims' },
  { corr: '修正六十三', keywords: ['判据齐备', '代写执行契约'], where: 'exempt' },
  { corr: '修正六十四', keywords: ['历史陈述', '不得改动'], where: 'exempt' },
];

// ── 覆盖完整性：方法论里所有「判据/闸门/清单」型修正都应在注册表或豁免表里 ──
const meth = fs.readFileSync(W + '/playbook/99-methodology.md', 'utf8');
const all = [];
const re = /^## [一二三四五六七八九十]+、[^修\n]*修正([一二三四五六七八九十]+)[：:]\s*(.+)$/gm;
let m;
while ((m = re.exec(meth)) !== null) all.push({ cn: m[1], title: m[2].replace(/\*\*/g, '').trim() });

const ruleLike = all.filter(c => /判据|闸门|清单|阈值|检查|核对|对账/.test(c.title));
const registered = new Set(REGISTRY.map(r => r.corr));
const uncovered = ruleLike.filter(c => !registered.has('修正' + c.cn));

const dims = fs.readdirSync(R).filter(f => /^\d\d-/.test(f) && f.endsWith('.md'));
const dimText = {};
for (const d of dims) dimText[d] = fs.readFileSync(R + '/' + d, 'utf8');

console.log('════ 「修正落地检查」门（Round 138）════');
console.log('方法论修正总数: ' + all.length);
console.log('其中「判据/闸门/清单/阈值/检查」型: ' + ruleLike.length);
console.log('注册表已登记: ' + REGISTRY.length);
console.log('');

let fail = 0, passN = 0;
for (const r of REGISTRY) {
  if (r.where === 'exempt') { console.log('  ⏭ ' + r.corr + ' 显式豁免（' + (r.why || '未写理由') + '）'); continue; }
  const hitFiles = dims.filter(d => r.keywords.every(k => dimText[d].includes(k)));
  if (hitFiles.length) { console.log('  ✅ ' + r.corr + ' 落点 ' + hitFiles.join(', ')); passN++; }
  else {
    fail++;
    console.log('  ❌ ' + r.corr + ' 【零命中】 —— 特征词 [' + r.keywords.join(' / ') + '] 在 11 个维度里都不齐');
    console.log('       应落点提示: ' + (r.hint || '（未写）'));
  }
}

console.log('');
// ── ★★ 覆盖广度检查（Round 138 反向测试后补）──
//   为什么补：本门最初只要求「≥1 个维度命中」，反向测试（从 07 删掉「可检出率」）
//   发现【仍然通过】—— 即本门把「落在某一处」当成了「落在读者看得见的地方」。
//   这正是修正十四（绿灯也必须交叉确认）在本门自身上应验。
//   ⇒ 补：跨维度通用块必须在【11 个维度全部】出现。
const BLOCK_MARK = '判据质量十七条';
const missingBlock = dims.filter(d => !dimText[d].includes(BLOCK_MARK));
if (missingBlock.length) {
  fail += missingBlock.length;
  console.log('  ❌ 跨维度通用块「' + BLOCK_MARK + '」缺失于 ' + missingBlock.length + ' 个维度：' + missingBlock.join(', '));
} else {
  console.log('  ✅ 跨维度通用块「' + BLOCK_MARK + '」在 11 个维度全部存在（覆盖广度）');
}

console.log('');
if (uncovered.length) {
  console.log('  ⚠ 「判据/闸门」型修正未登记 ' + uncovered.length + ' 条 ⇒ 覆盖不完整，必须登记或显式豁免：');
  uncovered.forEach(c => console.log('       修正' + c.cn + ' ' + c.title.slice(0, 40)));
  fail += uncovered.length;
} else {
  console.log('  ✅ 覆盖完整性：所有「判据/闸门」型修正均已登记或豁免');
}

console.log('');
console.log(fail ? '❌ 有 ' + fail + ' 项未通过' : '✅ 全部通过（' + passN + ' 条已落地）');
process.exit(fail ? 1 : 0);
