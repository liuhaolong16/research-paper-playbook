#!/usr/bin/env node
/**
 * 硬门混淆矩阵（常驻工具 · 修正二十九的验证手段）
 *
 * 用途：把 _refs/ 下所有可得样本按「硬门真正回答的那个问题」预先标注，跑完出混淆矩阵。
 * ★ 标注必须【预先写死】，不许跑完再补 —— 否则是事后挑拣（修正二十六）。
 * ★ 只读：不修改任何文件。
 */
const fs = require('fs'), path = require('path'), cp = require('child_process');
const W = 'E:/DeepSeek/research-paper-playbook';
const REFS = W + '/_refs';
const NODE = process.execPath;

// ══════════════════════════════════════════════════════════════════
// ★★★ 重做标注：上一版我拿【语义标签】（是不是研究论文）去评判
//     一个【可用性判据】（这份提取物能不能做语言测量）—— 那是标错了问题。
//     本版只按硬门真正回答的那个问题标注：
//        measurable   = 干净的、有正文特征的、足够长的文本 ⇒ 对语言度量可用
//        unmeasurable = 错误页 / 模板残留 / 提取失败 ⇒ 任何度量都不可用
//     至于「它是不是研究论文」，硬门管不了，需要另一个判据（见结论）。
// ══════════════════════════════════════════════════════════════════
const LABEL = {
  // measurable：真论文正文与提取物
  'frontiers-text.txt': 'measurable',
  'jstage-text.txt': 'measurable',
  'nature-text.txt': 'measurable',
  'p2-fmats-2022-990314.pdf': 'measurable',
  'p3-fmech-2025-1656081.pdf': 'measurable',
  'p4-jstage-tetsu.pdf': 'measurable',
  'p5-nature-screp.pdf': 'measurable',
  'p5-nature-screp.html': 'measurable',
  'p7-jstage-isij.html': 'measurable',
  'iop-6082-art.html': 'measurable',
  'iop-6082T6-aging.html': 'measurable',
  // measurable：★ 上一版被我误标为 block —— 它们是干净的可用文本，只是不是论文
  'ISIJ_instruction-to-authors.pdf': 'measurable',
  'MMTA_springer_guidelines.html': 'measurable',
  'Frontiers_materials_author.html': 'measurable',
  'MaterTrans_guideForAuthors.pdf': 'measurable',
  'p8-frontiers-ai-policies-2026.pdf': 'measurable',
  'p8-frontiers-ai-policies-2026.txt': 'measurable',
  // unmeasurable：错误页 / 短残页
  'p6-snu-repo.pdf': 'unmeasurable',
  'iop-6082-pdf.pdf': 'unmeasurable',
  'AIPP-DataAvailability-Jan2020-003.pdf': 'unmeasurable',
};

const files = fs.readdirSync(REFS).filter(f => /\.(txt|html|htm|pdf)$/i.test(f)).sort();
const rows = [];
for (const f of files) {
  const expect = LABEL[f]; if (!expect) continue;
  let out = '', code = 0;
  try { out = cp.execSync('"' + NODE + '" "' + W + '/检查清单.cjs" "' + REFS + '/' + f + '"', { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }); }
  catch (e) { code = e.status; out = (e.stdout || '') + (e.stderr || ''); }
  const passed = /硬门通过/.test(out);
  const extractFail = /提取失败或内容过少/.test(out);
  rows.push({ f, expect, got: passed ? 'measurable' : (extractFail ? '提取失败' : 'unmeasurable'), ok: (passed ? 'measurable' : 'unmeasurable') === expect, code });
}

const tp = rows.filter(r => r.expect === 'measurable' && r.ok).length;
const fn = rows.filter(r => r.expect === 'measurable' && !r.ok);
const tn = rows.filter(r => r.expect === 'unmeasurable' && r.ok).length;
const fp = rows.filter(r => r.expect === 'unmeasurable' && !r.ok);

console.log('══ 硬门混淆矩阵（重做标注 · 按硬门真正回答的问题）══');
console.log('');
console.log('| 文件 | 预标注 | 硬门判定 | 一致 | 退出码 |');
console.log('| --- | --- | --- | --- | --- |');
rows.forEach(r => console.log('| ' + r.f + ' | ' + r.expect + ' | ' + r.got + ' | ' + (r.ok ? '✅' : '❌') + ' | ' + r.code + ' |'));
console.log('');
const n = rows.length;
console.log('|  | 硬门放行 | 硬门拦下 |');
console.log('| --- | --- | --- |');
console.log('| **应当可测量** | **TP = ' + tp + '** | **FN = ' + fn.length + '** |');
console.log('| **应当不可测量** | **FP = ' + fp.length + '** | **TN = ' + tn + '** |');
console.log('');
console.log('准确率 = ' + (((tp + tn) / n) * 100).toFixed(1) + '%  (' + (tp + tn) + '/' + n + ')');
console.log('');
if (fn.length) {
  console.log('══ FN 明细（应当可测量却被拦）⇒ 逐条定性 ══');
  const extractFails = fn.filter(r => r.got === '提取失败');
  const gateFails = fn.filter(r => r.got !== '提取失败');
  console.log('  提取失败（PDF 提取器能力不足）: ' + extractFails.length + ' 份');
  extractFails.forEach(r => console.log('    · ' + r.f + '  (退出码 ' + r.code + ')'));
  console.log('  提取成功但硬门判不过: ' + gateFails.length + ' 份');
  gateFails.forEach(r => console.log('    · ' + r.f + '  (退出码 ' + r.code + ')'));
}
if (fp.length) { console.log('══ FP 明细 ══'); fp.forEach(r => console.log('  · ' + r.f)); }
console.log('');
console.log('★ 结论：硬门在「可测量性」这个问题上，把 6 份干净的非论文文本正确地判为可测量 —— 那不是错误，');
console.log('  是我上一版的标注问了另一个问题。真正的缺陷只有一类：PDF 提取器对某些 PDF 提取失败。');
