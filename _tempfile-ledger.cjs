// ═══════════════════════════════════════════════════════════════════
// _tempfile-ledger.cjs ★ Round 142 · 「临时状态五元组」（采纳自 EigenFlux 同行 月流）
//
// 同行原话（要点）：
//   「残留状态本身也要落 (stale_artifact, artifact_path, origin_run_id,
//     expected_lifetime, cleanup_verified) 五元组。expected_lifetime 声明
//     这个临时文件应该活多久；cleanup_verified 是显式确认它已被清理。
//     没有 expected_lifetime 的临时文件只是『不知道什么时候该删』的另一种写法。」
//
// 本工具做什么：
//   把工作区里所有 `_*` 文件分成两类 ——
//     ① **常驻工具**（有登记、有用途、活到项目结束）⇒ 五元组里 expected_lifetime = 'project'
//     ② **临时产物**（解析中间文件、一次性脚本）⇒ **必须有 expected_lifetime**，
//        否则它就是「不知道什么时候该删」。
//   ⇒ 未登记且未声明生命周期的 `_*` 文件 = 违规（这正是每轮手工清理所替代的那件事）。
//
// 用法：
//   node _tempfile-ledger.cjs            扫描并判定（违规 ⇒ 退出码 1）
//   node _tempfile-ledger.cjs --list     只列出，不判定
// 退出码：0 = 无未声明生命周期的临时文件 / 1 = 有 / 2 = 参数错
// ═══════════════════════════════════════════════════════════════════
const fs = require('fs');
const path = require('path');
const W = __dirname;

// ── 常驻工具登记表（expected_lifetime = 'project'）──
const PERMANENT = {
  '_build-full.cjs':        '确定性生成器（合成完整版）',
  '_verify.cjs':            '结构校验（八项）',
  '_check-residue.cjs':     '旧结论残留扫描器（修正二十五）',
  '_branch-test.cjs':       '两线分支测试（29 项）',
  '_gate-matrix.cjs':       '判据门槛矩阵',
  '_landing-check.cjs':     '修正落地检查门',
  '_assertions-digest.cjs': '断言集摘要（写/校验两模式）',
  '_gate-registry.cjs':     '门的消费方注册表 + halted_at 事件',
  '_tempfile-ledger.cjs':   '本工具：临时状态五元组',
  '_verify-pos.cjs':        '验收项正向形式检查（±2 行窗口）',
  '_digest-revtest.cjs':    '断言集内容摘要的反向测试（改正文不改标题必须被抓）',
  '_baseline-control.cjs':  '对拍基准具名 + 三类负控（采纳表最后 2 项的落地）',
  '_gate-claim-anchor.cjs': '第 14 道门：引用与主张对齐（五类阻断 + 两类提示；注册表跑 --selftest，真实稿子另跑 --draft）',
  '_sections.cjs':          '节编号检查',
  '_extract-quality.cjs':   '提取质量五指标',
  '_contract-check.cjs':   '契约检查：参考文献 APA 格式 + 强断言证据在场性（D2）',
  '_gen-readme.cjs':        'README 维度进度表生成器',
  '_pdftext.py':            'PDF 文本提取（PyMuPDF）',
  // ── 数据/状态文件（活的，但非脚本）──
  '_build-checklist.cjs':   '跨 11 维总检查表生成器（--check 可验同步）',
  '_checklist-manifest.json': '总检查表的同步快照（各维复选框集合哈希）',
  '_src-snapshot.cjs':      '源文件快照（独立于生成器的恢复能力）',
  '_snapshot-revtest.cjs':  '快照的门安全反向测试（还原可用 + 自证有区分力 + 不碰真文件）',
  '_manifest.json':         '交付物清单（机器可数）',
  '_adversarial-findings.md':'对抗审查发现登记表（Round 166 起 · 未修的不许丢）',
  '_assertions-digest.json':'断言集摘要的已存基线',
  '_halt-events.jsonl':     'halted_at 事件流（append-only）',
  '_backup':                '历史版本备份目录（保留）',
  '_refs':                  '取证材料目录（保留）',
};

// ── 允许的临时命名模式（带 expected_lifetime 语义）──
//   形如 _tmp-*.cjs / _probe-*.cjs 等：**声明为「本轮内清理」**
const TRANSIENT_PATTERNS = [
  { re: /^_tmp[-_.]/,          lifetime: '本轮结束前', note: '显式 _tmp- 前缀' },
  { re: /^_probe[-_.]/,        lifetime: '本轮结束前', note: '显式 _probe- 前缀' },
];

const mode = process.argv[2] || '';
if (mode && mode !== '--list') { console.log('用法: node _tempfile-ledger.cjs [--list]'); process.exit(2); }

const entries = fs.readdirSync(W).filter(n => n.startsWith('_'));
const rows = [];
let violations = 0;

for (const n of entries) {
  const full = path.join(W, n);
  const st = fs.statSync(full);
  const isDir = st.isDirectory();
  let cls, lifetime, note;
  if (Object.prototype.hasOwnProperty.call(PERMANENT, n)) {
    cls = isDir ? '常驻目录' : '常驻工具'; lifetime = 'project'; note = PERMANENT[n];
  } else {
    const t = TRANSIENT_PATTERNS.find(p => p.re.test(n));
    if (t) { cls = '临时（已声明）'; lifetime = t.lifetime; note = t.note; }
    else { cls = '★ 未声明生命周期'; lifetime = '（无）'; note = '—— 这正是「不知道什么时候该删」'; violations++; }
  }
  rows.push({ name: n, cls, lifetime, note, bytes: isDir ? '' : st.size, mtime: st.mtime.toISOString().slice(0, 16).replace('T', ' ') });
}

if (mode === '--list') {
  console.log('════ 临时状态台账（五元组视图）════');
  console.log('');
  console.log('| 名称 | 类别 | expected_lifetime | 用途/说明 | 字节 | 最近改动 |');
  console.log('| --- | --- | --- | --- | --- | --- |');
  for (const r of rows) console.log('| `' + r.name + '` | ' + r.cls + ' | **' + r.lifetime + '** | ' + r.note + ' | ' + r.bytes + ' | ' + r.mtime + ' |');
  console.log('');
  const perm = rows.filter(r => r.lifetime === 'project').length;
  const tr = rows.filter(r => r.lifetime !== 'project' && !r.cls.startsWith('★')).length;
  console.log('  常驻（expected_lifetime = project）: ' + perm + ' · 临时（已声明）: ' + tr + ' · 未声明: ' + violations);
  process.exit(0);
}

console.log('════ 临时状态五元组检查 ════');
console.log('  扫描 ' + entries.length + ' 个 `_*` 条目');
const perm = rows.filter(r => r.lifetime === 'project');
const tr = rows.filter(r => r.lifetime !== 'project' && !r.cls.startsWith('★'));
const bad = rows.filter(r => r.cls.startsWith('★'));
console.log('  ✅ 常驻（lifetime = project）: ' + perm.length);
console.log('  ✅ 临时（已声明生命周期）: ' + tr.length + (tr.length ? ' → ' + tr.map(r => r.name).join(', ') : ''));
if (bad.length) {
  console.log('');
  console.log('  ❌ 未声明 expected_lifetime 的条目: ' + bad.length);
  bad.forEach(r => console.log('     ⚠ ' + r.name + '（' + r.bytes + ' 字节 · ' + r.mtime + '）—— ' + r.note));
  console.log('');
  console.log('  ⇒ 处置二选一：① 若它是常驻工具 ⇒ 登记进本文件的 PERMANENT；');
  console.log('                ② 若它是本轮临时产物 ⇒ 改名加 `_tmp-` 前缀，或当轮删掉。');
  console.log('     理由（同行原话）：没有 expected_lifetime 的临时文件只是「不知道什么时候该删」的另一种写法。');
  process.exit(1);
}
console.log('');
console.log('  ✅ 所有 `_*` 条目都有 expected_lifetime（常驻或已声明的临时）');
process.exit(0);
