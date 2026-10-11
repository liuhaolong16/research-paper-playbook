// ═══════════════════════════════════════════════════════════════════
// _gate-registry.cjs ★ Round 141 · 门的「消费方注册表」+「halted_at 事件」
//
// 采纳自 EigenFlux 两位同行：
//   月流：「halt 语义保证『读到状态的层停止推进』，但如果有的层根本没读状态
//         （直接读原始清单绕过对账脚本），halt 管不到它。
//         ⇒ 对账状态落账时要带【消费方注册表】(consumer_id, consumer_reads_state, verified_at)。」
//   雪宝：「停止推进这一动作本身也要落显式事件 (halted_at, halted_by, halt_reason_ref)，
//         否则『上层本该停』与『上层真停了』在账上同形，具名状态就只是装饰。」
//
// ★ 本项目语境下的关键定义（Round 140 已写下，这里是它的落地）：
//   单机、单 Agent 的流水线里，「消费方」**不是别的程序**，而是：
//     ① 下一轮的我（依此决定本轮结果是否可信、能否继续）
//     ② 用户（依此判断这轮到底做成了没有）
//   ⇒ 因此注册表要回答的不是「哪个进程读它」，而是：
//     **「这个门的结论，有没有被写进任何一份人/下轮能读到的产物？」**
//     没被写进去的门 = advisory（仅供参考，不构成闸门）。
//
// 用法：
//   node _gate-registry.cjs --list              只读：列出注册表与各门当前状态
//   node _gate-registry.cjs --run               依次跑所有登记的门，产出 halted_at 事件（若有失败）
//   node _gate-registry.cjs --verify-events     校验事件文件与最近一次运行一致（跨运行）
// 退出码：0 = 全部门通过 / 1 = 有门失败（已落 halted_at 事件） / 2 = 参数错
// ═══════════════════════════════════════════════════════════════════
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const W = __dirname;
const EVENTS = path.join(W, '_halt-events.jsonl');
const node = process.execPath;

// ── 注册表：每个门登记「消费方」与「是否构成闸门」 ──
const GATES = [
  { id: '_verify',            args: [],                    kind: 'gate',     consumer: ['next_round', 'user'], written_to: '附录·当前状态 + 轮次回复' },
  { id: '_check-residue',     args: [],                    kind: 'gate',     consumer: ['next_round'],          written_to: '轮次回复的「临时文件」一行' },
  { id: '_branch-test',       args: [],                    kind: 'gate',     consumer: ['next_round','user'],   written_to: '轮次回复的「校验」段' },
  { id: '_gate-matrix',       args: [],                    kind: 'gate',     consumer: ['next_round'],          written_to: '轮次回复的「校验」段' },
  { id: '_landing-check',     args: [],                    kind: 'gate',     consumer: ['next_round'],          written_to: '轮次回复的「校验」段' },
  { id: '_assertions-digest', args: ['--check'],           kind: 'gate',     consumer: ['next_round'],          written_to: '轮次回复的「校验」段' },
  { id: '_digest-revtest',  args: [],                    kind: 'gate',     consumer: ['next_round'],          written_to: '轮次回复的「校验」段（内容摘要的反向测试）' },
  { id: '_sections',          args: ['--selftest'],        kind: 'gate',     consumer: ['next_round'],          written_to: '轮次回复的「校验」段' },
  { id: '_tempfile-ledger',   args: [],                    kind: 'gate',     consumer: ['next_round'],          written_to: '轮次回复的「校验」段（临时状态五元组）' },
  { id: '_verify-pos',        args: [],                    kind: 'gate',     consumer: ['next_round'],          written_to: '轮次回复的「校验」段（验收项正向形式）' },
  { id: '_build-checklist', args: ['--check'], kind: 'gate', consumer: ['next_round'], written_to: '轮次回复的「校验」段（跨维总检查表是否与 11 维源文件同步）' },
  { id: '_src-snapshot', args: ['--stale'], kind: 'gate', consumer: ['next_round'], written_to: '轮次回复的「校验」段（最新源文件快照是否完整）' },
  { id: '_baseline-control',  args: [],                    kind: 'gate',     consumer: ['next_round'],          written_to: '轮次回复的「校验」段（对拍基准 + 三类负控）' },
  { id: '_gate-claim-anchor', args: ['--selftest'],        kind: 'gate',     consumer: ['next_round','user'],   written_to: '轮次回复的「校验」段（第 14 道门：引用与主张对齐 —— 注册表每轮跑它的自检；真实稿子另跑 --draft）' },
  { id: '_extract-quality',   args: ['_refs/p19-springer-stat-reporting.pdf'], kind: 'advisory', consumer: [], written_to: '（仅方法验证，不每轮跑）' },
  { id: '_contract-check.cjs', args: [], kind: 'advisory', consumer: [], written_to: '（契约检查：参考文献 APA 格式 + 强断言证据在场性；只在有真实论文草稿时跑 —— 对方案自身文档跑会因元讨论产生假阳性）' },
];

// ── Python 门单独走 ──
const PY = 'C:\\Users\\ASUS\\.dsh\\dsh-runtimes\\dsh-primary-runtime\\dependencies\\python\\python.exe';

function runGate(g) {
  const isPy = g.id.endsWith('.py');
  const bin = isPy ? PY : node;
  const script = path.join(W, g.id + (isPy ? '' : '.cjs'));
  if (!fs.existsSync(script)) return { ok: false, out: '（脚本不存在）' };
  try {
    const o = execFileSync(bin, [script, ...g.args], { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'], cwd: W });
    return { ok: true, out: o };
  } catch (e) { return { ok: false, out: (e.stdout || '') + (e.stderr || '') }; }
}

const mode = process.argv[2] || '--list';

if (mode === '--list') {
  console.log('════ 门的消费方注册表 ════');
  console.log('');
  console.log('| 门 | 性质 | 消费方 | 结论写进哪里 |');
  console.log('| --- | --- | --- | --- |');
  for (const g of GATES) {
    console.log('| `' + g.id + '` | **' + g.kind + '** | ' + (g.consumer.length ? g.consumer.join(' · ') : '**（无）**') + ' | ' + g.written_to + ' |');
  }
  console.log('');
  const adv = GATES.filter(g => g.kind === 'advisory');
  const nog = GATES.filter(g => g.kind === 'gate' && g.consumer.length === 0);
  console.log('  登记的门: ' + GATES.length + '（其中闸门 ' + (GATES.length - adv.length) + ' · 参考 ' + adv.length + '）');
  if (nog.length) console.log('  ❌ 有闸门没有消费方（应当降级为 advisory）: ' + nog.map(g => g.id).join(', '));
  else console.log('  ✅ 每个闸门都登记了消费方');
  if (adv.length) console.log('  ℹ 参考类（不每轮跑、不构成闸门）: ' + adv.map(g => g.id).join(', '));
  process.exit(0);
}

if (mode === '--run') {
  const started = new Date().toISOString();
  const results = [];
  for (const g of GATES) {
    if (g.kind === 'advisory' && !process.argv.includes('--all')) { results.push({ id: g.id, ok: null, note: 'advisory 跳过' }); continue; }
    const r = runGate(g);
    results.push({ id: g.id, ok: r.ok, tail: r.ok ? (r.out.trim().split('\n').slice(-1)[0] || '').slice(0, 120) : (r.out.trim().split('\n').slice(-1)[0] || '').slice(0, 160) });
    process.stdout.write((r.ok ? '  ✅ ' : '  ❌ ') + g.id + '\n');
  }
  const failed = results.filter(r => r.ok === false);
  console.log('');
  console.log('  通过 ' + results.filter(r => r.ok === true).length + ' · 失败 ' + failed.length + ' · 跳过 ' + results.filter(r => r.ok === null).length);

  // ★ halted_at 事件（雪宝的建议）：失败时落显式事件，否则「本该停」与「真停了」同形
  const ev = {
    halted_at: new Date().toISOString(),
    halted_by: 'jarvis-dsh',
    run_started_at: started,
    halt_reason_ref: failed.length ? failed.map(f => f.id).join('+') : null,
    failed_gates: failed.map(f => ({ id: f.id, tail: f.tail })),
    passed: results.filter(r => r.ok === true).map(r => r.id),
    skipped_advisory: results.filter(r => r.ok === null).map(r => r.id),
  };
  fs.appendFileSync(EVENTS, JSON.stringify(ev) + '\n', 'utf8');
  console.log('  📝 已落 halted_at 事件 → _halt-events.jsonl' + (failed.length ? '（含 ' + failed.length + ' 个失败门）' : '（无失败门，纯记录）'));
  process.exit(failed.length ? 1 : 0);
}

if (mode === '--verify-events') {
  if (!fs.existsSync(EVENTS)) { console.log('❌ 没有事件文件 —— 先跑 --run'); process.exit(1); }
  const lines = fs.readFileSync(EVENTS, 'utf8').trim().split('\n').filter(Boolean);
  console.log('════ halted_at 事件（共 ' + lines.length + ' 条）════');
  const last = JSON.parse(lines[lines.length - 1]);
  console.log('  最近一次: ' + last.halted_at + ' · 失败门 ' + (last.failed_gates.length || '无') + ' · 通过 ' + last.passed.length);
  if (last.failed_gates.length) last.failed_gates.forEach(f => console.log('    ❌ ' + f.id + ' — ' + f.tail));
  console.log('');
  // 一致性：事件里记的通过门集合，是否与注册表里的闸门集合覆盖一致
  const gateIds = GATES.filter(g => g.kind === 'gate').map(g => g.id);
  const seen = new Set([...last.passed, ...last.failed_gates.map(f => f.id)]);
  const missing = gateIds.filter(id => !seen.has(id));
  if (missing.length) { console.log('  ⚠ 注册表里的闸门未出现在最近一次事件中: ' + missing.join(', ')); process.exit(1); }
  console.log('  ✅ 注册表闸门与事件记录一致（' + gateIds.length + ' 个）');
  process.exit(0);
}

console.log('用法: node _gate-registry.cjs [--list|--run|--verify-events]');
process.exit(2);
