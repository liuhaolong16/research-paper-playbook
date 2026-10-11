#!/usr/bin/env node
/**
 * 残留扫描器（修正二十五的落地工具）
 * 用法: node _check-residue.cjs
 *
 * 用途：某条结论被更正/推翻后，扫描全仓，找出「旧说法还在哪里出现」。
 *
 * 原理：对每个已废除的结论写一条正则 → 全仓逐行扫
 *       → 排除「带已处理标记的行」及其前后两行
 *       → 剩下的就是候选残留（脚本给候选，最终判断由人做）
 *
 * 维护：新增一条「已废除的结论」时，往 RETIRED 数组里加一项。
 */
const fs = require('fs'), path = require('path');
const W = __dirname;
// ★ Round 170：可选根目录 —— 供 _branch-test.cjs 在【临时副本】上做注入测试，
//   避免「一道只读的检查门为了测自己而去改写真源文件」。
//   用法: node _check-residue.cjs [根目录]   （缺省 = 脚本所在目录）
const ROOT = process.argv[2] || W;

// ══════════ 已废除/已更正的结论清单 ══════════
const RETIRED = [
  {
    id: 'R88-A',
    claim: '「构思与假设形成被多数出版社列为不应使用 AI」',
    replacedBy: '「出版社之间直接矛盾」：四社研究说 Mostly forbidden，Elsevier 明确允许 generating ideas',
    patterns: [
      /构思与假设形成被多数出版社/,
      /构思与假设形成[^\n]{0,20}不应使用 AI(?![^\n]*更正)/,
      /❌ 普遍被禁（不要做）\*\* \| \*\*构思/,
      // ★ 下面两条是 Round 93 红队第 1 条补的 —— 上面三条【漏掉了真实存活的那句】。
      //   漏因：原三条都在匹配「旧结论的原文措辞」，而残留那句用了另一种说法。
      //   教训：残留检测的正则不能只写「原文」，还要写「同义改写」与「断言性总结」。
      /多数出版社的政策这么写/,
      /多数出版社(禁止|列为)[^\n]{0,30}(构思|假设|想法)/,
      /(替你想出|外包给 AI)[^\n]{0,20}(研究问题|假设)[^\n]{0,10}不行/,
    ]
  },
  {
    id: 'R88-B',
    claim: '「披露写在 Materials and Methods，两份独立来源都指向 ⇒ 可定为标准做法」',
    replacedBy: '「没有通例 —— 至少三处位置」（Elsevier 用独立 AI declaration statement）',
    patterns: [
      /两份独立来源都指向/,
      /可定为标准做法/,
      /披露写在 `Materials and Methods`(?![^\n]*更正)/,
    ]
  },
];

// ══════════ 忠实引述豁免（修正二十五·补充三）══════════
// 若某行是【逐字引述来源表】的内容，它不算残留 —— 但必须同时满足三个条件：
//   ①明确标注来源 ②文本上明示「这是来源的主张」 ③若已被另证推翻，须在附近加对冲说明。
// 实现：不整行豁免，而是【要求附近存在对冲/归属标记】。见 FOIL 常量。
const FOIL = /★ 但这个|被另两家|已被推翻|已被证伪|转引|原文|该文|Reproduced|逐字/;

// 已处理标记。三类词都算：
//   ①真·更正动作词（更正/作废/已修正/改为/按目标刊…）
//   ②★「把残留当案例叙述」的词（仍写 / 仍以肯定句 / 的一节标题 / 残留 / 候选 / 这正是被…推翻）
//   ③本工具自身的记录词
//
// ★ 关于 ②（已实测三次）：
//   每次给扫描器加规则、或把它的发现写进方法论时，那段新写的文字本身就会包含旧结论的原话，
//   于是被自己的规则扫到。第 1 次（Round 92）2 处、第 2 次（Round 93）2 处、本次沿用同一处理。
//   ⇒ 这不是脚本坏了，是「被扫描对象包含对扫描结果的描述」这一结构决定的（归纳见 99-methodology 修正二十五·补充一）。
//   ⇒ 处理方式固定为：把假阳性的判断结果【回写进本白名单】。
const HANDLED = /更正|作废|已修正|已删除|旧说法|修改为|改为|不再|撤回|Round \d|不允许当通例|没有通例|按目标刊|争议最大|它\*\*不是\*\*在说|仍写|仍以肯定句|的一节标题|残留|候选|这正是被|被 Elsevier 推翻/;

// ══════════ 扫描 ══════════
const files = [];
(function walk(d) {
  for (const f of fs.readdirSync(d)) {
    const p = path.join(d, f);
    if (fs.statSync(p).isDirectory()) { if (!/^_/.test(f)) walk(p); }
    else if (f.endsWith('.md')) files.push(p);
  }
})(ROOT);

console.log('残留扫描器 · 扫 ' + files.length + ' 个 md 文件 · ' + RETIRED.length + ' 条已废除结论');
console.log('');
let total = 0;
for (const item of RETIRED) {
  console.log('══ ' + item.id + ' · ' + item.claim);
  console.log('   已被取代为：' + item.replacedBy);
  let hits = 0, handled = 0;
  const suspects = [];
  for (const f of files) {
    const rel = path.relative(W, f).replace(/\\/g, '/');
    const lines = fs.readFileSync(f, 'utf8').split('\n');
    lines.forEach((l, i) => {
      if (!item.patterns.some(re => re.test(l))) return;
      hits++;
      // ★ 只检查【同一行】—— 不查前后行。
      // 原因（Round 93 红队第 1 条）：原先查 ±2 行 ⇒ 若「已处理标记」出现在 2 行之外，
      // 该行就会被【系统性】豁免。实测：01-topic-selection.md L239 的残留，「按目标刊」恰在 L241（+2），
      // 于是被漏掉。窗口越宽，漏得越系统。
      if (HANDLED.test(l)) { handled++; return; }
      suspects.push(rel + ':' + (i + 1) + '  ' + l.trim().slice(0, 150));
    });
  }
  console.log('   命中 ' + hits + ' 行 · 已处理标记 ' + handled + ' 行 · ★ 候选残留 ' + suspects.length + ' 行');
  suspects.forEach(s => console.log('     ⚠ ' + s));
  total += suspects.length;
  console.log('');
}
console.log('══════════════════════════════════');
if (total === 0) {
  console.log('✅ 候选残留 0 行 —— 已废除的结论已从全仓清除（或全部带已处理标记）');
  process.exit(0);
} else {
  console.log('⚠ 候选残留 ' + total + ' 行 —— 请逐条人工判断：是真残留，还是脚本误报');
  console.log('（脚本给候选，不给结论 —— 修正二十五）');
  process.exit(1);
}
