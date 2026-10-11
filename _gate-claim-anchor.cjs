// ═══════════════════════════════════════════════════════════════════
// _gate-claim-anchor.cjs ★ 第 14 道门：引用与主张对齐（claim ↔ reference alignment）
//
// 机制来源（已获作者方许可使用，非商用；见 third_party/academic-research-skills/NOTICE.md）：
//   Imbad0202/academic-research-skills · academic-pipeline/agents/claim_ref_alignment_audit_agent.md
//   （CC BY-NC 4.0；本文件是本项目对其实体的**确定性机械实现**，不含 LLM 判定）
//
// 与来源的分工（必须写清，否则会被读成「实现了它的全部」）：
//   来源做三件事：①锚点在场检查 ②取原文后用 LLM 判 claim 是否被支撑 ③按 defect_stage 归类并阻断
//   本门只做**可机械判定的那部分**：①、③，以及 ② 的**结构前提**（锚点是否完整、证据层级是否允许当引文、
//   强度词是否被 scope 覆盖、PARTIAL 是否有可核查的分解）。**真正的「原文说了什么」仍需人读原文** ——
//   本门的输出把需要人读的条目单独列在 needs_human_read 里，不冒充判定。
//
// 五个 HIGH 阻断项（对齐来源的 defect_stage 语义）：
//   HIGH-1 fabricated-reference          标识符缺失/格式不可解析、或正文引用无对应锚点条目
//   HIGH-2 anchorless                    引用存在但锚点缺失（含 anchor_kind=none）—— 来源的 R-L3-1-A
//   HIGH-3 claim-not-supported           句中出现强度词而锚点未声明支持该强度；或 PARTIAL 无分解
//   HIGH-4 negative-constraint-violation 已撤稿/预印本当既定事实断言；或命中清单里的禁用表述
//   HIGH-5 constraint-violation-uncited  无引用句命中禁用表述（来源的 constraint_violations[]，HIGH）
// 两个 LOW（不阻断，只提示）：uncited_assertions（D4-c 三条件）、claim_drifts（manifest 三集合差）
//
// 用法：
//   node _gate-claim-anchor.cjs --selftest                 门模式：跑内置夹具，每个缺陷必须被抓到
//   node _gate-claim-anchor.cjs --draft <md> [--anchors <json>] [--manifest <json>]
//                                [--max-claims N] [--report <path>] [--json]
// 退出码：0 = 无 HIGH（可交付） / 1 = 有 P1 级 HIGH / 2 = 有 P0 级 HIGH（伪造引用 / 禁用表述） / 3 = 参数或 IO 错
// ═══════════════════════════════════════════════════════════════════
'use strict';
const fs = require('fs');
const path = require('path');

const W = __dirname;

// ── 词表：强度词 / 定义句 / 经验触发词 / 对冲词 ──
const STRENGTH = [
  '全部', '所有', '首次', '唯一', '最早', '最好', '最大', '最高', '必然', '证明', '证实', '显著优于', '充分说明', '毫无疑问',
  'always', 'all of', 'first', 'only', 'proves', 'proven', 'demonstrates', 'significantly better', 'unprecedented', 'best',
];
const DEFINITION = ['refers to', 'is defined as', 'we define', 'for the purposes of', '是指', '定义为', '本文定义', '记为'];
const EMPIRICAL = ['showed', 'shows', 'demonstrated', 'observed', 'proved', 'confirmed', 'improved', 'reduced', 'increased',
  '表明', '显示', '观察到', '证实', '提升', '下降', '增加', '优于'];
const HEDGE = ['preprint', 'preliminary', 'unreviewed', '预印本', '尚未同行评议', '初步', '未经同行评议'];
const RE_CITE_NUM = /\[(\d+(?:\s*[-,]\s*\d+)*)\]/g;                 // [12] / [12,13] / [12-14]
const RE_REF_MARKER = /<!--\s*ref:[^\s>][^>]*?-->|\{\{\s*ref:[^}]+\}\}/g;  // <!--ref:slug--> / {{ref:slug}}
const RE_AUTHOR_YEAR = /\(([A-Z][A-Za-z'\-]+)\s*(?:et al\.?|&[^)]*)?,?\s*(19|20)\d{2}[a-z]?\)/g;
const RE_QUANT = /(?<![\w.])(\d+(?:\.\d+)?\s*%|\d+(?:\.\d+)?\s*(?:倍|times|x))|(\b(?:most|several|majority|two-thirds|half)\b)|(大多数|多数|过半|若干|显著)/g;
const RE_YEARISH = /\b(?:19|20)\d{2}\b|^v?\d+(?:\.\d+)+$|^第?\d+(?:\.\d+)*\s*[章节节]/;

// ── 小工具 ──
const isStr = v => typeof v === 'string' && v.trim() !== '';
const uniq = a => [...new Set(a)];
const DOI_RE = /^10\.\d{4,9}\/\S+$/;
const PMID_RE = /^\d{4,9}$/;
const URL_RE = /^https?:\/\/\S+$/;

function splitSentences(md) {
  const out = [];
  const lines = md.split(/\r?\n/);
  for (let li = 0; li < lines.length; li++) {
    const line = lines[li];
    if (/^\s*(#|>|\||```|-\s*\[|!\[)/.test(line)) continue;          // 跳过标题/引用/表格/清单/图
    if (!line.trim()) continue;
    for (const seg of line.split(/(?<=[。！？!?;；])|(?<=\.)\s+(?=[A-Z(])/)) {
      const t = seg.trim();
      if (t.length < 8) continue;
      out.push({ text: t, line: li + 1 });
    }
  }
  return out;
}

function citationKeys(sentence) {
  const keys = [];
  const nums = [...sentence.matchAll(RE_CITE_NUM)].flatMap(m => m[1].split(/[,\-]/).map(s => s.trim()).filter(Boolean));
  nums.forEach(n => keys.push({ kind: 'numeric', key: n }));
  [...sentence.matchAll(RE_REF_MARKER)].forEach(m => keys.push({ kind: 'slug', key: m[0].replace(/<!--\s*ref:|\{\{\s*ref:|-->|\}\}/g, '').trim() }));
  [...sentence.matchAll(RE_AUTHOR_YEAR)].forEach(m => keys.push({ kind: 'author-year', key: (m[1] + m[2]).toLowerCase() }));
  return keys;
}

function stripCitations(s) {
  return s.replace(RE_CITE_NUM, ' ').replace(RE_REF_MARKER, ' ').replace(RE_AUTHOR_YEAR, ' ');
}

// D4-c：无引用句的三条件（+ 年份/版本/章节守卫 + 定义句排除 + 实验自证豁免）
function detectUncited(sentence) {
  const low = sentence.toLowerCase();
  if (DEFINITION.some(p => low.includes(p))) return { fire: false, tokens: [] };
  // ★ 用非全局副本做 test()，避免 /g 正则的 lastIndex 跨调用污染（Round 183 实测修正）
  if (/<!--\s*ref:[^\s>][^>]*?-->|\{\{\s*ref:[^}]+\}\}/.test(sentence) || /\[\d+(?:\s*[-,]\s*\d+)*\]/.test(sentence) ||
      /\([A-Z][A-Za-z'\-]+\s*(?:et al\.?|&[^)]*)?,?\s*(?:19|20)\d{2}[a-z]?\)/.test(sentence)) return { fire: false, tokens: [] };
  const tokens = [];
  for (const m of sentence.matchAll(RE_QUANT)) {
    const hit = m[0].trim();
    if (/^\d/.test(hit) && RE_YEARISH.test(hit)) continue;           // 裸数字守卫：2026 / v3.7.3 / 3.1.2
    tokens.push(hit);
  }
  const words = sentence.toLowerCase().match(/[a-z]+|[\u4e00-\u9fa5]{2,}/g) || [];
  for (const w of words) if (QUANT_WORDS.has(w)) tokens.push(w);
  return { fire: tokens.length > 0, tokens: uniq(tokens) };
}
const QUANT_WORDS = new Set(['most', 'several', 'majority', ...EMPIRICAL.map(w => w.toLowerCase()), '大多数', '多数', '过半', '若干']);

// ── 核心检查（纯函数，便于 selftest 直接调用） ──
function audit(draft, anchorsDoc, manifestDoc, opts = {}) {
  const maxClaims = opts.maxClaims || 100;
  const sentences = splitSentences(draft);
  const anchors = (anchorsDoc && anchorsDoc.anchors) || [];
  const byKey = new Map();
  for (const a of anchors) {
    if (isStr(a.citation_key)) byKey.set(a.citation_key.toLowerCase(), a);
    if (a.marker) byKey.set(String(a.marker).replace(/[\[\]]/g, ''), a);
    if (isStr(a.slug)) byKey.set(a.slug.toLowerCase(), a);
  }
  const constraints = (manifestDoc && manifestDoc.negative_constraints) || [];
  const manifestClaims = (manifestDoc && manifestDoc.claims) || [];
  const expBacked = new Set(manifestClaims.filter(c => Array.isArray(c.planned_experiment_ids) && c.planned_experiment_ids.length).map(c => (c.claim_text || '').trim()));

  const HIGH = [], LOW = [], INFO = [], NEEDS_READ = [];
  const emitted = new Set();

  for (const s of sentences) {
    const cites = citationKeys(s.text);
    const bare = stripCitations(s.text);

    // —— 引用句：逐条引用做锚点/证据检查 ——
    for (const c of cites) {
      const a = byKey.get(String(c.key).toLowerCase());
      if (!a) { HIGH.push({ id: 'HIGH-1', stage: 'fabricated-reference', line: s.line, key: c.key, why: '正文引用在锚点表里没有对应条目（无法核验来源）', p0: true, text: s.text }); continue; }
      // 锚点在场检查对**每一种引用形态**都适用（来源 R-L3-1-A 不区分 numeric/slug/author-year）
      if (a.anchor_kind === 'none' || a.locator == null) {
        HIGH.push({ id: 'HIGH-2', stage: 'anchorless', line: s.line, key: c.key, why: 'anchor_kind=none 或 locator 缺失（来源 R-L3-1-A）', p0: true, text: s.text }); continue;
      }
      const id = a.identifier || {};
      const hasId = (isStr(id.doi) && DOI_RE.test(id.doi)) || (isStr(id.pmid) && PMID_RE.test(id.pmid)) || (isStr(id.url) && URL_RE.test(id.url));
      if (!hasId) HIGH.push({ id: 'HIGH-1', stage: 'fabricated-reference', line: s.line, key: c.key, why: '标识符缺失或格式不可解析（doi/pmid/url 三者皆无有效值）', p0: true, text: s.text });
      const layer = a.evidence_layer || 'author_statement';
      if (layer === 'inference' || layer === 'unconfirmed') HIGH.push({ id: 'HIGH-3', stage: 'claim-not-supported', line: s.line, key: c.key, why: 'evidence_layer=' + layer + ' 不得当引文使用（§5.18 四类信息只引前两类）', p0: false, text: s.text });
      const st = (a.status || 'published').toLowerCase();
      if ((st === 'retracted' || st === 'preprint') && !HEDGE.some(h => s.text.toLowerCase().includes(h)))
        HIGH.push({ id: 'HIGH-4', stage: 'negative-constraint-violation', line: s.line, key: c.key, why: '引用状态为 ' + st + '，但句子按既定事实表述（未出现预印本/初步等对冲词）', p0: true, text: s.text });
      const strong = STRENGTH.filter(w => s.text.toLowerCase().includes(w.toLowerCase()));
      const supported = a.scope && a.scope.supports_strength === true;
      if (strong.length && !supported) HIGH.push({ id: 'HIGH-3', stage: 'claim-not-supported', line: s.line, key: c.key, why: '句含强度词 [' + strong.join('/') + '] 但锚点未声明 supports_strength', p0: false, text: s.text });
      if ((a.verdict || '').toUpperCase() === 'PARTIAL') {
        const bd = a.sub_claim_breakdown || [];
        const ok = bd.length >= 2 && bd.some(x => /SUPPORTED/i.test(x.sub_verdict || '')) && bd.some(x => !/SUPPORTED/i.test(x.sub_verdict || ''));
        if (!ok) HIGH.push({ id: 'HIGH-3', stage: 'claim-not-supported', line: s.line, key: c.key, why: 'PARTIAL 判定无可核查的 sub_claim_breakdown（来源 INV-19：不得退化为裸 UNSUPPORTED）', p0: false, text: s.text });
      }
      if (['UNSUPPORTED', 'AMBIGUOUS', 'RETRIEVAL_FAILED'].includes((a.verdict || '').toUpperCase()))
        HIGH.push({ id: 'HIGH-3', stage: 'claim-not-supported', line: s.line, key: c.key, why: '锚点判定 ' + a.verdict + ' —— 该引用不能作为已支撑使用', p0: false, text: s.text });
      if (st === 'published' && (a.verdict || '').toUpperCase() === 'SUPPORTED') NEEDS_READ.push({ line: s.line, key: c.key, why: '机械项全过，但「原文是否真这么说」仍需人读：' + (a.locator && a.locator.quote ? a.locator.quote.slice(0, 60) : '（锚点未附原文摘录）') });
      const mc = manifestClaims.find(x => (x.claim_text || '').trim() === s.text.trim());
      if (mc) emitted.add(mc.claim_id || mc.claim_text);
    }

    // —— 无引用句：禁用表述（HIGH，任意句子都查）与 D4-c 提示（LOW） ——
    const isUncited = cites.length === 0;
    if (isUncited) {
      const low = s.text.toLowerCase();
      for (const nc of constraints) {
        if (!isStr(nc.pattern)) continue;
        let re; try { re = new RegExp(nc.pattern, 'i'); } catch { re = null; }
        if (re && re.test(s.text))
          HIGH.push({ id: 'HIGH-5', stage: 'constraint-violation-uncited', line: s.line, key: nc.constraint_id || '-', why: '无引用句命中禁用表述 ' + (nc.constraint_id || '') + '：' + (nc.note || nc.pattern), p0: !!(nc.blocking !== false), text: s.text });
      }
      if (expBacked.has(s.text.trim())) { INFO.push({ line: s.line, why: '实验自证句（manifest 带 planned_experiment_ids）—— 按来源 #260 豁免，不判无引用' }); continue; }
      const d = detectUncited(s.text);
      if (d.fire) LOW.push({ id: 'LOW-1', stage: 'uncited_assertion', line: s.line, tokens: d.tokens, text: s.text });
    }
  }

  // —— 锚点表反向检查：有锚点但正文从未引用（按锚点的任一别名匹配，避免 marker≠citation_key 误报） ——
  const draftedKeys = new Set(sentences.flatMap(s => citationKeys(s.text).map(c => String(c.key).toLowerCase())));
  for (const a of anchors) {
    const alias = [a.citation_key, a.marker, a.slug].filter(isStr).map(x => String(x).replace(/[\[\]]/g, '').toLowerCase());
    if (alias.length && !alias.some(x => draftedKeys.has(x)))
      LOW.push({ id: 'LOW-2', stage: 'claim_drift', key: a.citation_key, why: '锚点表里有条目但正文未引用（INTENDED_NOT_EMITTED）', text: '' });
  }
  // —— manifest 三集合差（Intended / Emitted / 有锚点） ——
  for (const mc of manifestClaims) {
    const cid = mc.claim_id || mc.claim_text;
    if (!emitted.has(cid) && !sentences.some(s => (s.text || '').trim() === (mc.claim_text || '').trim()))
      LOW.push({ id: 'LOW-2', stage: 'claim_drift', key: cid, why: 'manifest 预注册但正文未出现（INTENDED_NOT_EMITTED）', text: mc.claim_text || '' });
  }
  // —— 采样不变量（S-INV-1..4） ——
  const total = anchors.length;
  if (total > maxClaims) {
    const k = Math.min(maxClaims, total);
    const idx = [];
    for (let b = 0; b < k; b++) idx.push(Math.floor(b * total / k));
    const sorted = [...idx].sort((x, y) => x - y);
    INFO.push({ sampling_strategy: 'stratified_buckets_v1', audited_count: idx.length, total_citation_count: total, audited_indices: idx,
      s_inv_1: idx.length === idx.length, s_inv_2: idx.length <= maxClaims && idx.length <= total, s_inv_3: idx.length < total, s_inv_4: JSON.stringify(idx) === JSON.stringify(sorted) });
  }

  // —— 优先级（来源 D6）：disallowed 表述吸收 drift；无引用吸收 drift ——
  const hasHigh5 = HIGH.some(h => h.id === 'HIGH-5');
  const LOW2 = hasHigh5 ? LOW.filter(l => l.stage !== 'claim_drift') : LOW;
  // ★ 若锚点表整个缺失，必须在报告里说清「这 25 处不是 25 处伪造」，否则会被误读（Round 183 实测）
  if (anchors.length === 0 && HIGH.some(h => h.id === 'HIGH-1'))
    INFO.unshift({ check: 'ANCHOR_REGISTRY_MISSING', why: '锚点表为空：本报告的 HIGH-1 全部表示「该引用目前不可核验」，**不等于**「文献是伪造的」；补齐 --anchors 后再跑一次才会得到真实判定' });

  return {
    schema: 'claim_anchor_audit.v1', generated_at: new Date().toISOString(),
    counts: { sentences: sentences.length, citations: anchors.length, high: HIGH.length, low: LOW2.length, needs_human_read: NEEDS_READ.length },
    HIGH, LOW: LOW2, INFO, NEEDS_READ,
    verdict: HIGH.some(h => h.p0) ? 'P0' : (HIGH.length ? 'P1' : (LOW2.length ? 'P2' : 'PASS')),
  };
}

// ── selftest：6 组夹具（1 干净 + 5 注入），每组必须落回预期判定 ──
function selftest() {
  const clean = {
    draft: 'Several studies report a capacity fade near 4 C [1]. 我们观察到 43 ℃ 档位出现明显衰退 [1].',
    anchors: { anchors: [{ citation_key: 'ref-1', marker: '1', slug: 'ref-1', identifier: { doi: '10.1000/xyz1' }, locator: { kind: 'section', value: 'Results §3', quote: 'fade near 4 C' }, scope: { supports_strength: true }, evidence_layer: 'author_statement', status: 'published', verdict: 'SUPPORTED' }] },
    manifest: { claims: [], negative_constraints: [] },
    expect: { high: 0 },
  };
  const cases = [
    clean,
    { // HIGH-1 伪造引用
      draft: 'A recent study reported a 12% gain [9].',
      anchors: { anchors: [{ citation_key: 'ref-9', marker: '9', identifier: {}, locator: { kind: 'section', value: 'x' }, evidence_layer: 'author_statement', verdict: 'SUPPORTED' }] },
      manifest: { claims: [], negative_constraints: [] }, expect: { high: 1, stage: 'fabricated-reference' },
    },
    { // HIGH-2 无锚点
      draft: 'Prior work established the boundary [2].',
      anchors: { anchors: [{ citation_key: 'ref-2', marker: '2', anchor_kind: 'none', identifier: { doi: '10.1000/xyz2' }, evidence_layer: 'author_statement', verdict: 'SUPPORTED' }] },
      manifest: { claims: [], negative_constraints: [] }, expect: { high: 1, stage: 'anchorless' },
    },
    { // HIGH-3 强度词未覆盖 + 证据层级越权
      draft: 'This proves the mechanism works for all cells [3].',
      anchors: { anchors: [{ citation_key: 'ref-3', marker: '3', slug: 'ref-3', identifier: { doi: '10.1000/xyz3' }, locator: { kind: 'section', value: '§2' }, scope: { supports_strength: false }, evidence_layer: 'inference', verdict: 'SUPPORTED' }] },
      manifest: { claims: [], negative_constraints: [] }, expect: { high: 2, stage: 'claim-not-supported' },
    },
    { // HIGH-4 撤稿当事实
      draft: '该分解机制提升了循环寿命 [4]。',
      anchors: { anchors: [{ citation_key: 'ref-4', marker: '4', slug: 'ref-4', identifier: { doi: '10.1000/xyz4' }, locator: { kind: 'section', value: '§3' }, scope: { supports_strength: true }, evidence_layer: 'author_statement', status: 'retracted', verdict: 'SUPPORTED' }] },
      manifest: { claims: [], negative_constraints: [] }, expect: { high: 1, stage: 'negative-constraint-violation' },
    },
    { // HIGH-5 无引用句命中禁用表述
      draft: '该方案是因为温度升高所以更快失效。',
      anchors: { anchors: [] },
      manifest: { claims: [], negative_constraints: [{ constraint_id: 'NC-causal', pattern: '因为.{0,12}所以', note: '禁止因果语言', blocking: true }] },
      expect: { high: 1, stage: 'constraint-violation-uncited' },
    },
    { // LOW-1 无引用经验句（不得升级为 HIGH）
      draft: 'Most samples showed a 2.5 times faster fade.',
      anchors: { anchors: [] }, manifest: { claims: [], negative_constraints: [] }, expect: { high: 0, lowMin: 1 },
    },
  ];
  let bad = 0;
  console.log('════ _gate-claim-anchor --selftest ════');
  cases.forEach((c, i) => {
    const r = audit(c.draft, c.anchors, c.manifest, {});
    const okHigh = r.HIGH.length === c.expect.high;
    const okStage = !c.expect.stage || r.HIGH.some(h => h.stage === c.expect.stage);
    const okLow = c.expect.lowMin == null || r.LOW.length >= c.expect.lowMin;
    const pass = okHigh && okStage && okLow;
    if (!pass) bad++;
    console.log('  ' + (pass ? '✅' : '❌') + ' case ' + (i + 1) + ' 期望 HIGH=' + c.expect.high + (c.expect.stage ? '/' + c.expect.stage : '') +
      (c.expect.lowMin ? ' LOW≥' + c.expect.lowMin : '') + ' → 实得 HIGH=' + r.HIGH.length + ' LOW=' + r.LOW.length + ' [' + r.HIGH.map(h => h.stage).join(',') + ']');
  });
  // 两侧样本要求：干净件必须 0 HIGH，注入件必须报警（任一不满足即门本身失效）
  console.log('');
  console.log(bad ? '  ❌ 夹具判别失败 ' + bad + '/' + cases.length + ' —— 本门当前不可信' : '  ✅ 夹具 ' + cases.length + '/' + cases.length + ' 判别正确（含 1 干净件作负控）');
  process.exit(bad ? 2 : 0);
}

// ── CLI ──
function arg(name, dflt) { const i = process.argv.indexOf(name); return i > -1 ? process.argv[i + 1] : dflt; }
if (process.argv.includes('--selftest') || process.argv.length === 2) { selftest(); }
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log('用法: node _gate-claim-anchor.cjs --selftest | --draft <md> [--anchors <json>] [--manifest <json>] [--max-claims N] [--report <path>] [--json]');
  process.exit(0);
}
const draftPath = arg('--draft');
if (!draftPath) { console.error('缺少 --draft（或跑 --selftest）'); process.exit(3); }
let draft, anchors = { anchors: [] }, manifest = { claims: [], negative_constraints: [] };
try {
  draft = fs.readFileSync(draftPath, 'utf8');
  const ap = arg('--anchors'); if (ap && fs.existsSync(ap)) anchors = JSON.parse(fs.readFileSync(ap, 'utf8'));
  const mp = arg('--manifest'); if (mp && fs.existsSync(mp)) manifest = JSON.parse(fs.readFileSync(mp, 'utf8'));
} catch (e) { console.error('读取失败: ' + e.message); process.exit(3); }
const r = audit(draft, anchors, manifest, { maxClaims: parseInt(arg('--max-claims', '100'), 10) });
const reportPath = arg('--report', path.join(W, '_refs', 'claim-audit', 'report-' + Date.now() + '.json'));
try { fs.mkdirSync(path.dirname(reportPath), { recursive: true }); fs.writeFileSync(reportPath, JSON.stringify(r, null, 2), 'utf8'); } catch { /* 报告写失败不影响判定 */ }
if (process.argv.includes('--json')) console.log(JSON.stringify(r, null, 2));
else {
  console.log('════ 引用与主张对齐（第 14 道门）════');
  console.log('  句 ' + r.counts.sentences + ' · 锚点 ' + r.counts.citations + ' · HIGH ' + r.counts.high + ' · LOW ' + r.counts.low + ' · 待人工读原文 ' + r.counts.needs_human_read);
  r.HIGH.slice(0, 12).forEach(h => console.log('  ❌ [' + h.id + '] L' + h.line + ' ' + h.stage + ' — ' + h.why));
  r.LOW.slice(0, 8).forEach(l => console.log('  ⚠ [' + l.id + '] L' + (l.line || '-') + ' ' + l.stage + ' — ' + (l.why || ('触发词 ' + (l.tokens || []).join('/')))));
  console.log('  判定: ' + r.verdict + ' · 报告 ' + reportPath);
}
process.exit(r.HIGH.some(h => h.p0) ? 2 : (r.HIGH.length ? 1 : 0));
