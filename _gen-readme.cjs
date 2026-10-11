const fs = require('fs');
const W = 'E:/DeepSeek/research-paper-playbook';
const NL = String.fromCharCode(10);
const BT = String.fromCharCode(96);

const names = ['01-topic-selection', '02-framework', '03-structure', '04-databases', '05-references', '06-content', '07-abstract', '08-writing-style', '09-dedup-and-ai-rate', '10-statistics', '11-image-integrity'];
const titles = ['选题', '框架', '结构', '数据库', '参考文献', '内容', '摘要', '写法', '降重与降 AI 率', '统计', '图像'];
const rows = names.map((n, k) => {
  const sz = fs.statSync(W + '/research/' + n + '.md').size;
  return '| **' + (k + 1) + '** | ' + titles[k] + ' | ' + BT + n + '.md' + BT + ' | ' + sz + ' | ✅ 已写 |';
});

const P = W + '/README.md';
let s = fs.readFileSync(P, 'utf8');
const i = s.indexOf('## 维度进度');
const j = s.indexOf(NL + '## ', i + 5);
if (i < 0) { console.log('⚠ 未找到维度进度节'); process.exit(1); }

const head = '## 维度进度' + NL + NL +
  '> **★★ 本表由源文件**实时生成**（Round 133 改为机器生成），并由 ' + BT + '_verify.cjs' + BT + ' **逐项断言** —— 任一维度的字节数与本表不符 ⇒ **校验失败**。**' + NL +
  '> **⇒ 为什么改**：**对抗审查者查出 —— 本表此前停在 **Round 04**（落后约 128 轮），把**四个已写完的维度**标成「⏳ 待写 / 在跑」，' +
  '并把总方案规模**低估约 24 倍**。**' + NL +
  '> **⇒ 一个停在 128 轮前的**状态表**出现在「先读这份了解全貌」的入口文件里，后果不是「数字不准」，而是**使用者对整体完成度形成完全相反的判断**。**' + NL +
  '> **⇒ 这是本项目**修正三十四**（手写计数会漂）的第 **4** 处同型实例、也是**修正四十八**（手写**状态**漂得更危险）的首个实例 ⇒ **凡是状态表，一律改为生成 + 机器断言**。**' + NL + NL +
  '| # | 维度 | 文件 | 字节 | 状态 |' + NL + '| --- | --- | --- | --- | --- |' + NL + rows.join(NL) + NL;

s = s.slice(0, i) + head + (j > 0 ? s.slice(j) : '');
fs.writeFileSync(P, s, 'utf8');
console.log('✅ README 维度进度表已重新生成（11 行，与源文件同源）');
