// ═══════════════════════════════════════════════════════════════════
// _snapshot-revtest.cjs ★ Round 168 · 源文件快照的**门安全**反向测试
//
// 它证明什么（三项都要成立）：
//   ① 【还原真的能用】—— 从快照取回一个文件，内容与快照里记录的哈希一致
//   ② 【自证真的会失败】—— 把快照里的一个副本弄坏，--verify 必须报错
//      （否则「自证 PASS」没有区分力 —— 修正四十一/四十三）
//   ③ 【不碰真文件】—— 全过程把还原写到临时目录，**真源文件字节不变**
//
// 为什么必须有 ③：一个测试如果每次运行都破坏并还原真文件，它自己就是风险源。
//   本工具用 `--restore <snap> <rel> <toDir>` 把「还原」导向临时目录。
// ═══════════════════════════════════════════════════════════════════
const fs = require('fs');
const cp = require('child_process');
const crypto = require('crypto');
const path = require('path');
const os = require('os');
const W = __dirname;
const NODE = process.execPath;
const sha16 = b => crypto.createHash('sha256').update(b).digest('hex').slice(0, 16);  // ★ 与清单同口径
const sha = b => crypto.createHash('sha256').update(b).digest('hex');
const run = (...a) => cp.spawnSync(NODE, [W + '/_src-snapshot.cjs', ...a], { encoding: 'utf8', cwd: W });

let pass = true;
const say = (ok, s) => { console.log('  ' + (ok ? '✅' : '❌') + ' ' + s); if (!ok) pass = false; };

const bd = W + '/_backup';
if (!fs.existsSync(bd)) { console.log('❌ 无 _backup'); process.exit(1); }
const snaps = fs.readdirSync(bd).filter(d => d.startsWith('src-')).sort();
if (!snaps.length) { console.log('❌ 没有源文件快照 —— 先跑 node _src-snapshot.cjs'); process.exit(1); }
const snap = snaps[snaps.length - 1];
const snapDir = path.join(bd, snap);
const mf = JSON.parse(fs.readFileSync(path.join(snapDir, '_manifest.json'), 'utf8'));

console.log('════ 快照反向测试 ════');
console.log('  快照: ' + snap + ' · ' + mf.count + ' 文件 · 自证 ' + mf.selfCheck);
console.log('');

// ── ① 还原可用（写到临时目录，不碰真文件）──
const T = mf.files[0].f;                                     // 取快照里第一个文件
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'snaprev-'));
const realPath = path.join(W, T);
const realBefore = fs.existsSync(realPath) ? sha(fs.readFileSync(realPath)) : null;

console.log('① 还原可用性（目标: ' + T + '）');
const r1 = run('--restore', snapDir, T, tmp);
const outPath = path.join(tmp, T);
say(fs.existsSync(outPath), '还原产物已生成到临时目录');
if (fs.existsSync(outPath)) {
  const h = sha16(fs.readFileSync(outPath));                 // ★ 与清单同口径（16 位）
  say(h === mf.files[0].h, '还原产物的哈希 = 快照清单记录的哈希（同为 16 位口径）');
}
console.log('');

// ── ② 自证会失败（弄坏快照里另一个副本）──
console.log('② 自证区分力（弄坏快照里的一个副本）');
const victim = mf.files.length > 1 ? mf.files[1].f : mf.files[0].f;
const vp = path.join(snapDir, victim);
if (!fs.existsSync(vp)) { say(false, '快照里找不到 ' + victim); }
else {
  const keep = fs.readFileSync(vp);
  fs.writeFileSync(vp, keep.slice(0, Math.max(10, Math.floor(keep.length / 3))));
  const v = run('--verify', snapDir);
  say(v.status !== 0, '--verify 对损坏的快照报错（退出码 ' + v.status + '）');
  fs.writeFileSync(vp, keep);
  const v2 = run('--verify', snapDir);
  say(v2.status === 0, '修复后 --verify 恢复通过');
}
console.log('');

// ── ③ 真文件未被触碰 ──
console.log('③ 不碰真文件');
const realAfter = fs.existsSync(realPath) ? sha(fs.readFileSync(realPath)) : null;
say(realBefore === realAfter, '真源文件 ' + T + ' 哈希未变');
console.log('');

fs.rmSync(tmp, { recursive: true, force: true });
console.log(pass ? '════ ✅ 快照反向测试通过 ════' : '════ ❌ 有测试未通过 ════');
process.exit(pass ? 0 : 1);
