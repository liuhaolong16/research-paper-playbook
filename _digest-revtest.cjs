// ═══════════════════════════════════════════════════════════════
// _digest-revtest.cjs ★ Round 157 · 断言集【内容摘要】的反向测试
//
// 它证明什么：把某条修正的【正文】改一处、标题一字不动 ⇒ 内容摘要必须报出来并具名。
// 为什么需要它：同行 WorkBuddy 指出，原来摘要只覆盖 n|title ⇒ 改正文是【静默】的。
//   这条修复如果没有反向测试守护，下次有人「优化」摘要口径时它会悄悄退回静默。
//
// ★★ 限制（实测 · 必须一起读）：
//   内容摘要【只覆盖 59 个「修正N」节】，不覆盖方法论文件的开篇引言、统合节等其余部分。
//   我第一次做反向测试时把注入点选在开篇引言里（「自评的失效方式不是不认真」那句），
//   结果 --check 退出码 0 ⇒ 我一度误判「修复无效」。实际是【测试打错了位置】。
//   ⇒ 所以：本测试的注入点必须落在「修正N」节正文内；改开篇引言不会被任何人发现。
//
// ★ 判据由【观察到的量】生成，不由作者预期写成（Round 139 的教训）：
//   caught = 退出码 1 且有「改动正文（标题未动）」且具名修正1；
//   并反向佐证标题摘要层未变（否则抓到它的就不是内容摘要）。
//   我第一次的判据去找只在 --write 路径才出现的字符串，于是工具明明抓到了、测试却报「仍然静默」。
// ═══════════════════════════════════════════════════════════════
// 反向测试 v2：注入侵入点改到【真正的修正节正文】里（修正一 · L58 那句）
// 修复前它必须静默（标题摘要看不见）；修复后它必须被内容摘要抓到并具名。
const fs = require('fs');
const cp = require('child_process');
const W = 'E:/DeepSeek/research-paper-playbook';
const M = W + '/playbook/99-methodology.md';
const node = process.execPath;
const run = (args) => { try { return { code: 0, out: cp.execFileSync(node, args, { encoding: 'utf8', cwd: W }) }; } catch (e) { return { code: e.status, out: (e.stdout || '') + (e.stderr || '') }; } };

const orig = fs.readFileSync(M, 'utf8');
// ★ 这一句在「修正一」节正文里
const needle = 'Lead 拿红队清单做覆盖检验';
if (!orig.includes(needle)) { console.log('❌ 找不到注入点'); process.exit(2); }
const patched = orig.replace(needle, 'Lead 拿红队清单做覆盖核对');

let ok = false;
try {
  fs.writeFileSync(M, patched, 'utf8');
  console.log('▶ 注入：修正一 节正文里「覆盖检验」→「覆盖核对」（标题一字未动）');
  console.log('');
  const r = run([W + '/_assertions-digest.cjs', '--check']);
  const tail = r.out.trim().split('\n').slice(-7).join('\n');
  console.log(tail);
  console.log('退出码: ' + r.code);
  console.log('');
  // ★ 判据必须由【观察到的量】生成：
  //   退出码 1 + 输出里出现「内容摘要」这一层 + 出现「改动正文（标题未动）」并具名修正1
  const caught = r.code === 1
    && r.out.includes('内容摘要')
    && r.out.includes('改动正文（标题未动）')
    && /修正1/.test(r.out);
  // 反向佐证：标题摘要那一层必须【没变】——否则抓到它的就不是内容摘要
  const titleLayerIntact = r.out.includes('已存①') && !/改名: 修正/.test(r.out) && !/➕ 新增/.test(r.out) && !/➖ 消失/.test(r.out);
  console.log(caught && titleLayerIntact
    ? '✅ 反向测试通过：修正节正文改了、标题没动 ⇒【被内容摘要抓到】；且标题摘要层未变（证明抓到它的确实是内容摘要）'
    : '❌ 反向测试失败（caught=' + caught + ' · titleLayerIntact=' + titleLayerIntact + '）');
  ok = caught && titleLayerIntact;
} finally {
  fs.writeFileSync(M, orig, 'utf8');
  const after = run([W + '/_assertions-digest.cjs', '--check']);
  console.log('');
  console.log('（已还原原文）还原后 --check 退出码: ' + after.code + (after.code === 0 ? ' ✅ 一致' : ' ❌'));
}
process.exit(ok ? 0 : 1);
