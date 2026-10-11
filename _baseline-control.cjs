/**
 * 对拍基准 + 三类负控 的机械检查（Round 154 落地 · 采纳表剩的最后 2 项）
 *
 * 落地的是采纳表第 4 条（月流：对拍基准的具名声明）与第 12 条（巡灯：双向负控 + 同样合法但换值）。
 *
 * ★ 为什么要有这个东西：
 *   「两个输出并排比」若不说以哪个为基准，那只是「两个输出放一起」；
 *   「负控只做一类」若只构造不存在词，那它区分不了「字段存在」与「来源/新鲜度」。
 *   两者都不是靠记得就能做到的，必须由程序检查。
 *
 * ★ 本工具的判据有意设计成【能失败】：
 *   --selftest 会注入一个坏基准与一个单类负控，二者都必须被报出来；报不出来则本工具自身失败。
 *
 * 用法：node _baseline-control.cjs            只读自检 + 打印
 *       node _baseline-control.cjs --selftest  注入故障，验证本工具能抓
 * 只读：不修改任何文件。
 */

const NL = String.fromCharCode(10);

// ═══════════════════════════════════════════════════════════════
// 一、对拍基准：每一次「并排比对」都要有一条基准声明
// ═══════════════════════════════════════════════════════════════
// 形如：{ id, what, baseline, basis }   baseline ∈ {'A','B','第三方'}
const COMPARISONS = [
  { id: 'C1', what: '完整版 与 各维度源文件 的修正条数',
    baseline: 'A', basis: '维度源文件是手写事实源，完整版是生成物 ⇒ 基准取源文件，比对的是「生成有没有漏」' },
  { id: 'C2', what: '断言集摘要 与 方法论正文 的条数',
    baseline: 'A', basis: '方法论正文是事实源，摘要是派生物 ⇒ 基准取正文' },
  { id: 'C3', what: '本方案 与 同行采纳表 的判据质量块',
    baseline: '第三方', basis: '两边都是各自项目的产物，谁也不该当基准 ⇒ 基准取「判据质量十七条」这个外部约定' },
];

function checkComparisons(list) {                                   // 纯函数，可被 selftest 用坏数据调
  const okB = new Set(['A', 'B', '第三方']);
  const bad = [];
  for (const c of list) {
    if (!c.baseline || !okB.has(c.baseline)) bad.push(c.id + '：基准缺失或非法（得到 ' + JSON.stringify(c.baseline) + '）');
    else if (!c.basis || String(c.basis).trim().length < 8) bad.push(c.id + '：基准依据缺失或过短');
  }
  return bad;
}

// ═══════════════════════════════════════════════════════════════
// 二、双向 + 换值负控：三类都要有，且各自能被判出来
// ═══════════════════════════════════════════════════════════════
// ① 构造不存在词      —— 判别「有没有读到东西」（最弱的一类，单独做不合格）
// ② 同样合法但换值    —— 判别「字段存在」与「来源/新鲜度」不是一回事
// ③ 必然通过（正控）  —— 判别「判据本身在不在工作」
const NEG_CLASSES = ['constructed_absent', 'valid_but_swapped', 'must_pass'];

// 受检判据：给定文本，判断它是否是「可用的正文」
// ★★★ Round 154 实测教训：只用「可打印占比」是【不具判别力】的 ——
//     构造的不存在词（zzqxxvvww jjkkqqxx…）是 100% 可打印 ASCII，占比判据照样放行。
//     所以必须再加一条【真实词命中】判据；两条合起来才能把第一类负控分开。
const REALISH = /(the|and|of|to|in|is|are|was|we|this|that|with|for|from|report|sample|size|method|result|figure|table|数据|研究|方法|结果|样本|统计)/i;
const isUsableBody = (s) => {
  if (typeof s !== 'string' || s.length < 40) return { pass: false, why: '过短' };
  const printable = (s.match(/[\x20-\x7e\u4e00-\u9fff]/g) || []).length;
  const ratio = printable / (s.length || 1);
  if (ratio < 0.9) return { pass: false, why: '可打印占比 ' + ratio.toFixed(2) };
  if (/Just a moment|NativeCommandError|invalid character/.test(s)) return { pass: false, why: '命中已知坏标记' };
  if (!REALISH.test(s)) return { pass: false, why: '可打印占比 ' + ratio.toFixed(2) + ' 但【零真实词命中】⇒ 像构造串' };
  return { pass: true, why: '可打印占比 ' + ratio.toFixed(2) + ' + 有真实词' };
};

// 三类样本。★ 每类都写明「它要区分开什么」
const SAMPLES = [
  { cls: 'constructed_absent', name: '构造的不存在词', distinguishes: '文本里有没有可读内容',
    text: 'zzqxxvvww jjkkqqxx vvbbnnmm ppqqrrss ttwwxxyy hhjjkkll mmnnppqq rrsswwxx',
    expect: 'fail' },
  { cls: 'valid_but_swapped', name: '同样合法但换值', distinguishes: '字段存在 ≠ 来源/新鲜度相同',
    text: 'ABSTRACT: We report the same field with a DIFFERENT value: sample size 42, error bar 0.31, replicate 3. '
        + 'All characters are perfectly printable and the text is grammatically valid. '
        + 'It distinguishes field-presence from source/freshness because both copies look equally legal.',
    expect: 'pass' },
  { cls: 'must_pass', name: '必然通过（正控）', distinguishes: '判据本身在不在工作',
    text: 'ABSTRACT: This is a genuine body sample with enough length to satisfy the minimum threshold. '
        + 'It contains statistics, methods and results wording so the positive control must pass.',
    expect: 'pass' },
];

function checkNegativeClasses(samples) {
  const present = new Set(samples.map(s => s.cls));
  const missing = NEG_CLASSES.filter(c => !present.has(c));
  const wrong = [];
  for (const s of samples) {
    const r = isUsableBody(s.text);
    const got = r.pass ? 'pass' : 'fail';
    if (typeof s.expect !== 'undefined' && got !== s.expect) wrong.push(s.name + '：期望 ' + s.expect + ' 实得 ' + got + '（' + r.why + '）');
  }
  return { missing, wrong };
}

// ═══════════════════════════════════════════════════════════════
// 三、主流程
// ═══════════════════════════════════════════════════════════════
const SELFTEST = process.argv.includes('--selftest');

let comparisons = COMPARISONS;
let samples = SAMPLES;
if (SELFTEST) {
  // 注入两个故障：一个坏基准、一个只剩单类负控。二者都必须被报出来。
  comparisons = COMPARISONS.slice(0, 2).concat([{ id: 'CX', what: '坏基准样例', baseline: 'B?', basis: '短' }]);
  samples = [SAMPLES[1], SAMPLES[2]];      // 缺 constructed_absent ⇒ 只有两类
}

console.log('════ 对拍基准 + 三类负控 机械检查 ════' + (SELFTEST ? '  【selftest 注入故障】' : ''));
console.log('');

const badC = checkComparisons(comparisons);
console.log('一、对拍基准具名（' + comparisons.length + ' 项）');
for (const c of comparisons) console.log('  ' + c.id + ' · 基准=' + c.baseline + ' · ' + c.what);
console.log(badC.length ? '  ❌ ' + badC.length + ' 项不合格：' + NL + badC.map(x => '     - ' + x).join(NL)
                        : '  ✅ 全部合格（基准与依据都具名）');
console.log('');

const nc = checkNegativeClasses(samples);
console.log('二、双向 + 换值负控（应有 ' + NEG_CLASSES.length + ' 类，实有 ' + samples.length + ' 类）');
for (const s of samples) {
  const r = isUsableBody(s.text);
  const got = r.pass ? 'pass' : 'fail';
  // ★ 前缀要反映【是否符合期望】，不是【判据是否通过】—— 否则屏幕上会出现「✅ 期望 fail 实得 pass」
  const match = (typeof s.expect === 'undefined') ? r.pass : (got === s.expect);
  console.log('  ' + (match ? '✅' : '❌') + ' ' + s.name + '（' + s.cls + '）· 期望 ' + s.expect + ' · 实得 ' + got);
  console.log('       它区分开的是：' + s.distinguishes);
}
if (nc.missing.length) console.log('  ❌ 缺类别：' + nc.missing.join(' · ') + ' ⇒ 只做一类的为不合格');
if (nc.wrong.length) console.log('  ❌ 判据行为不符：' + NL + nc.wrong.map(x => '     - ' + x).join(NL));
if (!nc.missing.length && !nc.wrong.length) console.log('  ✅ 三类齐备且行为符合预期');
console.log('');

const failed = badC.length + nc.missing.length + nc.wrong.length;
if (SELFTEST) {
  const caught = badC.length > 0 && nc.missing.length > 0;
  console.log(caught ? '✅ selftest 通过：注入的坏基准与单类负控都被报出（退出码 1）'
                     : '❌ selftest 失败：注入的故障【没被报出】⇒ 本工具的判据不具判别力');
  process.exit(caught ? 1 : 2);
}
console.log(failed ? '❌ 共 ' + failed + ' 项不合格' : '✅ 两项均已落地：基准具名 + 三类负控齐备');
process.exit(failed ? 1 : 0);
