/**
 * 提取质量五指标（常驻工具 · Round 129）
 *
 * 用途：给一份 PDF 的提取物算五个指标，判断「提取器报成功」是真成功还是静默垃圾。
 *   四个【内容层】：① 可打印占比  ② 字母占比  ③ ≥4字母词数  ④ 已知关键词命中
 *   一个【结构层】：⑤ 每百字符换行数（+ 行长中位数/均值/变异系数）
 *
 * ★★★ 使用前必读（Round 129 实测结论 · 修正四十一）：
 *   ⑤ 结构指标在本机【不具判别力】—— 已知垃圾 0.30 vs 真实论文 0.21（真论文反而更低）。
 *   原因：本仓提取器按 PDF 内容流取字面量拼接，与版面换行无关，段落结构在提取阶段就被抹掉。
 *   ⇒ 所以 ⑤ 只能当「版面是否被保留」的诊断，**不能当真假判据**。
 *   ⇒ 真正有效的是四个内容层比值；且本仓提取器对【多数真 PDF】也不可靠
 *     （真实 Frontiers 论文仅 43.3% 可打印 / 27.9% 字母占；J-STAGE 论文一个字都取不出）。
 *
 * ★ 只读：不修改任何文件。
 * 用法：node _extract-quality.cjs <file.pdf>
 */

const fs = require('fs'), zlib = require('zlib');
const src = process.argv[2];
const buf = fs.readFileSync(src);
const S = buf.toString('latin1');

let outs = [], i = 0, n = 0;
while (true) {
  const s = S.indexOf('stream', i);
  if (s < 0) break;
  if (S.slice(Math.max(0, s - 3), s) === 'end') { i = s + 6; continue; }
  let p = s + 6;
  if (buf[p] === 0x0d) p++;
  if (buf[p] === 0x0a) p++;
  const e = S.indexOf('endstream', p);
  if (e < 0) break;
  const chunk = buf.slice(p, e);
  let inf = null;
  try { inf = zlib.inflateSync(chunk); } catch (err) { try { inf = zlib.inflateRawSync(chunk); } catch (e2) { inf = null; } }
  n++;
  if (inf) outs.push(inf.toString('latin1'));
  i = e + 9;
}
const text = outs.join('\n');
const lits = [];
const re = /\((?:\\.|[^\\()])*\)/g;
let m;
while ((m = re.exec(text)) !== null) {
  lits.push(m[0].slice(1, -1).replace(/\\n/g, '\n').replace(/\\r/g, '').replace(/\\t/g, ' ').replace(/\\([()\\])/g, '$1'));
}
let t = lits.join(' ');
t = t.replace(/[ \t]{2,}/g, ' ');
t = t.replace(/([\u4e00-\u9fff]) (?=[\u4e00-\u9fff])/g, '$1');

// ═══ 五个指标：四个内容层 + 一个结构层（Round 129 新增）═══
const total = t.length || 1;
const noSpace = t.replace(/\s/g, '').length || 1;
const printable = (t.match(/[\x20-\x7e\u4e00-\u9fff]/g) || []).length;   // 可打印 + 中日韩
const latin = (t.match(/[A-Za-z]/g) || []).length;
const words = t.match(/[A-Za-z]{4,}/g) || [];
const KEY = ['error bar', 'replicate', 'sample size', 'statistic', 'standard deviation', 'confidence interval', 'p value', 'methods', 'results', 'figure', 'table'];
const keyHits = KEY.reduce((s, k) => s + (t.toLowerCase().split(k).length - 1), 0);
// 结构指标（月流的补强）
const newlines = (t.match(/\n/g) || []).length;
const per100 = (newlines / total) * 100;                                  // 每百字符换行数
const lines = t.split('\n').map(x => x.trim()).filter(Boolean);
const lens = lines.map(x => x.length).sort((a, b) => a - b);
const median = lens.length ? lens[Math.floor(lens.length / 2)] : 0;
const mean = lens.length ? Math.round(lens.reduce((a, b) => a + b, 0) / lens.length) : 0;
const cv = (() => {                                                       // 行长的变异系数
  if (lens.length < 2) return 0;
  const mu = lens.reduce((a, b) => a + b, 0) / lens.length;
  const sd = Math.sqrt(lens.reduce((a, b) => a + (b - mu) ** 2, 0) / lens.length);
  return sd / (mu || 1);
})();

const pad = (s, n) => String(s).padStart(n);
console.log('════ 五指标（四个内容层 + 一个结构层）════');
console.log('  ① 可打印占比     ' + pad((printable / total * 100).toFixed(1), 6) + '%   （正常 ≈100%）');
console.log('  ② 字母占比       ' + pad((latin / noSpace * 100).toFixed(1), 6) + '%   （正常 ≥50%）');
console.log('  ③ ≥4 字母词数    ' + pad(words.length, 6) + '     （正常数千）');
console.log('  ④ 已知关键词命中 ' + pad(keyHits, 6) + '     （正常 >0）');
console.log('  ── 以上四个全在【内容层】──');
console.log('  ⑤ ★ 结构指标：每百字符换行数  ' + pad(per100.toFixed(2), 6) + '  （真实文档通常 >0.5）');
console.log('     行数 ' + pad(lines.length, 6) + ' · 行长中位数 ' + pad(median, 5) + ' · 均值 ' + pad(mean, 5) + ' · 变异系数 ' + cv.toFixed(3));
console.log('');
const bad = [printable / total < 0.9, latin / noSpace < 0.4, words.length < 100, keyHits === 0];
console.log('  四内容指标判定: ' + bad.map((b, k) => ['①', '②', '③', '④'][k] + (b ? '❌' : '✅')).join(' '));
console.log('  结构指标判定  : ' + (per100 < 0.5 ? '❌ 换行稀疏，符合「垃圾填充无自然段落结构」' : '✅'));
console.log('');
console.log('  ⇒ 提取物前 200 字符: ' + JSON.stringify(t.slice(0, 200)));
