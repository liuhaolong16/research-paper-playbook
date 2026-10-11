// 科研论文方案 · 声称核验脚本（每次生成完整版后跑一次）
// 用法: node _verify.cjs   退出码 0=全通过, 1=有失败
const fs=require('fs');
const W='E:/DeepSeek/research-paper-playbook';
let fail=0;
const ck=(n,ok,d)=>{ console.log('  '+(ok?'✅':'❌')+' '+n+(d?'  → '+d:'')); if(!ok) fail++; };
const rd=p=>fs.existsSync(p)?fs.readFileSync(p,'utf8'):null;

console.log('=== 1 · 交付物存在性与规模 ===');
const files=['README-从这里开始.md','科研论文写作方案-完整版.md','第一周动作清单.md','正例集.md','两条线差异对照表.md','论文写作填空模板.md','试点任务单.md','实质变更清单.md','反向检验报告.md','期刊投稿要求核实清单.md','两条线差异对照表.md'];
for(const f of files){ const p=W+"/"+f; const s=rd(p); ck(f, !!s && s.length>500, s? Buffer.byteLength(s)+" B":"缺失"); }
const full=rd(W+'/科研论文写作方案-完整版.md')||'';

console.log(''); console.log('=== 2 · 完整版结构 ===');
let nd=0; for(let i=1;i<=11;i++) if(full.includes('## 维度 '+String(i).padStart(2,'0')+' ')) nd++;
ck('★ 维度标题全为二级（同步不会降级标题）', (function(){try{
      const fs2=require('fs');
      const s=fs2.readFileSync(W+'/科研论文写作方案-完整版.md','utf8');
      const bad=[...s.matchAll(/^(#{1}|#{3,6}) 维度 \d{1,2} · /gm)];
      if(bad.length){console.log('        （'+bad.length+' 个非二级维度标题）');return false;}
      return true;
    }catch(e){return false}})());
  ck('含 11 个维度节', nd===11, nd+'/11');
const secs=['第 4.6 部分','第一部分 · 六阶段流程','第二部分 · 十一个维度','第三部分 · 交稿前检查清单','第四部分 · 方法论','第 4.5 部分','第五部分 · 可执行性分级','附录 · 当前状态'];
for(const s of secs) ck("含「"+s+"」", full.includes(s));
for(const f of files.filter(x=>x!=='科研论文写作方案-完整版.md')) ck('配套文件表提到 '+f, full.includes(f));
console.log('  ⏭ 跳过自身: 科研论文写作方案-完整版.md（它不必在自己的配套表里）');

console.log(''); console.log('=== 3 · 声称核验（数实际，不读描述）===');
// 第一周清单 = 阶段 0 产出？
const wk=rd(W+'/第一周动作清单.md')||'';
for(const k of ['六项高代价决定','能力自检表','责任分工表','claim','检索','综述表']) ck('第一周清单含 '+k, wk.includes(k));
// 实质变更清单统计
const ch=rd(W+'/实质变更清单.md')||'';
const rows=ch.split('\n').filter(l=>/^\|\s\*\*v0\./.test(l));
let a=0,b=0,c=0; for(const r of rows){ const last=r.split('|').filter(x=>x.trim()).pop()||''; if(/结论强度/.test(last))a++; if(/动词/.test(last))b++; if(/数字/.test(last))c++; }
ck('变更清单 14 行', rows.length===14, rows.length+'');
ck('结论强度 10 / 动词 4 / 数字 2', a===10&&b===4&&c===2, a+'/'+b+'/'+c);
// 两线标注覆盖
const tbl=rd(W+'/两条线差异对照表.md')||'';
let t2=0; for(let i=1;i<=11;i++) if(tbl.includes('## '+String(i).padStart(2,'0')+' ')) t2++;
ck('对照表覆盖 11 维度', t2===11, t2+'/11');
const jc=rd(W+'/期刊投稿要求核实清单.md')||'';
ck('核实清单含官方 Guide URL', jc.includes('MaterTrans_guideForAuthors.pdf'));
ck('核实清单区分已核实/未核实', jc.includes('已核实')&&jc.includes('仍未核实'));
ck('完整版含选刊访问模式提醒', full.includes('选刊先确认访问模式'));
ck('核实清单含 PDF 提取真值（10 印刷页上限）', full.includes('少于 10 个印刷页')||full.includes('Less than ten printed pages'));
// ★★ Round 116 重写：原判据是「对照表里要出现『第 12 维』这个字样」。
//   实测它【被缺陷本身满足】—— 全仓「第 12 维」只出现在一句悬空引用里，
//   而那句引用指向一个从未写出的维度 ⇒ 这条检查一直在「保护」那个缺陷。
//   ⇒ 改为检查【缺口是否被如实声明】，而不是检查那个字样是否存在。
ck('两条线对照表如实声明第 12 维为「已知缺口」', (function(){try{
  const d = require('fs').readFileSync(W+'/两条线差异对照表.md','utf8');
  // ★ 只做正向断言：缺口节存在 + 写明了应当包含什么 + 写明了为什么没做。
  //   （不做「不得出现第 12 维字样」这类否定断言 —— 更正说明本身必然要引述旧的错引用。）
  return d.includes('本表已知缺口') && d.includes('thesis / prior-publication 政策')
      && d.includes('逐校') && d.includes('双向合规');
}catch(e){return false}})());
  ck('两条线对照表含「必改项」清单', (function(){try{return require('fs').readFileSync(W+'/两条线差异对照表.md','utf8').includes('误差棒类型')}catch(e){return false}})());
  ck('一页速查含「解释句清单」', (function(){try{return require('fs').readFileSync(W+'/一页速查.md','utf8').includes('解释句清单')}catch(e){return false}})());
  ck('一页速查含压缩版三条限定', (function(){try{return require('fs').readFileSync(W+'/一页速查.md','utf8').includes('先读这三条')}catch(e){return false}})());
  ck('一页速查含「数字来源图例」', (function(){try{return require('fs').readFileSync(W+'/一页速查.md','utf8').includes('数字来源图例')}catch(e){return false}})());
  ck('一页速查已标注数字来源等级', (function(){try{return require('fs').readFileSync(W+'/一页速查.md','utf8').includes('【作者判断】')}catch(e){return false}})());
  ck('存在「一页速查.md」且含六阶段门槛', (function(){try{return require('fs').readFileSync(W+'/一页速查.md','utf8').includes('六个阶段 × 每阶段门槛')}catch(e){return false}})());
  ck('完整版配套表提到一页速查', full.includes('一页速查.md'));
  ck('★ 完整版不得把「面板数 = 比例尺数」用作判据（更正说明与方法论记录除外）', !/判据：\*\*面板数 = 比例尺数/.test(full));
    ck('★ 完整版含「显微面板数 = 比例尺数」更正版', full.includes('显微面板数 = 比例尺数'));
    ck('★ 一页速查含「同一物理量」限定语', (function(){try{return require('fs').readFileSync(W+'/一页速查.md','utf8').includes('同一物理量')}catch(e){return false}})());
    ck('★ 一页速查含「同一概念」限定语', (function(){try{return require('fs').readFileSync(W+'/一页速查.md','utf8').includes('同一概念')}catch(e){return false}})());
    ck('★ 方法论含补写的修正二', (function(){try{return require('fs').readFileSync(W+'/playbook/99-methodology.md','utf8').includes('修正二')}catch(e){return false}})());
  // ★ 不写死数字：从方法论文件动态推导修正总数，再比对四处是否一致（避免常量过期）
  ck('★ 修正条数四处一致（动态推导）', (function(){
    try {
      const fs2 = require('fs');
      const meth = fs2.readFileSync(W + '/playbook/99-methodology.md', 'utf8');
      const found = meth.match(/^## [一二三四五六七八九十]+、[^\n]*修正([一二三四五六七八九十]+)/gm) || [];
      const n = found.length;
      // ★ 中文数字用生成函数（不再用写死查找表 —— 表会在条数增长时过期）
      // ★★ 并且不再枚举边界：原版对 k=31 落到 String(k) ⇒ '31'，而文档写「三十一」⇒ 恒假。
      //    这是「三十」这个边界的 off-by-one —— 与上一次「查找表在 21 过期」同型。
      //    改用通用算法（覆盖 1–99），不再有需要枚举的边界。
      const toCn = (k) => {
        const d = ['零','一','二','三','四','五','六','七','八','九'];
        if (k <= 0 || k > 99) return String(k);
        const tens = Math.floor(k / 10), unit = k % 10;
        if (tens === 0) return d[unit];
        const head = tens === 1 ? '十' : d[tens] + '十';
        return head + (unit ? d[unit] : '');
      };
      const nCn = toCn(n);
      const f2 = fs2.readFileSync(W + '/科研论文写作方案-完整版.md', 'utf8');
      const r2 = fs2.readFileSync(W + '/README.md', 'utf8');
      const q2 = fs2.readFileSync(W + '/一页速查.md', 'utf8');
      const ok = f2.includes('方法论（' + n + ' 条修正') &&
                 f2.includes('六阶段门槛 + ' + n + ' 条修正') &&
                 r2.includes(n + ' 条修正') &&
                 q2.includes(n + ' 条修正精要') &&
                 meth.includes('修正' + nCn);
      if (!ok) console.log('        （推导出 ' + n + ' 条，四处未全部一致）');
      return ok;
    } catch (e) { return false; }
  })());
    
    ck('★ 引用完整性：不得指向不存在的维度 / 章节（修正三十五）', (function(){
      // ★ Round 116 立这条：对照表第 7 项曾写「见第 12 维」，而全仓没有第 12 维。
      //   ⇒ 判据：凡出现「第 N 维」这种引用，必须存在对应的维度文件。
      //   ⇒ 假引用比没有引用更坏：使用者以为那里有答案，就不会去找别的。
      //   ★★ 扫描范围必须收窄（Round 116 第二轮修）：
      //     本条查的是「前向指针能否解析」。前向指针只出现在【指导性交付物】里。
      //     · 99-methodology.md 是【教训日志】—— 它必然要引述旧的错引用作为案例；
      //     · 科研论文写作方案-完整版.md 是【生成物】—— 它只是上述文件的副本。
      //     ⇒ 第一版没排除这两者，于是被【修正三十五自己的正文】触发了 7 处假阳性。
      //     ⇒ 与「堆关键词」相比，收窄范围是结构性修法：不用去猜哪些句子算「引述」。
      try {
        const fs2 = require('fs'), p = require('path');
        // 只查指导性交付物（非教训日志、非生成物、非原始素材）
        const SCAN = [
          '两条线差异对照表.md',
          '期刊投稿要求核实清单.md',
          '一页速查.md',
          'README.md',
          'README-从这里开始.md',
          'playbook/01-master-playbook.md',
        ];
        const files = SCAN.filter(f => fs2.existsSync(p.join(W, f)));
        const dimDir = p.join(W, 'research');
        const dimFiles = fs2.readdirSync(dimDir).filter(f => f.endsWith('.md'));
        // 已存在的维度编号（来自 research/NN-*.md）
        const have = new Set(dimFiles.map(f => parseInt(f.slice(0, 2), 10)).filter(n => !isNaN(n)));
        const bad = [];
        // 仍保留一层兜底：明确标记为「引述/更正」的行不算前向指针
        const HIST = /曾写|先前写|此前写|没有任何|已知缺口|悬空|不存在的维度|含第\s*\d+\s*维/;
        for (const f of files) {
          const txt = fs2.readFileSync(p.join(W, f), 'utf8');
          const lines = txt.split('\n');
          lines.forEach((line, idx) => {
            if (HIST.test(line)) return;
            for (const m of line.matchAll(/第\s*(\d+)\s*维/g)) {
              const n = +m[1];
              if (!have.has(n)) bad.push(f + ':' + (idx + 1) + ' 引用第 ' + n + ' 维');
            }
          });
        }
        if (bad.length) { console.log('        （' + bad.length + ' 处悬空引用：' + bad.slice(0, 3).join(' / ') + '）'); return false; }
        return true;
      } catch (e) { return false; }
    })());
ck('★ 全仓修正计数一致性（正向列举声明点）', (function(){
      // ★ Round 115 重写这条判据（取代原「全仓逐行扫描」版）：
      //   原版对每个目标文件**逐行**找「N 条修正」，靠「含 Round/日期 且 含历史措辞」来跳过历史引用。
      //   实测它有**原理上修不好的假阳性**：描述历史的句子（「Round 114 审计了 33 条修正」）不含历史措辞关键词，
      //   而真·声明句也可能恰好含 Round ⇒ 两个方向都错。实测一次报出 6 处全为假阳性。
      //   ⇒ 改为**正向列举**：只检查「确实在声明当前条数」的那几个位置（模式固定、可枚举）。
      //   ⇒ 与「四处一致」那条检查互补：那条比对完整版/README 的**同一句措辞**，这条覆盖另外的声明形态。
      try {
        const fs2 = require('fs'), p = require('path');
        const meth = fs2.readFileSync(p.join(W, 'playbook', '99-methodology.md'), 'utf8');
        const found = meth.match(/^## [一二三四五六七八九十]+、[^\n]*修正([一二三四五六七八九十]+)/gm) || [];
        const n = found.length;
        // 声明点清单（每条 = 文件名 + 一个必须与真值一致的正则，捕获组 1 是数字）
        const SITES = [
          ['README-从这里开始.md', /\*\*(\d+) 条修正精要\*\*/],
          ['README.md', /\|\s*方法论\s*\|\s*\*\*(\d+) 条修正\*\*/],
          ['一页速查.md', /^## (\d+) 条修正精要/m],
          ['检查清单.cjs', /的 (\d+) 条修正 \+ 统合节/],
        ];
        const bad = [];
        for (const [f, re] of SITES) {
          const s = fs2.readFileSync(p.join(W, f), 'utf8');
          const m = s.match(re);
          if (!m) bad.push(f + ' 找不到声明点');
          else if (+m[1] !== n) bad.push(f + ' 声明 ' + m[1]);
        }
        // ★ 表行数 vs 标题条数（修正三十四的判据）
        const qs = fs2.readFileSync(p.join(W, '一页速查.md'), 'utf8');
        const hdr = qs.match(/^## (\d+) 条修正精要/m);
        const rows = (qs.match(/^\|\s*\d+\s*\|/gm) || []).length;
        if (hdr && +hdr[1] !== rows) bad.push('一页速查表：标题 ' + hdr[1] + ' 条 vs 实际 ' + rows + ' 行');
        if (bad.length) { console.log('        （真值 ' + n + '；' + bad.length + ' 处：' + bad.join(' / ') + '）'); return false; }
        return true;
      } catch (e) { return false; }
    })());
  ck('★ _manifest.json 与实际目录一致', (function(){try{
      const fs2=require('fs'),p2=require('path');
      const man=JSON.parse(fs2.readFileSync(W+'/_manifest.json','utf8'));
      const real=fs2.readdirSync(W).filter(f=>!f.startsWith('_')&&(f.endsWith('.md')||f.endsWith('.cjs')));
      if(man.count!==real.length){console.log('        （清单 ' + man.count + ' 份，实际 ' + real.length + ' 份）');return false;}
      return real.every(f=>man.deliverables.some(d=>d.f===f));
    }catch(e){return false}})());
  ck('★ README-从这里开始 的交付物清单与真值一致', (function(){try{
      const fs2=require('fs');
      const man=JSON.parse(fs2.readFileSync(W+'/_manifest.json','utf8'));
      const r2=fs2.readFileSync(W+'/README-从这里开始.md','utf8');
      if(!r2.includes('交付物清单（机器可数 · '+man.count+' 份）')){console.log('        （README 清单数 ≠ ' + man.count + '）');return false;}
      return true;
    }catch(e){return false}})());
  ck('★ 11 维度都有「★ 实测」节 + 四标签图例', (function(){
    try {
      const fs2=require('fs'), p2=require('path');
      const dir=p2.join(W,'research');
      // ★ Round 134：判定「维度文件」必须与生成器用【同一个定义】。
      //   生成器 _build-full.cjs L29 用 /^\d{2}-/ 且 .md 结尾；
      //   本检查原写 f.endsWith('.md') ⇒ 拆分后把 04b-取材台账.md 也算成维度 ⇒ 数出 12 个而失败。
      //   ⇒ 修法是「与生成器对齐定义」，不是「放宽标准」。
      const files=fs2.readdirSync(dir).filter(f=>/^\d{2}-/.test(f)&&f.endsWith('.md'));
      if(files.length!==11){console.log('        （维度文件 '+files.length+' 个，应为 11）');return false;}
      const bad=[];
      for(const f of files){
        const s=fs2.readFileSync(p2.join(dir,f),'utf8');
        if(!/★+ 实测/.test(s)) bad.push(f+'(缺实测节)');
        if(!s.includes('数字来源图例（本维度所有具体数字')) bad.push(f+'(缺图例)');
      }
      if(bad.length){console.log('        （'+bad.join(' , ')+'）');return false;}
      return true;
    } catch(e){return false}
  })());
  ck('★ 可执行检查清单存在且非空', (function(){try{const s2=require('fs').readFileSync(W+'/检查清单.cjs','utf8');return s2.length>5000 && s2.includes('修正十九') && s2.includes('硬门')}catch(e){return false}})());
  ck('完整版含方法论修正十三', full.includes('修正十三'));
  ck('方法论含「哪一类可行」先验表', full.includes('欧美 OA 刊'));
  ck('完整版含方法论修正十二', full.includes('修正十二'));
  ck('第一周清单含「定论文类型」', (rd(W+'/第一周动作清单.md')||'').includes('定论文类型'));
  ck('核实清单含第三本刊（Frontiers）核实', full.includes('Frontiers in Materials'));
  ck('核实清单含 300 dpi 真值', full.includes('300 dpi'));
  ck('核实清单含字数统计口径', full.includes('字数统计口径'));
  ck('核实清单含跨地域对照结果', full.includes('跨地域对照结果'));
  ck('核实清单含欧美刊受阻记录', full.includes('欧美刊核实受阻'));
  ck('核实清单含「不可代做」标注', full.includes('不可代做'));
  ck('核实清单含第二本刊（ISIJ）核实', full.includes('ISIJ International'));
  ck('核实清单含「类型提交后不可改」警示', full.includes('article type cannot be changed')||full.includes('论文类型提交后不可更改'));
  ck('核实清单含跨刊对照表', full.includes('跨刊对照'));
  ck('核实清单含论文类型全表（6 类）', full.includes('Rapid Publication')&&full.includes('Opinion'));
  ck('核实清单含印刷页≠字数的警示', full.includes('印刷页 ≠ 字数'));
  ck('核实清单含图件格式清单', full.includes('TIFF')&&full.includes('字体必须嵌入'));
ck('核实清单说明了 PDF 提取方法与缺陷', full.includes('zlib')&&full.includes('字距'));
// 各维度文件是否都有指针
const names=['topic-selection','framework','structure','databases','references','content','abstract','writing-style','dedup-and-ai-rate','statistics','image-integrity'];
let pn=0; for(let i=0;i<11;i++){ const p=W+'/research/'+String(i+1).padStart(2,'0')+'-'+names[i]+'.md'; const s=rd(p)||''; if(s.includes('【两线差异索引】')) pn++; }
ck('11 个维度文件都有两线索引指针', pn===11, pn+'/11');

// ★ Round 131 · 修正四十三：编号【连续性】之外还必须查【唯一性】。
// 理由：一次「降序 while 重编号」把 5 节级联压成同一个号，
//      而当时所有既有判据全绿 —— 因为它们只问「有没有洞」，不问「有没有重复」。
let dupFiles=[], secCount=0;
for(const f of fs.readdirSync(W+'/research').sort()){
  const nums=(rd(W+'/research/'+f)||'').split('\n').filter(l=>/^## \d+\.\d+/.test(l)).map(l=>l.match(/^## (\d+\.\d+)/)[1]);
  secCount+=nums.length;
  const seen={}, dups=[];
  for(const n of nums){ if(seen[n]) dups.push(n); seen[n]=1; }
  if(dups.length) dupFiles.push(f+':'+dups.join(','));
}
ck('11 个维度无重复编号（修正四十三）', dupFiles.length===0, dupFiles.length?dupFiles.join(' | '):secCount+' 个编号节全部唯一');


// ═══ ★ Round 133 对抗审查后新增的两道门 ═══
// 门一（修正四十八）：版本行的方法论条数必须等于方法论实际条数。
//   背景：版本行原写「10 条」，实际已 45 条 —— 主交付物第 4 行差 4.5 倍，
//   而项目自己有修正三十四专治「手写计数会漂」，却没给这一处加检查。
(function(){
  const methTxt = rd(W+'/playbook/99-methodology.md') || '';
  const actual = (methTxt.match(/^## [一二三四五六七八九十]+、[^\n]*修正[一二三四五六七八九十]+/gm) || []).length;
  const hdrTxt = rd(W+'/playbook/00-header.md') || '';
  const mh = hdrTxt.match(/(\d+) 条方法论修正/);
  const declared = mh ? +mh[1] : -1;
  ck('版本行条数 = 方法论实际条数（修正四十八）', declared === actual, '声明 ' + declared + ' / 实际 ' + actual);
})();
// 门二（修正四十八）：README 的维度进度表必须与源文件字节数一致（防状态表漂移）。
//   背景：README 进度表曾停在 Round 04，把四个已写完的维度标成「待写」、规模低估 24 倍。
(function(){
  const rTxt = rd(W+'/README.md') || '';
  const dims = [['01-topic-selection'],['02-framework'],['03-structure'],['04-databases'],['05-references'],['06-content'],['07-abstract'],['08-writing-style'],['09-dedup-and-ai-rate'],['10-statistics'],['11-image-integrity']];
  let stale = 0, checked = 0;
  for (const [d] of dims) {
    const p = W+'/research/'+d+'.md';
    if (!fs.existsSync(p)) continue;
    const sz = fs.statSync(p).size;
    if (rTxt.indexOf('| `'+d+'.md` | '+sz+' |') < 0) stale++;
    checked++;
  }
  ck('README 维度进度表与源文件一致（修正四十八）', stale === 0, checked + ' 个维度，失配 ' + stale + ' 个');
})();

console.log('');
console.log(fail? '❌ 有 '+fail+' 项未通过' : '✅ 全部通过');
process.exit(fail?1:0);