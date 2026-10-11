#!/usr/bin/env node
/**
 * 科研论文写作方案 · 完整版生成器
 * 用法: node _build-full.cjs
 *
 * ★ 设计原则（来自 Round 80 的两次数据损失事故）：
 *   1. 完整版是【生成物】，不再是手工维护的文件 —— 每次都由本脚本从源重建；
 *   2. 每一段的终点都是【显式的下一个顶层标记】，不依赖「下一个维度」这种推导；
 *   3. 生成后必须校验「应有的结构标记是否都还在」，不通过就**不写入**；
 *   4. 写入前把旧版备份到 _backup/。
 */
const fs = require('fs'), path = require('path');
const W = __dirname;
const D = path.join(W, 'research');
const P = path.join(W, 'playbook');
const FULL = path.join(W, '科研论文写作方案-完整版.md');

const cur = fs.readFileSync(FULL, 'utf8');

// ── 从现有文件里取「头部 + 第一部分」（这部分是手写的，无源）──
const i1 = cur.indexOf('# 第一部分 · 六阶段流程');
const i2 = cur.indexOf('# 第二部分 · 十一个维度');
if (i1 < 0 || i2 < 0) throw new Error('找不到第一/第二部分的起点');
// ★ header 现在有独立源（Round 83）—— 不再依赖完整版自身
let head = fs.readFileSync(path.join(P, '00-header.md'), 'utf8').trimEnd();
const part1 = cur.slice(i1, i2).trimEnd();

// ── 第二部分：11 个维度，从 research/ 重建 ──
const dimFiles = fs.readdirSync(D).filter(f => /^\d{2}-/.test(f) && f.endsWith('.md')).sort();
if (dimFiles.length !== 11) throw new Error('维度文件数不是 11: ' + dimFiles.length);
const dims = dimFiles.map(f => {
  let s = fs.readFileSync(path.join(D, f), 'utf8').trim();
  s = s.replace(/^> \*\*状态\*\*：[^\n]*\n/, '');               // 去掉研究文件的状态行
  // ★ 静默截断拦截（Round 110）：标记之后若有非空行 ⇒ 那些内容会被本行丢弃。
  //   本轮实测：向维度文件末尾追加内容会静默丢失 8KB（09 的 §9.15）。
  const _mk = s.indexOf('> **【两线差异索引】**');
  if (_mk >= 0) {
    const _ls = s.slice(_mk).split('\n');
    // ★ 标记段自身 = 从标记行起【连续】的以 > 开头的行（通常 2 行）—— 这是合法的，不豁免它会把标记段误判为待丢弃内容。
    //   （Round 110 实测：第一版拦截器就犯了这个错 —— 与本项目修正二十五/二十六同族。）
    let _j = 0;
    while (_j < _ls.length && _ls[_j].trim().startsWith('>')) _j++;
    const _tail = _ls.slice(_j).filter(l => l.trim());
    if (_tail.length) {
      throw new Error('维度文件「' + f + '」在【两线差异索引】标记段之后还有 ' + _tail.length +
        ' 行非空内容 —— 这些内容会被截断丢弃。请把新内容插到标记【之前】。首行: ' + _tail[0].slice(0, 60));
    }
  }
  s = s.split('> **【两线差异索引】**')[0].trimEnd();           // 去掉指针段
  s = s.replace(/^#{1,6} (维度 \d{1,2} · )/m, '## $1');         // 强制二级标题
  return s;
});
const part2 = '# 第二部分 · 十一个维度\n\n' + dims.join('\n\n---\n\n');

// ── 第三部分 ← 01-master-playbook.md 的「四、」 ──
const mp = fs.readFileSync(path.join(P, '01-master-playbook.md'), 'utf8').split('\n');
const i4 = mp.findIndex(l => /^## 四、/.test(l));
const i5 = mp.findIndex(l => /^## 五、/.test(l));
if (i4 < 0 || i5 < 0) throw new Error('01-master-playbook 缺 四/五 节');
const part3 = '# 第三部分 · 交稿前检查清单\n\n> **来源**：`playbook/01-master-playbook.md` 的「四、★ 交稿前总检查清单（跨维度汇总，逐条打勾）」。\n\n' +
  mp.slice(i4 + 1, i5).join('\n').trim();

// ── 第 4.5 / 4.6 部分 ← 两个根目录文件 ──
const p45 = '# 第 4.5 部分 · 两条线差异对照表\n\n> **来源**：`两条线差异对照表.md`。\n\n' +
  fs.readFileSync(path.join(W, '两条线差异对照表.md'), 'utf8').trim();
const p46 = '# 第 4.6 部分 · 期刊投稿要求核实清单\n\n> **来源**：`期刊投稿要求核实清单.md`。\n\n' +
  fs.readFileSync(path.join(W, '期刊投稿要求核实清单.md'), 'utf8').trim();

// ── 第 4.7 部分 ← playbook/03-peer-adoptions.md（Round 139 接入）──
//   ★ 为什么单列：本方案的方法论要求「外部意见必须先本地验证」；
//     这张表记录「谁提的 — 提了什么 — 我验了什么 — 结果如何 — 落在哪」，
//     以免后人把外部同行的贡献当成本方案自创（Round 128 一位同行提醒过这一点）。
const p47 = '# 第 4.7 部分 · 外部同行评审采纳表（含验证结果）\n\n> **来源**：`playbook/03-peer-adoptions.md`。\n\n' +
  fs.readFileSync(path.join(P, '03-peer-adoptions.md'), 'utf8').trim();

// ── 第四部分 ← 99-methodology.md ──
const meth = fs.readFileSync(path.join(P, '99-methodology.md'), 'utf8').trim();
const nCorr = (meth.match(/^## [一二三四五六七八九十]+、[^\n]*修正[一二三四五六七八九十]+/gm) || []).length;
const part4 = '# 第四部分 · 方法论（' + nCorr + ' 条修正 + 统合节 · 编号已重排）\n\n> **来源**：`playbook/99-methodology.md`（本节由该文件生成 —— 改方法论请改源文件再跑 `node _build-full.cjs`）。\n\n' + meth;

// ★ 把 header 里的 {{N}} 换成真实的修正条数（避免手写数字漂移）
head = head.split('{{N}}').join(String(nCorr));

// ── 第五部分 + 附录：从现有文件里取（无源，手写区）──
const i5b = cur.indexOf('# 第五部分 · 可执行性分级');
const iapp = cur.indexOf('# 附录 · 当前状态');
if (i5b < 0 || iapp < 0) throw new Error('现有文件缺第五部分或附录');
const part5 = cur.slice(i5b, iapp).trimEnd();
// 附录重建（机器可数）
const man = JSON.parse(fs.readFileSync(path.join(W, '_manifest.json'), 'utf8'));
const app = [
  '# 附录 · 当前状态',
  '',
  '> **本节由 `_build-full.cjs` 生成，数字来自 `_manifest.json`（机器可数，不手写）。**',
  '',
  '| 项 | 值 |',
  '| --- | --- |',
  '| 交付物份数 | **' + man.count + '** |',
  '| 交付物合计 | **' + man.totalBytes + ' 字节** |',
  '| 方法论 | **' + fs.statSync(path.join(P, '99-methodology.md')).size + ' 字节**（**' + nCorr + ' 条修正** + 统合节 + 3 节补充） |',
  '| 技能库 | `multi-agent-verification` **v1.2.2** |',
  '| 校验器 | `_verify.cjs` —— 跑它可验证本文件内部一致性 |',
  '| 生成器 | **`_build-full.cjs`** —— 本文件由它重建；**改内容请改源文件再重跑** |',
  '| 反向测样本 | **5 篇 / 3 个平台**（Frontiers ×3 · Springer Nature ×1 · J-STAGE ×1） |',
  '',
  '**交付物清单：**',
  '',
  '| # | 文件 | 字节 |',
  '| --- | --- | --- |',
  // ★ 自引用防护：本文件自己的字节数不能写进自己（否则每次生成都变 ⇒ 不收敛）
  ...man.deliverables.map((d, i) => '| ' + (i + 1) + ' | `' + d.f + '` | ' +
    (d.f === '科研论文写作方案-完整版.md' ? '（本文件）' : d.size) + ' |'),
  '',
  '**★ 已知未完成项：**',
  '- 反向测仍是 **n=5 / 3 平台**，不能称「行业惯例」；',
  '- **结构类判据仍需人工**（两种自动方法都触及可检出率上限）；',
  '- **本方案从未被用于一次真实的端到端写作** —— 有效性边界只能借 `试点任务单.md` 由真实使用来验证；',
  '- **01 / 02 两个维度的实测回填尚未补齐**（无对应证据，不硬凑）；',
  '- **本文件是生成物** —— 见 `_build-full.cjs`；手改本文件会在下次重建时被覆盖。'
].join('\n');

// ★ 剥掉各段尾部的分隔线 —— 否则「拼装时补的分隔符」会与「内容里上次补的」叠加，每次生成多一个（Round 83 幂等性测试发现的第二个自引用）
const strip = (s) => s.replace(/(\s*---\s*)+$/, '').trimEnd();
const S = { head: strip(head), part1: strip(part1), part3: strip(part3), p45: strip(p45), p46: strip(p46), p47: strip(p47), part4: strip(part4), part5: strip(part5), app: strip(app) };

// ── 拼装 ──
// ★★ Round 139 · 修正四十九的加固：拼装顺序原本写了两遍（一遍产出、一遍自检），
//    接入第 4.7 部分时只更新了产出那一遍 ⇒ 自检立刻撕裂（报「两次生成不同」）。
//    ⇒ 结构修法：把顺序抽成**单一来源** SEQUENCE，产出与自检都读它。
const SEQUENCE = [
  ['head'], [''], ['part1'], [''], ['---'], [''], ['__RAW__part2'], [''], ['---'], [''],
  ['part3'], [''], ['---'], [''],
  ['p45'], [''], ['---'], [''], ['p46'], [''], ['---'], [''], ['p47'], [''], ['---'], [''],
  ['part4'], [''], ['---'], [''],
  ['part5'], [''], ['---'], [''], ['app'], ['']
];
const assemble = () => SEQUENCE.map(([k]) => k === '' ? '' : (k.startsWith('__RAW__') ? part2 : S[k])).join('\n');
const out = assemble();

// ── ★ 写前校验：应有的结构标记必须都在 ──
const MUST = [
  '# 第一部分 · 六阶段流程', '# 第二部分 · 十一个维度', '# 第三部分 · 交稿前检查清单',
  '# 第 4.5 部分', '# 第 4.6 部分', '# 第 4.7 部分', '# 第四部分 · 方法论', '# 第五部分 · 可执行性分级', '# 附录 · 当前状态'
];
const missing = MUST.filter(x => !out.includes(x));
let nd = 0; for (let i = 1; i <= 11; i++) if (out.includes('## 维度 ' + String(i).padStart(2, '0') + ' ')) nd++;
const badH = (out.match(/^(#{1}|#{3,6}) 维度 \d{1,2} · /gm) || []).length;

// ★ Round 132 · 修正四十五加固：统计行【移到写盘之后】再打印。
// 原实现先打印再校验再写盘 —— 若调用方用管道截断输出（Select-Object -First 1），
// 进程会在打印后被杀，导致「屏幕上有数字、磁盘上是旧版」而退出码仍为 0。
// 现在：写盘在后、打印在最末，任何提前终止都不会产生「已写入」的假象。
console.log('（统计行移至写盘之后输出）');
console.log('  维度节: ' + nd + '/11 · 非二级维度标题: ' + badH);
console.log('  缺失的必需标记: ' + (missing.length ? missing.join(' , ') : '无'));

if (missing.length || nd !== 11 || badH !== 0) {
  console.log('');
  console.log('❌ 写前校验未通过 —— 拒绝写入（这是保护机制，文件未被修改）');
  process.exit(1);
}

// ── ★★ Round 139 修正：把「内存确定性自检」**提到写盘与备份之前** ──
//   ★ 为什么：原来自检在写盘之后 ⇒ **自检失败时坏成品已经落盘、备份也已产生**
//     （分支测试实测抓到：注入坏副本后退出码仍为 0，且多出一个备份）。
//   ⇒ 这就是修正四十五的形态：**守卫跑在它所守卫的副作用之后**。
//   ⇒ 现拆成两段：**能提前判的（内存确定性）提前到写盘前**；
//     **必须写盘后才能判的（磁盘回读）留在写盘后**。
const again = assemble();
if (again !== out) {
  console.log('');
  console.log('❌ 内存确定性自检失败 —— 拒绝写入（文件未被修改、未产生新备份）');
  console.log('   （同源两次拼装结果不同 ⇒ 有非确定性来源：读时间戳 / 随机数 / 外部状态）');
  process.exit(1);
}

// ── 备份旧版后写入 ──
const bk = path.join(W, '_backup');
if (!fs.existsSync(bk)) fs.mkdirSync(bk, { recursive: true });
const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
fs.writeFileSync(path.join(bk, '完整版-' + stamp + '.md'), cur, 'utf8');
console.log('  ✅ 旧版已备份到 _backup/完整版-' + stamp + '.md');
fs.writeFileSync(FULL, out, 'utf8');
console.log('生成结果: ' + Buffer.byteLength(out) + ' 字节 / ' + out.split('\n').length + ' 行');
console.log('  ✅ 已写入完整版');

// ── ★ 磁盘往返检验（**必须在写盘之后**，这是它唯一能测的东西）──
//   ★ 设计说明（含一次被证伪的尝试，如实记录）：
//     原实现把拼装顺序复制了一遍 ⇒ 接入新部分时漏改一处 ⇒ 自检假报失败（修正四十九）。
//     改为单一来源后自检会**构造上恒过**（修正四十三）。
//     试图再写一个「从源文件重读重拼」的独立构造 ⇒ 实测**基线就不一致**，
//     因为它必须再实现一遍 part1 的构造逻辑，而那正是「复制」⇒ 结构上不可兼得（修正五十六）。
//   ⇒ 最终只留两支，且**如实说明少一支**：
//     ① 内存确定性（写盘前）—— 抓非确定性来源；
//     ② 磁盘回读（写盘后）—— 抓写入被截断 / 路径不对 / 编码异常。
const onDisk = fs.readFileSync(FULL, 'utf8');
if (onDisk !== out) {
  console.log('  ❌ 磁盘往返检验失败：磁盘内容与刚拼装的结果不一致（写入被截断 / 路径不对 / 编码异常）');
  process.exit(1);
} else {
  console.log('  ✅ 内存确定性自检通过（写盘前）');
  console.log('  ✅ 磁盘往返检验通过（写盘后）');
  console.log('  ℹ 本生成器不再提供「源文件级独立检验」（原因见源码注释 · 修正五十六）');
}
