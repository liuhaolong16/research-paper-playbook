// ═══════════════════════════════════════════════════════════════════
// _assertions-digest.cjs ★ Round 140 · 「断言集摘要」（采纳自 EigenFlux 同行 WorkBuddy）
//
// 同行原话（要点）：
//   「断言集本身要带 (assertion_set_digest, issuer, epoch)；删断言须发事件，
//     否则『从没立过』与『立过又撤了』同形。」
//
// 本工具做什么：
//   把「方法论里的修正集」压成一个可校验摘要 —— 每条 = 编号 + 标题的规范化文本。
//   ⇒ 任何一条被**删除、改名、重排**，摘要都会变。
//   ⇒ 于是「删掉一条修正在台账上不留痕」这个问题被消除：摘要对不上就是有变化。
//
// ★ 设计要点（本项目自己的修正五十六要求）：
//   生成与校验**分成两个模式**，校验必须在**另一次运行**里做 ——
//   因为同一进程内的「自己校验自己」是构造上恒过（修正四十三）。
//
// 用法：
//   node _assertions-digest.cjs --write   写入/更新 _assertions-digest.json（issuer + epoch + digest）
//   node _assertions-digest.cjs --check   校验当前修正集与已存摘要是否一致（跨运行检验）
//   node _assertions-digest.cjs --list    只列出当前修正集与摘要，不写不判
// 退出码：0 = 一致 / 1 = 不一致（有增删改） / 2 = 参数错
// ═══════════════════════════════════════════════════════════════════
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const W = __dirname;
const METH = path.join(W, 'playbook', '99-methodology.md');
const DIGEST = path.join(W, '_assertions-digest.json');

const CN = '零一二三四五六七八九';
function cnToNum(s) {
  if (s === '十') return 10;
  if (s.startsWith('十')) return 10 + CN.indexOf(s[1]);
  if (s.includes('十')) { const [a, b] = s.split('十'); return CN.indexOf(a) * 10 + (b ? CN.indexOf(b) : 0); }
  return CN.indexOf(s);
}

// 规范化：取「修正N」的编号 + 标题 + 【正文】（去 markdown 强调与空白）
// ★★★ Round 157 修：原来只取编号与标题 ⇒ 摘要的取值范围只覆盖条目的【身份】，
//     不覆盖条目的【内容】⇒「改一条的值但标题不动」摘要不变、检查全绿、静默通过。
//     这是同行 WorkBuddy 当场指出的静默缺口。现在正文也进摘要，并分列成两个摘要：
//       · titleDigest   = 覆盖 n|title        （改标题/增删条目 变）
//       · contentDigest = 覆盖 n|title|body   （改正文 也变）
//     分列的理由：分开比对之后，「改了内容」与「改了标题」在诊断上就对等，不再一个报警一个静默。
function extract(meth) {
  const lines = meth.split('\n');
  const out = [];
  const re = /^## [一二三四五六七八九十]+、[^\n]*?修正([一二三四五六七八九十]+)[：:]\s*(.+)$/;
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(re);
    if (!m) continue;
    const body = [];
    for (let j = i + 1; j < lines.length; j++) {
      if (/^---\s*$/.test(lines[j])) break;                 // 节结束于分隔线
      if (/^## /.test(lines[j])) {                          // 或下一个二级标题（同节内的子标题不进下一节）
        if (re.test(lines[j])) break;
      }
      body.push(lines[j]);
    }
    const norm = body.join('\n').replace(/\*\*/g, '').replace(/\s+/g, ' ').trim();
    out.push({
      n: cnToNum(m[1]),
      title: m[2].replace(/\*\*/g, '').replace(/\s+/g, ' ').trim(),
      body: norm,
    });
  }
  out.sort((a, b) => a.n - b.n);
  return out;
}
function digestOf(items) {                                   // 标题摘要（保持与历史基线同口径）
  const canon = items.map(i => i.n + '|' + i.title).join('\n');
  return crypto.createHash('sha256').update(canon, 'utf8').digest('hex');
}
function contentDigestOf(items) {                            // 内容摘要（含正文）
  const canon = items.map(i => i.n + '|' + i.title + '|' + i.body).join('\n');
  return crypto.createHash('sha256').update(canon, 'utf8').digest('hex');
}

const mode = process.argv[2] || '--list';
if (!['--write', '--check', '--list'].includes(mode)) {
  console.log('用法: node _assertions-digest.cjs [--write|--check|--list]');
  process.exit(2);
}
if (!fs.existsSync(METH)) { console.log('❌ 找不到 ' + METH); process.exit(2); }

const items = extract(fs.readFileSync(METH, 'utf8'));
const digest = digestOf(items);
const contentDigest = contentDigestOf(items);
const epoch = new Date().toISOString();

console.log('════ 断言集摘要 ════');
console.log('  修正条数: ' + items.length);
console.log('  ① 标题摘要: ' + digest + '   （覆盖 n|title ⇒ 增删与改名会变）');
console.log('  ② 内容摘要: ' + contentDigest + '   （覆盖 n|title|正文 ⇒ ★ 改正文也会变）');
console.log('  覆盖: 修正' + (items[0] ? items[0].n : '?') + ' – 修正' + (items.length ? items[items.length - 1].n : '?'));
console.log('  ★ 两个摘要分开比对：这样「改了内容」与「改了标题」在诊断上对等，不再一个报警一个静默。');

// 查重号（同一编号出现两次 ⇒ 摘要也会变，但显式报出来更清楚）
const seen = {}, dups = [];
for (const i of items) { if (seen[i.n]) dups.push(i.n); seen[i.n] = 1; }
if (dups.length) console.log('  ⚠ 编号重复: ' + dups.join(', '));

if (mode === '--list') { console.log('\n（--list 模式，未写盘、未判定）'); process.exit(0); }

if (mode === '--write') {
  const prev = fs.existsSync(DIGEST) ? JSON.parse(fs.readFileSync(DIGEST, 'utf8')) : null;
  const rec = { issuer: 'jarvis-dsh', epoch, count: items.length, digest, contentDigest, items };
  fs.writeFileSync(DIGEST, JSON.stringify(rec, null, 2), 'utf8');
  console.log('');
  if (prev) {
    if (prev.digest !== digest) {
      console.log('  ⚠ ① 标题摘要已变：' + prev.digest.slice(0, 12) + ' → ' + digest.slice(0, 12));
      console.log('    条数：' + prev.count + ' → ' + items.length);
      const pn = new Set(prev.items.map(i => i.n)), cn = new Set(items.map(i => i.n));
      const added = items.filter(i => !pn.has(i.n)).map(i => i.n);
      const removed = prev.items.filter(i => !cn.has(i.n)).map(i => i.n);
      const renamed = items.filter(i => { const q = prev.items.find(x => x.n === i.n); return q && q.title !== i.title; }).map(i => i.n);
      if (added.length) console.log('    ➕ 新增: 修正' + added.join('、修正'));
      if (removed.length) console.log('    ➖ 消失: 修正' + removed.join('、修正') + '（★ 这正是同行要求「删断言须发事件」所防的情形）');
      if (renamed.length) console.log('    ✎ 改名: 修正' + renamed.join('、修正'));
    } else console.log('  ✅ ① 标题摘要未变（无增删、无改名）');
    // ★★ 内容摘要：这一格就是同行指出的那个缺口的修补
    if (prev.contentDigest && prev.contentDigest !== contentDigest) {
      console.log('  ⚠ ② 内容摘要已变：' + prev.contentDigest.slice(0, 12) + ' → ' + contentDigest.slice(0, 12));
      const edited = items.filter(i => { const q = prev.items.find(x => x.n === i.n); return q && q.title === i.title && q.body !== i.body; }).map(i => i.n);
      if (edited.length) console.log('    ✎ 改动正文（标题未动）: 修正' + edited.join('、修正') + '  ← ★ 这一格以前是静默的');
      else console.log('    （标题摘要已覆盖该变化；此处仅确认内容层也变了）');
    } else if (prev.contentDigest) console.log('  ✅ ② 内容摘要未变（正文一字未动）');
    else console.log('  ℹ ② 首次引入内容摘要（旧基线只有标题摘要，无法回溯比对）');
  } else console.log('  ✅ 首次写入');
  console.log('  已写: _assertions-digest.json');
  process.exit(0);
}

if (mode === '--check') {
  if (!fs.existsSync(DIGEST)) { console.log('\n❌ 没有已存摘要 —— 先跑 --write'); process.exit(1); }
  const rec = JSON.parse(fs.readFileSync(DIGEST, 'utf8'));
  console.log('  已存①: ' + rec.digest.slice(0, 12) + '（issuer=' + rec.issuer + ' · epoch=' + rec.epoch + ' · ' + rec.count + ' 条）');
  console.log('  已存②: ' + (rec.contentDigest ? rec.contentDigest.slice(0, 12) : '（无 —— 旧基线）'));
  console.log('');
  const tOk = rec.digest === digest;
  const cOk = !rec.contentDigest || rec.contentDigest === contentDigest;
  if (tOk && cOk) { console.log('  ✅ 断言集未变（标题与内容两层摘要都一致 · 跨运行校验通过）'); process.exit(0); }
  console.log('  ❌ 断言集已变 —— 与已存摘要不一致');
  const pn = new Set(rec.items.map(i => i.n)), cn = new Set(items.map(i => i.n));
  const removed = rec.items.filter(i => !cn.has(i.n)).map(i => i.n);
  const added = items.filter(i => !pn.has(i.n)).map(i => i.n);
  const renamed = items.filter(i => { const q = rec.items.find(x => x.n === i.n); return q && q.title !== i.title; }).map(i => i.n);
  const edited = items.filter(i => { const q = rec.items.find(x => x.n === i.n); return q && q.title === i.title && q.body !== i.body; }).map(i => i.n);
  if (removed.length) console.log('    ➖ 消失: 修正' + removed.join('、修正'));
  if (added.length) console.log('    ➕ 新增: 修正' + added.join('、修正'));
  if (renamed.length) console.log('    ✎ 改名: 修正' + renamed.join('、修正'));
  if (edited.length) console.log('    ✎ 改动正文（标题未动）: 修正' + edited.join('、修正') + '  ← ★ 内容摘要抓到的，标题摘要看不见');
  console.log('    ⇒ 若这些变化是有意的，跑 --write 更新摘要；若不是，说明有未被授权的改动。');
  process.exit(1);
}
