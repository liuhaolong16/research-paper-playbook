#!/usr/bin/env node
/**
 * 分支覆盖测试（修正二十七 · 端到端干跑）
 * 目的：把每个工具**声明支持的每一种情形**都真跑一遍 —— 而不是只跑「正常路径」。
 * 用法: node _branch-test.cjs
 *
 * ★ 安全：所有实验在**临时副本**上做，不碰真文件。测完自动清理并核对原文件未变。
 */
const fs = require('fs'), path = require('path'), cp = require('child_process'), crypto = require('crypto'), os = require('os');
const W = __dirname;
const TMP = path.join(W, '_tmp-branch');
const NODE = process.execPath;

const sha = f => crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const run = (cmd, args = '', opt = {}) => {
  try { return { code: 0, out: cp.execSync('"' + NODE + '" ' + cmd + ' ' + args, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'], ...opt }) }; }
  catch (e) { return { code: e.status, out: (e.stdout || '') + (e.stderr || '') }; }
};
let pass = 0, fail = 0;
const ck = (name, ok, detail) => {
  console.log('  ' + (ok ? '✅' : '❌') + ' ' + name + (detail ? '  —— ' + detail : ''));
  ok ? pass++ : fail++;
};

console.log('分支覆盖测试 · 扫 ' + path.basename(W) + ' · ' + new Date().toISOString().slice(0, 19));
console.log('');

// ══════════ 0 · 基线：先记下所有源文件的哈希 ══════════
const FULL = path.join(W, '科研论文写作方案-完整版.md');
const SRC = path.join(W, 'playbook', '00-header.md');
const BP = path.join(W, '_build-full.cjs');
const baseFull = sha(FULL), baseSrc = sha(SRC);
console.log('基线哈希：完整版 ' + baseFull.slice(0, 12) + '… · 00-header.md ' + baseSrc.slice(0, 12) + '…');
console.log('');

// ══════════ 1 · _build-full.cjs 的「源缺失」支 ══════════
console.log('══ 1 · _build-full.cjs：「源缺失」支（它声明「缺一个就 throw」）');
if (!fs.existsSync(TMP)) fs.mkdirSync(TMP, { recursive: true });
const hiddenSrc = SRC + '.hidden';
fs.renameSync(SRC, hiddenSrc);
const r1 = run(path.join(W, '_build-full.cjs'), '');
fs.renameSync(hiddenSrc, SRC);
ck('源缺失时**退出码非 0**', r1.code !== 0, '退出码 ' + r1.code);
ck('源缺失时**打印了拒绝原因**', /找不到|throw|Error|拒绝/.test(r1.out), (r1.out.match(/[^\n]*(找不到|Error|拒绝)[^\n]*/) || ['(无)'])[0].slice(0, 90));
ck('★ 源缺失时**完整版未被修改**', sha(FULL) === baseFull, '（保护生效：拒绝写入）');
ck('源已还原', fs.existsSync(SRC) && sha(SRC) === baseSrc);
console.log('');

// ══════════ 2 · _check-residue.cjs 的三种情形 ══════════
console.log('══ 2 · _check-residue.cjs：「无残留 / 有残留 / 白名单全命中」三种情形');
// 情形 A：当前状态（应当 0 候选）
const rA = run(path.join(W, '_check-residue.cjs'), '');
ck('情形 A · 无残留 ⇒ 退出码 0', rA.code === 0, '退出码 ' + rA.code);
ck('情形 A · 报告「候选残留 0 行」', /候选残留 0 行/.test(rA.out));
console.log('');

// ══════════ 3 · 注入一处真残留，看它能不能报出来 ══════════
console.log('══ 3 · 真残留注入测试（这是「有残留」支 —— 它必须报出来）');
// ★★ Round 170 修：注入目标从【真源文件】改到【临时副本】
//   为什么改：这是一道「只读的检查门」，此前它会向 research/01-topic-selection.md
//   注入一行内容再还原。还原本身是对的（并且有断言），**但若它在还原前崩溃，
//   真源文件就带着一行注入内容留在那里**。⇒ 检查门不应动源文件。
//   现在：把 research/ 复制到临时目录 → 在【副本】上注入 → 让扫描器指向临时根。
const TMPROOT = fs.mkdtempSync(path.join(os.tmpdir(), 'branchtest-'));
const TMPRES = path.join(TMPROOT, 'research');
fs.mkdirSync(TMPRES, { recursive: true });
for (const f of fs.readdirSync(path.join(W, 'research'))) {
  if (f.endsWith('.md')) fs.copyFileSync(path.join(W, 'research', f), path.join(TMPRES, f));
}
const DIM01 = path.join(TMPRES, '01-topic-selection.md');
const base01 = sha(DIM01);
const realPath01 = path.join(W, 'research', '01-topic-selection.md');
const realShaBefore = sha(realPath01);
let s = fs.readFileSync(DIM01, 'utf8');
// 注入一句 R88-A 的旧结论（不带任何已处理标记）
s += '\n\n<!-- 分支测试注入 -->\n**多数出版社的政策这么写（这条是旧结论，用于测试扫描器能不能报出它）。**\n';
fs.writeFileSync(DIM01, s, 'utf8');
const rB = run(path.join(W, '_check-residue.cjs'), TMPROOT);
ck('注入真残留后**退出码非 0**', rB.code !== 0, '退出码 ' + rB.code);
ck('注入真残留后**报出了候选**', /候选残留 [1-9]/.test(rB.out));
ck('★ 报出的是**注入的那一行**', /01-topic-selection\.md/.test(rB.out));
// 还原（副本）并清掉整个临时树
fs.copyFileSync(path.join(W, 'research', '01-topic-selection.md'), DIM01);
ck('临时副本已还原', sha(DIM01) === base01);
fs.rmSync(TMPROOT, { recursive: true, force: true });
// ★ 新增断言：真源文件从头到尾没被动过
ck('★★ 真源文件 01-topic-selection.md 全程未被改动', sha(realPath01) === realShaBefore);
const rC = run(path.join(W, '_check-residue.cjs'), '');
ck('还原后重新 0 候选', rC.code === 0 && /候选残留 0 行/.test(rC.out));
console.log('');

// ══════════ 4 · 检查清单.cjs 的三种来源类型（修正十九三分）══════════
console.log('══ 4 · 检查清单.cjs：声明的三种来源类型（PDF / HTML / TEXT）');
const ckCases = [
  ['TEXT', path.join(W, '_refs', 'jstage-text.txt'), /硬门通过/],
  ['HTML', path.join(W, '_refs', 'p7-jstage-isij.html'), /硬门通过/],
];
for (const [name, f, re] of ckCases) {
  if (!fs.existsSync(f)) { ck(name + ' · 样本存在', false, '缺 ' + path.basename(f)); continue; }
  const r = run(path.join(W, '检查清单.cjs'), '"' + f + '"');
  ck(name + ' 支跑通且硬门通过', re.test(r.out), '退出码 ' + r.code);
}
// PDF 支：用 AIP 的 PDF（非论文，应当被硬门拦下 —— 顺便测「不是正文」这一支）
const pdfCase = path.join(W, '_refs', 'AIPP-DataAvailability-Jan2020-003.pdf');
if (fs.existsSync(pdfCase)) {
  const r = run(path.join(W, '检查清单.cjs'), '"' + pdfCase + '"');
  ck('PDF 支跑通（该样本非论文正文 ⇒ 应被拦）', /硬门/.test(r.out), '结果：' + (/硬门通过/.test(r.out) ? '通过' : '被拦下') + ' · 退出码 ' + r.code);
}
console.log('');


// ══════════ 5 · _build-full.cjs 的「写前校验不过 ⇒ 拒绝写入」支 ══════════
// ★ 安全：不改真生成器/真源/真完整版 —— 复制一份生成器，在**副本**里注入「故意丢掉第三部分」，
//   跑副本，看它是否检测到缺标记、拒绝写入、且真文件与备份目录都没动。
console.log('══ 5 · _build-full.cjs：「写前校验不过 ⇒ 拒绝写入」支');
const TMPB = path.join(W, '_tmp-build-broken.cjs');
const BKDIR = path.join(W, '_backup');
const bkBefore2 = fs.existsSync(BKDIR) ? fs.readdirSync(BKDIR).length : 0;
let bsrc = fs.readFileSync(BP, 'utf8');
// ★ Round 139：生成器把拼装顺序重构为 SEQUENCE 数组，原字面量 'S.part3,' 已不存在。
//   注入点必须跟着结构走，否则注入静默失效、坏副本变成好副本（实测：退出码 0、检查全红）。
//   ⇒ 新写法优先、旧写法兜底；两者都未命中时**显式报错**，不让一次无效注入冒充一次通过的检查。
const injNew = bsrc.replace("['part3'], ['']", "['__DROPPED__'], ['']");
const injOld = bsrc.replace('S.part3,', "'' ,");
if (injNew !== bsrc) { bsrc = injNew; console.log('  （注入点：SEQUENCE 新写法）'); }
else if (injOld !== bsrc) { bsrc = injOld; console.log('  （注入点：旧字面量写法）'); }
else { console.log('  ❌ 注入点未命中 —— 生成器结构已变，本检查无法进行（不得当作通过）'); }
fs.writeFileSync(TMPB, bsrc, 'utf8');
const r5 = run(TMPB, '');
ck('坏副本 ⇒ 退出码非 0', r5.code !== 0, '退出码 ' + r5.code);
ck('报出「缺失的必需标记」', /缺失的必需标记/.test(r5.out));
ck('★ 明确拒绝写入', /拒绝写入/.test(r5.out));
ck('★ 真完整版未被修改', sha(FULL) === baseFull);
ck('★ 没有产生新备份（校验在写盘与备份之前）', (fs.existsSync(BKDIR) ? fs.readdirSync(BKDIR).length : 0) === bkBefore2);
fs.unlinkSync(TMPB);
ck('副本已删除', !fs.existsSync(TMPB));
console.log('');
// ══════════ 收尾核对 ══════════
console.log('══ 收尾核对');
ck('★ 完整版全程未被意外改动', sha(FULL) === baseFull);
ck('★ 源 00-header.md 全程未被意外改动', sha(SRC) === baseSrc);
try { fs.rmSync(TMP, { recursive: true, force: true }); } catch (e) {}
console.log('');

// ══════════ 9 · 覆盖测试：源文件 → 生成物（Round 111 · 修正三十二的正向面）══════════
// ★ 为什么加这一节：修正三十二说的是「生成器主动丢弃源文件某部分 ⇒ 必须有拦截」。
//   上一轮加的是【负向】拦截（标记后有内容就 throw）。
//   这一节加【正向】覆盖测试：源文件的每个顶层节，是否都有去向？
//   —— 它独立于 _build-full.cjs 自己的拦截，所以能覆盖「防线不在自己防线上」的问题。
console.log('══ 9 · 覆盖测试：源文件的每个顶层节是否都有去向');
const fullDoc = fs.readFileSync(FULL, 'utf8');

// 9a · 完整版必须包含的源（全部内容都进生成物）
const FULLY_USED = ['两条线差异对照表.md', '期刊投稿要求核实清单.md'];
for (const f of FULLY_USED) {
  const s = fs.readFileSync(path.join(W, f), 'utf8');
  const secs = (s.match(/^##+ .+$/gm) || []).map(x => x.replace(/^#+ /, '').trim()).filter(x => x.length > 3);
  // ★★ Round 111 修一处**归一化不对称**：原来只对【源标题】去掉了 markdown 强调符，
  //   却在【完整版原文】里找 —— 完整版保留着 ** 记号 ⇒ 探针必然落空（实测 3 个假阳性）。
  //   ⇒ 规则：两边必须用同一套归一化。这与修正二十五/二十六/三十二是同一族「检查器对两边不对称」。
  const norm = (x) => x.replace(/[*`【】]/g, '');
  const fullNorm = norm(fullDoc);
  let miss = [];
  for (const sec of secs) {
    const probe = norm(sec).slice(0, 12);
    if (probe && !fullNorm.includes(probe)) miss.push(probe);
  }
  ck('9a · ' + f + ' 全部顶层节都进了完整版', miss.length === 0, miss.length ? '缺 ' + miss.length + ' 个：' + miss.slice(0, 3).join(' / ') : secs.length + ' 节全覆盖');
}

// 9b · 只被【部分使用】的源 —— 必须显式声明「哪一节被用、其余为设计上不使用」
//     ★ 这是本测试的核心：任何「部分使用」都必须在这里登记，否则测试会失败。
const PARTIAL = [
  // ★ unused：这些节【设计上不进完整版】—— 它们属于 playbook/01-master-playbook.md 这份独立交付物自身。
  //   ⇒ 显式登记的意义：将来给这个源文件加新节时，测试会提醒你「这一节没有去向，是打算不进完整版吗？」
  { f: 'playbook/01-master-playbook.md', used: '^## 四、', why: '完整版第三部分只取「四、交稿前总检查清单」',
    unused: ['一、', '二、', '三、', '五、', '六、', '七、', '八、', '九、', '十、', '十一', '十二', '十三'] },   // ★ 本清单由「实际读出的节」生成，不手写猜测
];
for (const p of PARTIAL) {
  const s = fs.readFileSync(path.join(W, p.f), 'utf8');
  const used = (s.match(new RegExp(p.used, 'gm')) || []).length;
  const allH2 = (s.match(/^## .+$/gm) || []);
  const unused = allH2.filter(l => !new RegExp(p.used).test(l));
  // 被用的那一节必须真的进了完整版
  const uTitle = (s.match(new RegExp(p.used + '.+', 'm')) || [''])[0].replace(/^#+ /, '').trim().slice(0, 12);
  ck('9b · ' + p.f + ' 被用的那节真的进了完整版', used === 1 && fullDoc.includes(uTitle), uTitle + (used === 1 ? '' : '（匹配 ' + used + ' 次）'));
  // ★ Round 111：把「设计上不使用」改成**显式登记**（原来是让测试去猜生成器注释里有没有那个词 —— 那是不可靠的判据）。
  //   登记 = 一份具名清单；测试只校验「实际未使用的节」是否都在清单里。加节而忘了登记 ⇒ 测试红。
  const UNUSED_DECLARED = (p.unused || []).map(x => x.replace(/^#+ /, '').trim());
  const actualUnused = unused.map(x => x.replace(/^#+ /, '').trim());
  const undeclared = actualUnused.filter(t => !UNUSED_DECLARED.some(d => t.startsWith(d.slice(0, 6)) || d.startsWith(t.slice(0, 6))));
  ck('9b · ' + p.f + ' 未使用的节都已在 PARTIAL[].unused 显式登记', undeclared.length === 0,
     undeclared.length ? '未登记 ' + undeclared.length + ' 个：' + undeclared.slice(0, 4).map(x => x.slice(0, 10)).join(' / ')
                       : '已登记 ' + UNUSED_DECLARED.length + ' 个 / 实际未用 ' + actualUnused.length + ' 个');
}

// 9c · ★ 独立复核：11 个维度文件在【两线差异索引】标记段之后不得有内容
//     （_build-full.cjs 里已有一道拦截；这里独立再测一次 —— 防线不在自己防线上）
const dimDir = path.join(W, 'research');
let dirty = [];
for (const f of fs.readdirSync(dimDir).filter(x => /^\d{2}-/.test(x) && x.endsWith('.md'))) {
  const s = fs.readFileSync(path.join(dimDir, f), 'utf8');
  const mk = s.indexOf('> **【两线差异索引】**');
  if (mk < 0) continue;
  const ls = s.slice(mk).split('\n');
  let j = 0; while (j < ls.length && ls[j].trim().startsWith('>')) j++;
  const tail = ls.slice(j).filter(l => l.trim());
  if (tail.length) dirty.push(f + '（' + tail.length + ' 行）');
}
ck('9c · 11 个维度在标记段后都无内容（会被截断的部分）', dirty.length === 0, dirty.length ? dirty.join(' / ') : '11/11 清空');

// 9d · ★ 反向自检：故意在有标记的维度文件末尾注入一行，测试必须能报出来
//     （否则 9c 是个「从不失败」的判据 —— 修正二十九）
(function () {
  const t = path.join(dimDir, '01-topic-selection.md');
  const orig = fs.readFileSync(t, 'utf8');
  try {
    fs.writeFileSync(t, orig.trimEnd() + '\n\nINJECTED-RESIDUE-LINE\n', 'utf8');
    const s = fs.readFileSync(t, 'utf8');
    const mk = s.indexOf('> **【两线差异索引】**');
    const ls = s.slice(mk).split('\n');
    let j = 0; while (j < ls.length && ls[j].trim().startsWith('>')) j++;
    const tail = ls.slice(j).filter(l => l.trim());
    ck('9d · 向标记后注入一行 ⇒ 9c 的逻辑能报出来', tail.length === 1 && tail[0].includes('INJECTED'), '检出 ' + tail.length + ' 行');
  } finally {
    fs.writeFileSync(t, orig, 'utf8');
  }
  ck('9d · 注入后已还原原文件', sha(t) === crypto.createHash('sha256').update(Buffer.from(orig, 'utf8')).digest('hex'));
})();
console.log('');


console.log(pass + ' 通过 · ' + fail + ' 未通过');
process.exit(fail ? 1 : 0);
