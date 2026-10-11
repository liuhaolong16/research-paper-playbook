#!/usr/bin/env node
/**
 * 科研论文写作方案 · 可执行检查清单
 * 用法: node 检查清单.cjs <论文文件.pdf|.html|.txt> [--lang en|zh]
 *
 * 实现来源: E:\DeepSeek\research-paper-playbook\playbook\99-methodology.md 的 67 条修正 + 统合节
 * 每条检查都标注: 判据 / 适用域 / 可检出率 / 依据的修正号
 * ★ 本工具只做「机械可查」的部分；需要判断的项标 [人工]
 */
const fs = require('fs'), zlib = require('zlib'), path = require('path');

const args = process.argv.slice(2);
const file = args.find(a => !a.startsWith('--'));
if (!file) { console.log('用法: node 检查清单.cjs <论文.pdf|.html|.txt>'); process.exit(10); }
if (!fs.existsSync(file)) { console.log('❌ 文件不存在: ' + file); process.exit(10); }

// ─── 提取（含修正十九的有效性门）───
// ★★★★ 修正三十（Round 101）：extractPdf 的两个真缺陷，都由诊断实测定位 ——
//   ① 原用 raw.indexOf('stream') 找流起点 —— 它会命中 'endstream' 里的 'stream' 子串，
//      导致从垃圾位置开始切片 ⇒ 大量流 inflate 失败（实测 p4：35 个流只成功 1 个）。
//      改为：要求 'stream' 是【独立关键字】（前一个字符是空白或 '>'）。
//   ② 原用 /(Tj|TJ)/ 判断「这个流是不是文本流」—— 那是【子串匹配】，字体定义流里偶尔含
//      'Tj' 两个字母就被误收 ⇒ 产出里混进大量非文本内容（实测 p5：201 个流只有 28 个真含文本操作符，
//      却产出 2.87M 字符、字母占比被稀释到 3.5%）。
//      改为：Tj/TJ 必须【作为独立 token】出现。
function extractPdf(p) {
  const buf = fs.readFileSync(p), raw = buf.toString('latin1');
  if (!raw.startsWith('%PDF')) return null;
  // ★ 修正三十一：加密 PDF 的流是被加密的，inflate 必然失败 —— 这是与「提取失败」不同的原因。
  const encrypted = /\/Encrypt\s/.test(raw);
  if (encrypted) { extractPdf.encrypted = true; return ''; }
  extractPdf.encrypted = false;
  let pos = 0; const texts = []; let nStream = 0, nOk = 0, nText = 0;
  while (true) {
    const i = raw.indexOf('stream', pos); if (i < 0) break;
    // ★ 必须是独立关键字：前一字符为空白或 '>'（排除 endstream）
    const prev = i > 0 ? raw[i - 1] : ' ';
    if (!/[\s>]/.test(prev)) { pos = i + 6; continue; }
    nStream++;
    let s = i + 6; if (raw[s] === '\r') s++; if (raw[s] === '\n') s++;
    const e = raw.indexOf('endstream', s); if (e < 0) break;
    let out = null;
    try { out = zlib.inflateSync(buf.slice(s, e)); }
    catch (err) { try { out = zlib.inflateRawSync(buf.slice(s, e)); } catch (e2) { out = null; } }
    if (out) {
      nOk++;
      const t = out.toString('latin1');
      // ★ 操作符级匹配：Tj / TJ 作为独立 token（前有空白/)/>，后有空白或行尾）
      if (/(?:^|[\s)>])(?:Tj|TJ)(?=[\s\r\n]|$)/.test(t)) { nText++; texts.push(t); }
    }
    pos = e + 9;
  }
  const parts = [];
  for (const t of texts) { const re = /\(((?:\\.|[^\\()])*)\)/g; let m; while ((m = re.exec(t))) parts.push(m[1].replace(/\\([|()\\])/g, '$1')); }
  let c = parts.join(' '); for (let k = 0; k < 3; k++) c = c.replace(/\b([A-Za-z])\s(?=[A-Za-z]\b)/g, '$1');
  const out = c.replace(/\s{2,}/g, ' ');
  // ★ 修正三十一②：字间距残留检测 —— 统计「1~3 个字母 + 单个空格 + 1~3 个字母」的出现密度。
  //   正常英文文本里这个模式占比很低（多为 a/an/the 等）；PDF 拆分提取会让它显著升高。
  //   ★ 只检出、不重组：重组会把 a cat 变成 acat（修正二十八的教训：报正确理由，不假装修好）。
  const spacedPairs = (out.match(/\b[A-Za-z]{1,3}\s[A-Za-z]{1,3}\b/g) || []).length;
  const allWords = (out.match(/\b[A-Za-z]+\b/g) || []).length;
  extractPdf.spacingResidue = allWords > 200 ? spacedPairs / allWords : 0;
  // 把提取统计挂到返回值上，便于诊断（不改变调用方的字符串用法）
  extractPdf.stats = { stream: nStream, inflateOk: nOk, textStream: nText, chars: out.length };
  return out;
}
function extractHtml(p) {
  let h = fs.readFileSync(p, 'utf8');
  h = h.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ')
       .replace(/<svg[\s\S]*?<\/svg>/gi, ' ').replace(/<!--[\s\S]*?-->/g, ' ');
  let t = h.replace(/<[^>]+>/g, '\n').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&')
    .replace(/&#(\d+);/g, (x, d) => String.fromCharCode(+d)).replace(/&[a-z]+;/gi, ' ')
    .replace(/[ \t]+/g, ' ').replace(/\n{2,}/g, '\n').trim();
  return t.replace(/\n/g, ' ').replace(/\s{2,}/g, ' ');
}

const ext = path.extname(file).toLowerCase();
const srcBytes = fs.statSync(file).size;
let text, sourceType;
if (ext === '.pdf') { text = extractPdf(file); sourceType = 'PDF'; }
else if (ext === '.html' || ext === '.htm') { text = extractHtml(file); sourceType = 'HTML'; }
else { text = fs.readFileSync(file, 'utf8'); sourceType = 'TEXT'; }

console.log('═══════════════════════════════════════════════════');
console.log(' 科研论文写作方案 · 可执行检查清单');
console.log(' 文件: ' + path.basename(file) + '  (' + srcBytes + ' 字节, 来源类型 ' + sourceType + ')');
if (sourceType === 'PDF' && extractPdf.stats) {
  const st = extractPdf.stats;
  console.log(' 提取统计: 流 ' + st.stream + ' 个 · inflate 成功 ' + st.inflateOk + ' 个 · 判为文本流 ' + st.textStream + ' 个 · 产出 ' + st.chars + ' 字符');
}
console.log('═══════════════════════════════════════════════════');
console.log('');

// ★ 修正三十一①：加密 PDF 必须在「内容过少」之前单独报，否则会被那条检查先吞掉。
if (sourceType === 'PDF' && extractPdf.encrypted === true) {
  console.log('【第 0 步】提取物有效性门（修正十九）');
  console.log('  ── 提取器状态：★ 该 PDF 已加密 ──');
  console.log('     ⇒ 检测到 /Encrypt ⇒ 流被加密，本工具无法提取。');
  console.log('     ⇒ ★ 处置：这不是「样本作废」，也不是「提取器写错了」——请用 HTML 版或解密后重试（修正三十一①）。');
  console.log('  ⇒ ★ 硬门不通过 —— 原因是【文件已加密】，不是【这不是正文】。');
  process.exit(41);
}
if (!text || text.length < 100) { console.log('❌ 提取失败或内容过少'); process.exit(20); }

// ─── ★ 修正十九 · 补充：门的管线位置（Round 64 由本工具暴露）───
// 门必须跑在【标准清洗后】的文本上 —— 因为「测的」和「门检的」必须是同一个东西。
// 原始提取物里的二进制残留是可以被清洗掉的，它不该让样本作废；
// 但清洗后仍不达标，才说明这个来源真的取不到正文。
const rawLen = text.length;
const rawLetters = (text.match(/[A-Za-z]/g) || []).length;
const rawLetterRatio = rawLen ? rawLetters / rawLen : 0;
text = text.replace(/[^\x20-\x7E\n]/g, ' ').replace(/\s+/g, ' ').trim();   // ← 标准清洗
const garbagePct = (1 - text.length / rawLen) * 100;

// ─── 修正十九：提取物有效性门（跑在清洗后文本上）───
const letters = (text.match(/[A-Za-z]/g) || []).length;
const cjk = (text.match(/[\u4e00-\u9fff]/g) || []).length;
const letterRatio = text.length ? letters / text.length : 0;
const PROBES = ['Abstract', 'Introduction', 'Methods', 'Experimental', 'Results', 'Discussion', 'References'];
const probeHits = PROBES.filter(p => text.includes(p));
const byteRatio = text.length / srcBytes;
// ★★★★ Round 96 干跑发现的缺陷：当输入是 .txt/.md 时，字节比【恒 ≈ 1.0】——
//   因为分子（提取文本）与分母（源文件）是同一个东西。门槛 0.05–0.30/0.50 ⇒ 【必然失败】。
//   ⇒ 实测：3 份 .txt 全部因字节比被判「硬门不通过」而整份作废，而同一篇的 HTML 却正常通过。
//   ⇒ 处置：来源类型为 TEXT 时，字节比判据【不适用】（N/A），不参与硬门；
//     正文特征词仍须过 —— 它单独就能区分「是不是正文」。
//   ⇒ 这是修正十九「来源类型」的第三种情况：PDF / HTML 之后补 TEXT。
const byteRatioApplies = sourceType !== 'TEXT';

// ★★★ 修正二十八：把「提取器失败」与「源文件图文密集」分开 —— 二者都产生低字节比，但处置相反。
//   提取器失败：清洗【前】字母占比极低（提取物基本是二进制/字形垃圾）⇒ 报「该 PDF 提取器不支持」，
//   与「样本作废」区分开，因为对用户的意义完全不同：前者换工具，后者换样本。
const pdfEncrypted = sourceType === 'PDF' && extractPdf.encrypted === true;
const extractorFailed = !pdfEncrypted && sourceType === 'PDF' && rawLetterRatio < 0.10;
// ★ 修正三十一②：字间距残留 —— 不作废（文本可读），但必须标注「语言指标不可信」。
const spacingResidueBad = sourceType === 'PDF' && (extractPdf.spacingResidue || 0) > 0.25;
//   图文密集 / 标记密集：字节比低于下界，但清洗后文本干净且正文特征词够 ⇒ 放行。
//   依据实测：7.3MB 图密集论文提出 159KB 文本（比 0.022）、1.36MB HTML 页提出 42KB（比 0.031），
//   两者清洗后字母占比与正文特征词都达标 —— 对语言度量完全可用，不应当作废。
const textClean = (sourceType === 'HTML' ? letterRatio >= 0.60 : letterRatio >= 0.70);
const densityExcuse = byteRatio < 0.05 && textClean && probeHits.length >= (sourceType === 'HTML' ? 3 : 2);
// ★★ Round 64 重构：门原先把两个不同的问题混成一个判据 ——
//   问题A「这是不是正文？」   → 正文特征词 + 字节比   ⇒ 【硬门】不过即作废
//   问题B「提取得干不干净？」 → 字母占比             ⇒ 【软警】只标注、不作废
// 理由：一份「是对的文章但提取有噪声」的样本，对语言类指标仍可用；
//       而「不是正文」的样本（如错误页）任何指标都不可用。
// ★★★★ 修正二十九：闸门 = 提取器未失败 + 正文特征词达标。
//   字节比【不再参与 gateOK】—— 21 份实测样本上它对决定的贡献为 0 次独有命中、3 次误拦。
//   它仍被测量、仍在输出里显示，但降为诊断项（用于人工判断「这份样本值不值得信」）。
const hardGate = !extractorFailed && !pdfEncrypted
              && probeHits.length >= (sourceType === 'HTML' ? 3 : 2);
const byteRatioDegraded = true;  // 记录：判据已降级为诊断
const cleanWarn = letterRatio < (sourceType === 'HTML' ? 0.60 : 0.70);
const gateOK = hardGate;

console.log('【第 0 步】提取物有效性门（修正十九 · 跑在标准清洗后的文本上）');
console.log('  清洗: ' + rawLen + ' → ' + text.length + ' 字符（去掉 ' + garbagePct.toFixed(1) + '% 的非 ASCII 残留）');
console.log('  (清洗前字母占比 ' + (rawLetterRatio * 100).toFixed(1) + '% —— 仅作参考，不作为判据)');
if (pdfEncrypted) {
  console.log('  ── 提取器状态：★ 该 PDF 已加密 ──');
  console.log('     ⇒ 检测到 /Encrypt ⇒ 流被加密，本工具无法提取。');
  console.log('     ⇒ ★ 处置：这不是「样本作废」，也不是「提取器写错了」——请用 HTML 版或解密后重试（修正三十一①）。');
}
if (extractorFailed) {
  console.log('  ── 提取器状态：★ 提取失败 ──');
  console.log('     清洗前字母占比 ' + (rawLetterRatio * 100).toFixed(1) + '%  (判定线 <10%)  ❌');
  console.log('     ⇒ ★ 这不是「样本作废」，是**本工具的 PDF 提取器不支持该文件的字形编码**。');
  console.log('     ⇒ 处置不同：换提取路径（如改用 HTML 版、或换 PDF 解析器），而不是换样本（修正二十八）。');
}
console.log('  ── 硬门：这是不是正文？（不过即作废）—— 判据 = 提取器未失败 + 正文特征词 ──');
console.log('     正文特征词 ' + probeHits.length + ' 个  (门槛 ≥' + (sourceType === 'HTML' ? 3 : 2) + ')  ' + (probeHits.length >= (sourceType === 'HTML' ? 3 : 2) ? '✅' : '❌'));
console.log('     [诊断] 字节比 ' + (byteRatioApplies
  ? byteRatio.toFixed(3) + '  (门槛 0.05–' + (sourceType === 'HTML' ? '0.50' : '0.30') + ')  ' + (byteRatio >= 0.05 && byteRatio <= (sourceType === 'HTML' ? 0.50 : 0.30) ? '✅' : '❌')
  : '⏭ 不适用 —— 输入本身即文本（'.concat(sourceType, '），该项恒 ≈1.0，无判别力；已按修正十九·补充跳过'))
  + '  —— 仅诊断，不参与硬门（修正二十九）');
console.log('  ── 软警：提取得干不干净？（只标注，不作废）──');
console.log('     字母占比 ' + (letterRatio * 100).toFixed(1) + '%  (参考线 >' + ((sourceType === 'HTML' ? 0.60 : 0.70) * 100) + '%)  ' + (cleanWarn ? '⚠ 偏低' : '✅'));
if (cleanWarn) console.log('     ⇒ ⚠ 正文可能仍夹噪声；语言类指标（句长等）建议多跑几种清洗组合看区间稳定性（修正十八）');
if (spacingResidueBad) {
  console.log('  ── ★ 字间距残留告警（修正三十一②）──');
  console.log('     短字母块+空格密度 ' + ((extractPdf.spacingResidue || 0) * 100).toFixed(1) + '%  (告警线 >25%)');
  console.log('     ⇒ ★ 该 PDF 的字母被拆成碎片（如 mat er ial）。硬门仍放行（文本可读），');
  console.log('        但【句长/被动等语言指标在本样本上不可信】—— 请改用 HTML 版或用能处理字间距的提取器。');
  console.log('     ⇒ 不假装重组：重组会把 a cat 变成 acat，那是制造新错误而不是修错。');
}
console.log('  ⇒ ' + (gateOK ? '✅ 硬门通过 —— 可继续检查'
  : (pdfEncrypted ? '★ 该 PDF 已加密 —— 换 HTML 版或解密后重试（修正三十一①）'
  : (extractorFailed ? '★ 提取失败 —— 不是样本作废，是本工具的 PDF 提取器不支持该文件（修正二十八）'
  : '★ 硬门不通过 —— 这不是正文，样本作废'))));
console.log('');
if (!gateOK) { console.log('（按修正十九：样本作废，不得进入统计）'); process.exit(30); }

const isEnglish = letters > cjk * 3;
console.log('  语言判定: ' + (isEnglish ? '英文（语言类判据适用）' : '中文/混合（★ 语言类判据的本机阈值是按英文校准的，对中文不适用）'));
console.log('');

// ─── 语言类判据 ───
function measureSentences(x, frac) {
  const sa = x.split(/(?<=[.!?])\s+/).map(s => s.trim()).filter(s => s.length > 40);
  const clean = sa.filter(s => { const ws = s.split(' '); const ok = ws.filter(w => /^[A-Za-z][A-Za-z\-,]{1,}$/.test(w)).length; return ws.length >= 5 && ok / ws.length > frac; });
  const words = clean.join(' ').split(' ').filter(w => /^[A-Za-z]/.test(w));
  const lens = clean.map(s => s.split(' ').length).sort((a, b) => a - b);
  return { n: clean.length, words: words.length,
    avg: clean.length ? words.length / clean.length : 0,
    p90: lens.length ? lens[Math.floor(lens.length * 0.9)] : 0,
    over35: lens.length ? lens.filter(v => v > 35).length / lens.length * 100 : 0,
    pas: clean.length ? clean.filter(s => /\b(was|were|is|are|been|be)\s+\w+(ed|en)\b/i.test(s)).length / clean.length * 100 : 0 };
}
const variants = [
  x => x.replace(/[^\x20-\x7E\n]/g, ' ').replace(/\s+/g, ' ').trim(),
  x => x.replace(/[^\x20-\x7E\n]/g, ' ').replace(/\b[A-Za-z]{0,2}[^\sA-Za-z]{0,3}\b/g, ' ').replace(/\s+/g, ' ').trim(),
];
const ms = [];
for (const v of variants) for (const f of [0.8, 0.9]) ms.push(measureSentences(v(text), f));
const q = a => Math.min(...a).toFixed(1) + '–' + Math.max(...a).toFixed(1);
const avgs = ms.map(m => m.avg), p90s = ms.map(m => m.p90), o35 = ms.map(m => m.over35), pas = ms.map(m => m.pas);

console.log('【语言类】样本 ' + ms[0].n + '–' + Math.max(...ms.map(m => m.n)) + ' 句 · 4 种清洗组合（修正十八：报区间不报单点）');
const lang = [
  ['平均句长', q(avgs) + ' 词', '约 15–27 词', Math.min(...avgs) >= 15 && Math.max(...avgs) <= 27, '修二十·二十一'],
  ['超 35 词比例', q(o35) + '%', '≤ 20%', Math.max(...o35) <= 20, '修十七·二十一'],
  ['被动比例', q(pas) + '%', '≤ 50%', Math.max(...pas) <= 50, '修二十一'],
];
for (const [n, v, th, ok, ref] of lang) console.log('  ' + (ok ? '✅' : '❌') + ' ' + n + ': ' + v + '  (方案: ' + th + ')  [' + ref + ']');
console.log('  ℹ 90 分位句长: ' + q(p90s) + ' 词（方案未设阈值，实测参考）');
console.log('');

// ─── 结构类判据（按修正二十二分级）───
console.log('【结构类】按修正二十二分级：≈100% 可作门槛 · 70–99% 只作提示 · <70% 不可用');
const TITLES = 'Introduction|Experimental|Materials and Methods|Materials and methods|Methods|Methodology|Results and discussion|Results and Discussion|Results|Discussion|Conclusions?|Concluding remarks|Summary|References|Acknowledg\\w*|Abstract';
const numRe = new RegExp('(?:^|\\s)(\\d{1,2}(?:\\.\\d{1,2}){0,2})\\.?\\s+(' + TITLES + ')(?=[\\s.,:;]|$)', 'g');
const bareRe = new RegExp('(?:^|\\s)(' + TITLES + ')(?=[\\s.:;]|$)', 'g');
const numHits = [...new Set([...text.matchAll(numRe)].map(m => m[2]))];
const bareHits = [...new Set([...text.matchAll(bareRe)].map(m => m[1]))];
const allHits = new Set([...numHits, ...bareHits]);
const struct = [
  ['Introduction 节', /Introduction/i, '门槛', 5, 5],
  ['Conclusion 节', /Conclusions?|Concluding/i, '门槛', 5, 5],
  ['References 节', /References/i, '提示', 4, 5],
  ['Methods/Experimental 节', /Methods|Experimental|Methodology/i, '提示', 4, 5],
  ['独立 Results 节', /Results/i, '不可用', 2, 5],
];
for (const [n, re, grade, hit, tot] of struct) {
  const found = [...allHits].some(h => re.test(h));
  // ★ 显示逻辑：只有「门槛」级的「未检出」才算失败；
  //   「提示」级未检出 = ⚠（可能真缺，也可能检出不到）；
  //   「不可用」级只报事实（检出/未检出都不作为判定）
  const icon = grade === '门槛' ? (found ? '✅' : '❌')
             : grade === '提示'  ? (found ? '✅' : '⚠')
             : (found ? '· 检出' : '· 未检出');
  console.log('  ' + icon + ' ' + n + '  [强度:' + grade + ' · 实测可检出率 ' + hit + '/' + tot + ']');
}
console.log('  ℹ 检出的标题: ' + ([...allHits].slice(0, 12).join(' | ') || '（无）'));
console.log('');

// ─── 统计类判据（按修正二十：标适用范式）───
console.log('【统计类】按修正二十：须先声明适用范式（理论/计算类不适用）');
const stat = [
  ['报 n（样本量）', [/\bn\s*=\s*\d/i, /\d+\s+replicates?\b/i, /\breplicates?\b/i, /specimens were/i, /three (samples|specimens|tests)/i, /sample size/i, /triplicate/i], '实验类'],
  ['报离散度（SD/SEM/±）', [/standard deviation/i, /\bSD\b/, /\bSEM\b/, /±\s*\d/], '实验类'],
  ['报检验方法', [/ANOVA/i, /t-test/i, /Tukey/i, /Kruskal/i, /Mann-Whitney/i, /Duncan/i, /post-?hoc/i, /regression/i, /DOE/i, /response surface/i, /lack of fit/i, /adequacy of the model/i], '有假设检验的'],
  ['报统计量或 p 值', [/\bF\s*\(\s*\d+\s*,\s*\d+\s*\)/, /\bR2\b/, /R²/, /R\^2/i, /\bp\s*[<=]\s*0?\.\d+/i], '有假设检验的'],
  ['数据可得性声明', [/data availability/i, /data are available/i, /available (up)?on request/i, /supplementary/i, /repository/i], '全部'],
];
for (const [n, pats, scope] of stat) {
  const hit = pats.some(p => p.test(text));
  console.log('  ' + (hit ? '✅' : '⚠') + ' ' + n + '  [适用: ' + scope + ']' + (hit ? '' : '  ← 未检出；若本文属该范式，须人工确认'));
}
console.log('');

// ─── 图件类 ───
console.log('【图件类】');
const figs = [...new Set((text.match(/Figure\s+(\d+)/gi) || []).map(x => x.replace(/\D/g, '')))].sort((a, b) => a - b);
const tabs = [...new Set((text.match(/Table\s+(\d+)/gi) || []).map(x => x.replace(/\D/g, '')))].sort((a, b) => a - b);
console.log('  图号引用: ' + (figs.length ? figs.join(', ') : '（未检出）'));
console.log('  表号引用: ' + (tabs.length ? tabs.join(', ') : '（未检出）'));
console.log('  ' + (/scale bar/i.test(text) ? '✅' : '⚠') + ' 比例尺字样  ' + (/error bar/i.test(text) ? '✅' : '⚠') + ' 误差棒字样');
console.log('  ℹ 图注齐备性、dpi、颜色可辨性 —— [人工] 本工具查不了');
console.log('');

console.log('═══════════════════════════════════════════════════');
console.log('★ 本工具只覆盖「机械可查」的部分。以下必须人工：');
console.log('  · 图注齐备性 / dpi / 颜色可辨性（修二十：需版面分析）');
console.log('  · 数字与原始数据是否对得上');
console.log('  · 结论是否超出数据支持范围');
console.log('  · 引用与被引是否真的对应');
console.log('  · 论文类型该选哪个（需机构信息/导师意见）');
console.log('═══════════════════════════════════════════════════');
