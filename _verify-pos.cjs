const fs = require('fs');
const W = 'E:/DeepSeek/research-paper-playbook';
const R = W + '/research';
const NL = String.fromCharCode(10);

// ★ 否定词表（Round 143 修误报）：原来单写一个「别」，会被「别人 / 个别 / 分别 / 区别 / 特别 / 识别」误命中。
//   实测：05-references 的「**别人能照着重做一遍**」被当成纯否定式 —— 它其实是正向可观察的。
//   ⇒ 改为只在「别」后面跟动词性搭配时才算否定。
const NEG = /(不要|不得|不应|不能|避免|禁止|勿|无需|别提|别写|别说|别用|严禁|不可|切勿)/;
const POS = /(✓\s*正向|正向等价|正向：)/;

const dims = fs.readdirSync(R).filter(f => /^\d\d-/.test(f) && f.endsWith('.md')).sort();
let total = 0, negOnly = 0, negWithPos = 0, negNoPos = 0;
const missing = [];

for (const f of dims) {
  const lines = fs.readFileSync(R + '/' + f, 'utf8').split('\n');
  // 判据块存在性
  if (!lines.some(l => l.includes('正向形式通则'))) missing.push(f + '（无正向形式通则）');
  let st = -1, en = lines.length;
  for (let i = 0; i < lines.length; i++) {
    if (/^#{2,3} .*(验收判据|自检清单)/.test(lines[i])) { st = i; continue; }
    if (st >= 0 && /^## /.test(lines[i]) && i > st) { en = i; break; }
  }
  if (st < 0) continue;
  for (let i = st + 1; i < en; i++) {
    const l = lines[i];
    if (!/^\s*[-*]\s*\[?\s?\]?/.test(l) && !/^\s*\d+\./.test(l)) continue;
    if (l.length < 8) continue;
    total++;
    if (!NEG.test(l)) continue;
    negOnly++;
    // ±2 行内是否有 ✓ 正向
    const win = lines.slice(Math.max(0, i - 2), Math.min(lines.length, i + 3)).join(NL);
    if (POS.test(win)) negWithPos++;
    else { negNoPos++; missing.push(f + ':' + (i + 1) + '  ' + l.trim().slice(0, 80)); }
  }
}
console.log('════ 正向形式落点验证（±2 行窗口）════');
console.log('  验收项合计: ' + total);
console.log('  含否定词: ' + negOnly);
console.log('  ★ 其中附近有 `✓ 正向` 的: ' + negWithPos + ' / ' + negOnly);
console.log('  ⚠ 仍缺正向等价的: ' + negNoPos);
if (missing.length) { console.log(''); missing.forEach(m => console.log('  ⚠ ' + m)); }
console.log('');
console.log(negNoPos === 0 ? '✅ 所有含否定词的验收项都有正向等价（或已写作正向可观察形式）' : '⚠ 仍有缺项');
console.log('   ℹ 否定词表已排除「别人 / 个别 / 分别 / 区别 / 特别 / 识别」类误报（Round 143 实测修正）');
process.exit(negNoPos === 0 ? 0 : 1);
