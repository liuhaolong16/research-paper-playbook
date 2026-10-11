// ═══════════════════════════════════════════════════════════════════
// _src-snapshot.cjs ★ Round 168 · 源文件快照（**独立于生成器**）
//
// 为什么需要它：
//   Round 167 我把 07-abstract.md 从 103,538 字节毁到 48,769（`slice(0,n) + 新`
//   漏了 `slice(n)`）。该目录【不是 git 仓库】⇒ 没有版本历史可回退。
//   唯一救回我的，是【生成器的副产物】`_backup/完整版-*.md`。
//   ⇒ 这是【单点依赖】：若损坏后立刻又跑一次生成器覆盖了备份，内容就找不回来。
//   ⇒ 本工具把「恢复能力」从「生成器的副产物」搬到【独立、可核对、可还原】的快照上。
//
// 三条设计纪律（对应本项目已有修正）：
//   ① 【先于编辑】—— 本工具由「改文件之前」调用；它不是编辑者，是编辑者的前置条件。
//   ② 【自证完整】—— 快照写完立即对账：文件数 + 总字节必须与源一致（修正六十二：
//      「拼接式改写必须断言长度守恒」的同一原理，用在【拷贝】上）。
//   ③ 【能备也要能还原】—— 只有备份没有还原路径的文件，是「不知道能不能用」的文件。
//
// 用法：
//   node _src-snapshot.cjs                 → 建快照（默认，供编辑前调用）
//   node _src-snapshot.cjs --list          → 列出已有快照（含自证结果）
//   node _src-snapshot.cjs --verify <dir>  → 复核某个快照是否完整
//   node _src-snapshot.cjs --restore <dir> <相对路径> → 从快照还原单个文件
//   node _src-snapshot.cjs --prune [n]     → 只保留最近 n 个（默认 20）
// 只读模式：--list / --verify 不改任何文件。
// ═══════════════════════════════════════════════════════════════════
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const W = __dirname;
const BK = path.join(W, '_backup');
const PREFIX = 'src-';
const NL = String.fromCharCode(10);

// ── 受保护源文件集合（**源**，不含生成物）──
//   为什么不含 完整版：它是生成物，可由源重建；把它算进来会稀释「源」这个概念。
function sources() {
  const out = [];
  const addDir = (dir, filter) => {
    if (!fs.existsSync(dir)) return;
    for (const f of fs.readdirSync(dir)) {
      const p = path.join(dir, f);
      if (fs.statSync(p).isFile() && filter(f)) out.push(p);
    }
  };
  addDir(path.join(W, 'research'), f => f.endsWith('.md'));          // 11 维度 + 台账
  addDir(path.join(W, 'playbook'), f => f.endsWith('.md'));          // 方法论 / 采纳表 / 头部
  addDir(W, f => f.endsWith('.md') && !f.includes('完整版'));        // 顶层 md（★ 排除生成物「科研论文写作方案-完整版.md」—— Round 169 修正：原用 startsWith 判不出，那个文件名是「科研论文写作方案-完整版.md」）
  addDir(W, f => f.startsWith('_') && (f.endsWith('.cjs') || f.endsWith('.py'))); // 工具
  return out.sort();
}

const rel = p => path.relative(W, p).split(path.sep).join('/');
const sha = b => crypto.createHash('sha256').update(b).digest('hex').slice(0, 16);

function build() {
  const src = sources();
  const rows = src.map(p => { const b = fs.readFileSync(p); return { f: rel(p), n: b.length, h: sha(b) }; });
  const total = rows.reduce((x, r) => x + r.n, 0);

  const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const dir = path.join(BK, PREFIX + stamp);
  fs.mkdirSync(dir, { recursive: true });
  for (const p of src) {
    const dst = path.join(dir, rel(p));
    fs.mkdirSync(path.dirname(dst), { recursive: true });
    fs.copyFileSync(p, dst);
  }

  // ── ② 自证完整：拷贝后逐文件核对 字节数 + 哈希 ──
  const bad = [];
  for (const r of rows) {
    const dst = path.join(dir, r.f);
    if (!fs.existsSync(dst)) { bad.push(r.f + ' 缺失'); continue; }
    const b = fs.readFileSync(dst);
    if (b.length !== r.n) bad.push(r.f + ' 字节不符 ' + b.length + '≠' + r.n);
    else if (sha(b) !== r.h) bad.push(r.f + ' 哈希不符');
  }
  const mem = { createdAt: new Date().toISOString(), dir: path.basename(dir), count: rows.length, totalBytes: total, files: rows, selfCheck: bad.length ? 'FAIL' : 'PASS', problems: bad };
  fs.writeFileSync(path.join(dir, '_manifest.json'), JSON.stringify(mem, null, 2), 'utf8');

  console.log('════ 源文件快照 ════');
  console.log('  目录: _backup/' + path.basename(dir));
  console.log('  文件: ' + rows.length + ' 个 · ' + total + ' 字节');
  console.log('  ★ 自证: ' + (bad.length ? '❌ FAIL —— ' + bad.join(' / ') : '✅ PASS（逐文件字节数与哈希一致）'));
  if (bad.length) process.exitCode = 1;
  return mem;
}

function list() {
  if (!fs.existsSync(BK)) { console.log('（无 _backup 目录）'); return; }
  const ds = fs.readdirSync(BK).filter(d => d.startsWith(PREFIX)).sort();
  console.log('════ 已有源文件快照（' + ds.length + ' 个）════');
  for (const d of ds.slice(-10)) {
    const mf = path.join(BK, d, '_manifest.json');
    if (!fs.existsSync(mf)) { console.log('  ' + d + '  ⚠ 无清单'); continue; }
    const m = JSON.parse(fs.readFileSync(mf, 'utf8'));
    console.log('  ' + d + '  ' + m.count + ' 文件 · ' + m.totalBytes + ' 字节 · 自证 ' + m.selfCheck);
  }
  if (ds.length > 10) console.log('  …（仅显示最近 10 个）');
}

function verify(dir) {
  const mf = path.join(dir, '_manifest.json');
  if (!fs.existsSync(mf)) { console.log('❌ 无清单: ' + dir); process.exitCode = 1; return; }
  const m = JSON.parse(fs.readFileSync(mf, 'utf8'));
  let ok = 0; const bad = [];
  for (const r of m.files) {
    const p = path.join(dir, r.f);
    if (!fs.existsSync(p)) { bad.push(r.f + ' 缺失'); continue; }
    const b = fs.readFileSync(p);
    if (b.length !== r.n || sha(b) !== r.h) bad.push(r.f + ' 不符'); else ok++;
  }
  console.log('  快照 ' + path.basename(dir) + ': ' + ok + '/' + m.files.length + ' 逐文件核对一致 ⇒ ' + (bad.length ? '❌ ' + bad.join(' / ') : '✅'));
  if (bad.length) process.exitCode = 1;
}

function restore(dir, r, toDir) {
  const s = path.join(dir, r);
  if (!fs.existsSync(s)) { console.log('❌ 快照里没有: ' + r); process.exitCode = 1; return; }
  // ★ toDir 给出时：还原到该目录下（**不碰真文件**）⇒ 让「还原」可被门安全地测试
  const d = toDir ? path.join(toDir, r) : path.join(W, r);
  const before = fs.existsSync(d) ? fs.statSync(d).size : -1;
  fs.mkdirSync(path.dirname(d), { recursive: true });
  fs.copyFileSync(s, d);
  console.log('✅ 已还原 ' + r + '：' + (before < 0 ? '（目标不存在）' : before + ' 字节') + ' → ' + fs.statSync(d).size + ' 字节' + (toDir ? '（至 ' + rel(toDir) + '，未改真文件）' : ''));
}

// ── ★ Round 169：陈旧度检查 —— 把「编辑前先建快照」从【纪律】升级为【机械强制】──
//   不变量：「最新快照含有每个受保护源文件的【当前内容】」
//
//   ★★ 为什么比【哈希】而不比【mtime】（Round 169 实测纠正）：
//     初版用 mtime，结果报出 5 处「漂移」，其中 **_branch-test.cjs 造成的 01-topic-selection.md
//     是假阳性** —— 那道门会「注入一行测试内容 → 跑检查 → 从 .bak 还原」，并且
//     **自己断言了还原后 sha 与改前一致**。⇒ 内容没变，只有 **mtime 变了**。
//     ⇒ mtime 是「内容变没变」的**代理量**；**写后还原**会让代理量说谎。
//     ⇒ 这正是本项目修正六十/六十二同族的错：**判据写在代理量上**。
//   改用内容哈希后：**写后还原不再产生噪音，而真正的编辑一定被抓住**（哈希必变）。
function stale() {
  const ds = fs.existsSync(BK) ? fs.readdirSync(BK).filter(d => d.startsWith(PREFIX)).sort() : [];
  if (!ds.length) {
    console.log('  ❌ 没有任何源文件快照 —— 恢复能力为零。请先运行 `node _src-snapshot.cjs`。');
    process.exitCode = 1; return;
  }
  const latest = ds[ds.length - 1];
  const mf = JSON.parse(fs.readFileSync(path.join(BK, latest, '_manifest.json'), 'utf8'));
  const byRel = new Map(mf.files.map(r => [r.f, r]));
  const known = new Set(mf.files.map(r => r.f));

  const changed = [], missing = [];
  for (const p of sources()) {
    const r = rel(p);
    if (!known.has(r)) { missing.push(r); continue; }
    const rec = byRel.get(r);
    const b = fs.readFileSync(p);
    if (b.length !== rec.n || sha(b) !== rec.h) changed.push(r);
  }
  const gone = mf.files.filter(r => !fs.existsSync(path.join(W, r.f))).map(r => r.f);

  console.log('════ 快照覆盖检查（机械强制「编辑前先建快照」· **按内容哈希**）════');
  console.log('  最新快照: ' + latest + '（' + mf.count + ' 文件 · ' + new Date(mf.createdAt).toISOString() + '）');
  if (!changed.length && !missing.length) {
    console.log('  ✅ 快照覆盖当前状态：所有受保护源文件的**当前内容**都已在快照里');
    if (gone.length) console.log('  （快照里有、现已不存在的文件 ' + gone.length + ' 个，不算错：' + gone.slice(0, 5).join(', ') + '）');
    return;
  }
  if (changed.length) {
    console.log('  ❌ 内容已变、当前版本不在任何快照里的文件（' + changed.length + ' 个）：');
    changed.slice(0, 20).forEach(r => console.log('      ' + r));
    if (changed.length > 20) console.log('      …（另有 ' + (changed.length - 20) + ' 个）');
  }
  if (missing.length) {
    console.log('  ❌ 快照里没有的新文件（' + missing.length + ' 个）—— **从未被保护过**：');
    missing.slice(0, 20).forEach(r => console.log('      ' + r));
    if (missing.length > 20) console.log('      …（另有 ' + (missing.length - 20) + ' 个）');
  }
  console.log('');
  console.log('  ⇒ 处置：跑 `node _src-snapshot.cjs` 建新快照，再重跑本检查。');
  process.exitCode = 1;
}

const argv = process.argv.slice(2);
const mode = argv[0] || '';

if (mode === '--list') list();
else if (mode === '--stale') stale();
else if (mode === '--verify') verify(argv[1] || path.join(BK, fs.readdirSync(BK).filter(d => d.startsWith(PREFIX)).sort().pop() || ''));
else if (mode === '--restore') restore(argv[1], argv[2], argv[3]);
else if (mode === '--prune') {
  const keep = parseInt(argv[1] || '20', 10);
  const ds = fs.readdirSync(BK).filter(d => d.startsWith(PREFIX)).sort();
  const del = ds.slice(0, Math.max(0, ds.length - keep));
  for (const d of del) { fs.rmSync(path.join(BK, d), { recursive: true, force: true }); console.log('  删除 ' + d); }
  console.log('  保留 ' + Math.min(ds.length, keep) + ' 个 · 删除 ' + del.length + ' 个');
} else build();
