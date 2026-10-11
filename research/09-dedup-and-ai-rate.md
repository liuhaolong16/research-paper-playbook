# 维度 09 · 降重与降 AI 率

> **状态**：v0.1（Round 04，Lead 亲撰）
> **目标学科假设**：材料 / 冶金（待用户确认）
> **★ 本维度的总原则（先读这一条）**：
> **「降 AI 率」不是写作方案的一个步骤，而是写作方案的【结果】。**
> **文本写实了（有本数据、有具体参数、有推理链），AI 痕迹自然低；**
> **反之，用改写工具对抗检测器，是拿学术诚信赌一个随时会失灵的判别器。**
> 本维度因此**分两半写**：合规的一半（要做）+ 红线的一半（绝不做）。

---


> **数字来源图例（本维度所有具体数字都应带这四个标签之一）**
> **【已核实】** ＝ 有官方文件/实测数据支撑，可直接当标准用；
> **【作者判断】** ＝ 本方案的建议值，**可以改**，别当硬标准；
> **【须查证】** ＝ 本方案不确定，**动笔前必须自己查目标刊/本校文件**；
> **【逻辑必然】** ＝ 由定义或推理直接得出，不需要外部来源。
> **★ 未带任何标签的数字 ⇒ 默认视为【作者判断】。**

## 一、先分清三种「检测」—— 原理不同，对策完全不同

| 检测 | 在查什么 | 误伤风险 | 对策性质 |
| --- | --- | --- | --- |
| **文字复制比（查重）** | 与既有文献的**字面重合** | 中（方法/定义句必然重合） | 改写 + 规范引用 |
| **AI 生成检测** | 文本的**统计特征**（如困惑度、突发性） | **高**（非母语写作、模板化写作都会被误判） | **只能靠写实，不能靠改写** |
| **自我抄袭 / 重复发表** | 与自己前作的**实质重复** | 低（但后果重） | 引用自己的前作并说明 |

**★ 关键认识**：**AI 检测判的是「统计特征像不像人写的」，不是「是不是 AI 写的」。**
**⇒ 因此它必然有误判率** —— 一个英语非母语、句式规整、术语密集的真人作者，完全可能被判高 AI 率。
**⇒ 而且判别器在持续更新** —— 今天有效的「反检测技巧」，明天可能变成可疑特征。**把方案建立在它上面，等于把毕业/投稿押在一个会漂移的靶子上。**

## 二、查重（文字复制比）的合规降重

### 原理层面要知道的
- 查重系统做的是**字面比对**（连续字符串匹配 + 相似度算法），**不做语义判断**
- **方法节、仪器名称、标准术语、公式定义** 这类表述天然高度重合 —— **这部分重合不构成抄袭，但要靠规范引用与句式转换处理**
- **不同系统的库不同、算法不同**，同一篇文章在 A 系统 8%、B 系统 20% 是正常的（**具体系统的库与算法细节未核实**）

### 合规降重的六种手法（按优先级）

1. **先判断这句该不该引用** —— 有出处就给引用，比改写更正当
2. **改结构而非改词** —— 把「A 导致 B，因为 C」改成「在 C 条件下观察到 A 与 B 的关联」；**词换了但结构没换，属于低效降重**
3. **具体化** —— 用你自己的数据替换泛化陈述（「强度提升约 20%（本文实测 n=3）」比「强度显著提升」既降重又更学术）
4. **图表化** —— 能用表说清的参数、能用图说清的趋势，不必用长段落描述
5. **合并与拆分** —— 把三句合成一句、或把长句拆成两句，改变的是匹配窗口
6. **中译英再转写（仅当目标语言是英文时）** —— 这是正当的跨语言表述差异，**不是把别人的中文翻成英文当自己的**（那仍是抄袭）

## 三、AI 检测的合规做法（★ 这一节是全维度的重点）

### 为什么「对检测器优化」这条路走不通

1. **判别器会漂移** —— 你优化的特征，可能正是下一版判别器抓的
2. **优化痕迹本身可疑** —— 为降 AI 率而做的大量同义替换，会制造出**不自然的冗余与失真**，反而更容易被人类审稿人注意到（**这与「查重降重过度」是同一种病**）
3. **它把手段当目的** —— 一篇 AI 率高但数据扎实的稿子，问题在「表述不像人在思考」；而**改写不改思考**
4. **合规红线** —— 见第四节

### ★ 合规路径：让文本自然「像人写的」的七个动作

**这七个动作不是为了绕过检测器，而是它们恰好是好的学术写作本身。**

| # | 动作 | 为什么它同时降低 AI 痕迹 |
| --- | --- | --- |
| 1 | **写进本工作的具体数字与条件** | 泛化陈述是 AI 文本的标志；**具体值是人的痕迹** |
| 2 | **写进实验过程中的真实决策** | 「为什么选 850℃ 而不是 800℃」这类取舍，AI 编不出来 |
| 3 | **写进反常与失败** | 「某样品出现异常，复核后排除」——**真人数据必然有这类内容** |
| 4 | **保留适度的句式不齐** | 人的写作句长天然波动；**全篇均匀句长是判别器最看重的特征之一** |
| 5 | **用本领域的行话与缩写** | 术语密度与使用习惯是领域内人的标志 |
| 6 | **写出你的不确定** | 「该机制尚需进一步验证」是学术常态，而 AI 倾向给确定结论 |
| 7 | **自己写引言与讨论的核心段** | 这两节最体现思考；**其他部分可以借助工具，核心论证必须自己下笔** |

**⇒ 一句话**：**把「我做了什么、为什么这样做、结果是什么、我不确定什么」写清楚，AI 率自然下来。**
**这七个动作全部指向同一件事：增加【可验证的具体性】。**

## 四、★ 红线（绝对不做）

| 红线 | 为什么 |
| --- | --- |
| **不把 AI 生成内容直接当学业成果提交** | **已有高校明文禁止**（见参考依据）—— 这不是检测技术问题，是诚信问题 |
| **不使用「反 AI 检测」工具做对抗性改写** | 属于以欺骗检测为目的的改写；一旦被认定，性质等同伪造 |
| **不伪造数据、不修饰图像以通过审查** | 数据与图像的造假是撤稿级事件，比 AI 率高危险得多 |
| **不隐瞒工具使用** | 若学校/期刊要求声明 AI 使用，**如实声明**；多数机构允许辅助翻译/润色，禁止代写 |
| **不用「降重工具」批量改写别人论文的句子当自己的** | 查重降低 ≠ 没有抄袭；**这是最容易被误认为已合规的陷阱** |

**⇒ 判断标准很简单**：**这个动作如果被导师/审稿人知道了，你是否愿意解释？** 不愿解释的，就不做。

## 五、自检清单（交稿前逐条过）

> **★ Round 176 别名（**验收判据**）**：**★ 其余 10 个维度的对应节都叫「**验收判据**」**，**本维度历史上叫「**自检清单**」**** ⇒ **为让按维度检索的人**不扑空**，**此处并列两个名字**（**不改原标题，以免打断「五、」的编号**）**。**
> **⇒ **★ 同名视图**：**跨 11 维的**汇总版**见 [`投稿前总检查表.md`](../投稿前总检查表.md)**（**由脚本机械抽取，共 107 条**）** —— **本维度在其中贡献 8 条**。**

> **★★★ 判据质量十七条（跨维度通用 · Round 138 补 · 每条都来自本方案自己的踩坑）**
> **⇒ 为什么插在这里**：**对抗审查者（Round 133）用机械探测查出 —— 有 8 条**关于判据本身质量**的修正，**在 11 个维度里零命中**** ⇒ **读者按维度执行时看不到它们，方法论成了只被作者阅读的层。** **⇒ 现把它们收回维度内。**
> **⇒ 用法定级**：**下面八条是**判据的判据** —— 你自己写验收项、设阈值、做检查清单时，**先过这八条**。**

| # | **规则** | **一句话用法** |
| --- | --- | --- |
| **1** | **只有反例的清单会失去区分力**（修正二） | **清单里既要有反例也要有正例** —— 全是「不要怎样」，读者无法判断「做对了是什么样」 |
| **2** | **判据必须「范式感知」**（修正二十） | **每条判据声明适用范式**（例：理论 / 计算类不适用「报 n」） |
| **3** | **判据必须「平台感知」**（修正二十一） | **阈值须注明在哪些平台验证过** —— 同一判据在不同出版平台可能给出**相反**结论 |
| **4** | **判据要「可检出率」感知**（修正二十二） | **≈100% 才能做「缺一即不合格」的门槛；70–99% 只能做提示；<70% 不可用** |
| **5** | **阈值太松 = 没有区分力**（修正十七） | **一个永远合格的阈值不产生信息**；且**阈值必须绑定可执行动作**，只给数字不给动作等于无效 |
| **6** | **从不改变决定的判据，不该当闸门**（修正二十九） | **自检**：**这条判据**有没有可能判出「不合格」**？**从来没有 ⇒ 它只是仪式，删掉或降为提示 |
| **7** | **会「误报」的闸门，与会「漏报」的一样有害**（修正四十七） | **凡闸门须用**两侧样本**验**（一组已知合格 + 一组已知不合格）；**阈值与工具绑定 ⇒ 换工具必须同期重标定** |
| **8** | **验收判据要与「失败形态」配对**（修正四十六） | **判别式**：**第二个人**不看你的稿**，能不能说出「什么算不合格」**？**不能 ⇒ 这条判据还没写完** |

| **9** | **「端到端干跑」是一种独立的验证手段**（修正二十七） | **每个交付物至少真跑一遍全流程** —— **查静态文本不算**；**干跑会发现只看文本看不出的问题**（页面溢出、脚本报错、字段对不上） |
| **10** | **检查器对「被检查的」与「当参照的」用了不同规则**（修正三十三） | **你把 X 和 Y 对比时，**X 与 Y 是否按同一规则被处理**？**不同 ⇒ 结论无效**（本方案实测过：同一个数与两个不同基准比，得出相反结论） |
| **11** | **一次反向测试只能证明「它能报错」，不能证明「它的判据足够严」**（修正五十三） | **做**分级反向测试**：轻度削弱（删一个实例）与重度削弱（删整块）**都试**；**若轻度削弱下仍通过 ⇒ 说明它只要求「存在」不要求「普遍」**** ⇒ **要明确写出这门在防什么** |
| **12** | **「缺失断言」必须指明它相对于哪个输出流**（修正五十四） | **空流会让一切「没找到 X」的断言通过** ⇒ **正负锚必须取自**同一输出流****；**★ 并**保留选错的锚**，以区分「判据报警」与「锚选错了」** |
| **13** | **先证明指标测的是「被测对象」还是「测量链上的某一环」**（修正五十五） | **看**峰的位置****：**若 53% 的值挤在某个宽度上，而那个宽度是**上游工具的**参数**（如提取器的换行宽度）⇒ **你测的是上游**；**小 n（<30）不要用 CV，直接看直方图形状** |
| **14** | **「唯一来源」与「独立检验」在同一进程内不可兼得**（修正五十六） | **唯一来源 ⇒ 自检**恒过**（修正四十三）；**独立构造 ⇒ 必须复制 ⇒ 会漂移**（修正四十九）** ⇒ **三条出路**：①接受「非独立但**会失败**」的自检（只测内存以外的对象，如磁盘回读）；②**把独立检验移到另一次运行 / 另一个进程**（**这才是正解**）；③若必须同进程独立，**让第二个实现尽量小** |
> **★★★ **正向形式通则（Round 143 补，采纳自同行 月流）**：**凡验收项写的是**否定式**（「不得出现 X」「避免 Y」），**在它旁边写一行 `✓ 正向：<可观察的合格状态>`**。**⇒ 理由（同行原话）**：**「没有正向形式的准入条件只是又一次『我不想要坏的』，但不知道什么是好的。」** **⇒ ★ 本项目实测**：**十一维度 87 个验收项里，纯否定式只有 **3 条（3.4%）**** —— **本项目的验收项**绝大多数本来就是正向可观察的****（**这正是此前几轮「把验收判据写实」累积的结果**）。**⇒ 所以本通则**不是**要去批量改写，而是**给以后新写的验收项立个格式**：**写成否定式时，顺手补正向等价。**

| **15** | **采纳外部建议前，先核它的「前提」在本项目是否成立**（修正五十七） | **把建议翻译成一个可普查的判据**（如「含否定词的验收项占比」），**先量一遍再决定改不改**；**★ 量出来远低于建议者假设 ⇒ 处置定为「立格式」而不是「批量修」**；**★ 普查脚本本身要先自证**（实测：初版把「别人」当否定词，差点去「修」一条本来正确的条目） |
| **16** | **查重工具自身的漏检率，就是「重复」这件事的真实概率**（修正五十八） | **查重说「无匹配」只等于「按你给的那几个词没找到」**，**不等于「没有重复」** ⇒ **判据**：① **查重结果必须与「库里总条数」一起读**（**工具说「无匹配（共 N 条）」时，真问题是「N 条里我为什么确信都不相关」**）；② **★ 补救：未命中时再看一遍全量清单**（**成本几十行，收益是避免一次同题并存**）；③ **★ 判「同题」看**意图**不看**措辞****；④ **发现同题后不要删** —— **加 `superseded` 标记指向后继，并**保留旧条仍成立的部分** |
| **17** | **编辑「被程序消费的源文件」前，先确认它的**边界约定****（修正五十九） | **「内容对不对」与「它会不会被读到」是两个独立问题** ⇒ 判据：① **动手前先问这个文件里有没有「程序看的标记」，边界是哪一侧**；② **★「挪到末尾」是危险默认动作** —— **在有边界约定的文件里，末尾恰恰可能是被切掉的那一侧**；③ **★ 每次「看起来等价」的重写都可能**复制不该复制的东西**** ⇒ **切分时先定位标记、明确「标记只留一份且放最后」，不要按语义描述切** |
> **★★ 一条更高层的（它管的是**你做检查这件事本身**）：**
> **⇒ **机械检查的红灯与绿灯都必须交叉确认**（修正十四）** —— **绿灯也要用另一条独立路径复核**，**因为「全部通过」可能只说明检查本身失效**（本方案实测过两次：一次是检查只问「有没有缺口」不问「有没有重复」，一次是流水线被截断后仍打印成功）。**
> **⇒ **判别式**：**你的这套检查，**有没有可能「全部通过」而实际有问题**？**答不出来 ⇒ 它还没被验证过。****

- [ ] 已用**学校/目标刊指定的**系统查过（不同系统结果不同，**不要用第三方免费工具的分数自我安慰**）
  - **✓ 正向：报告里写明了「用的哪个系统 + 哪个版本 + 查重日期 + 复制比数值 + 该系统的判定口径」，且与本校/本刊文件要求的系统**逐字一致****
- [ ] 高重复段落**逐段确认**：是「该引用的」还是「该改写的」—— 引用优先
- [ ] **方法节与仪器描述**里的重合已用规范引用 + 句式转换处理
- [ ] 全文已检查**是否出现「本文首次/显著提高/填补空白」等 overclaim 句式**（与维度 08 的禁用词表联动）
- [ ] 每个结论**都能在正文定位到对应数据**
- [ ] 引言与讨论的**核心论证段是自己写的**（不是工具产出后小改）
- [ ] 若机构要求**声明 AI 使用**，已如实声明
- [ ] **没有使用任何以「规避检测」为目的的工具**

## 六、两条线差异

| | 毕业答辩论文 | SCI 论文 |
| --- | --- | --- |
| 查重系统 | 学校指定（通常有明确合格线） | 期刊用 iThenticate/CrossCheck 类系统 |
| 合格线 | 学校规定（**各校不同，须现查**） | 期刊规定（**通常要求单篇 <1%、总比 <10–20%，须现查**） |
| AI 检测 | 学校可能查（**是否查、标准如何，各校不同**） | 期刊普遍要求声明 AI 使用；**部分期刊直接送检** |
| 自我抄袭风险 | 学位论文与已发表小论文的重复**是常见雷区** | 与前作重复需明确引用并说明增量 |
| 应对重点 | **规范引用 + 自己写核心段** | **数据可复现 + 声明合规 + 图像真实** |

## 七、参考依据（Round 04 检索）

- **清华发布人工智能教育应用指导原则：严禁将 AI 生成内容直接用作学业成果** —— [中国教育在线报道](https://www.eol.cn:10443/news/dongtai/202511/t20251128_2704348.shtml)、[哲学社会科学科研诚信网](http://index.cassrio.cn/cxdt/cxyw/202512/t20251218_5960665.shtml)
  - **这是本维度最硬的合规依据：头部高校已明文禁止「AI 生成内容直接当学业成果」。**
- **IEEE · Identification of AI Generated Text using Perplexity and Burstiness** —— [链接](https://xplorestaging.ieee.org/document/11603133)
  - 说明主流检测思路：困惑度（perplexity）与突发性（burstiness）。**⇒ 这正是「全篇均匀句长会被判 AI」的技术原因。**
- 从同义词替换到语义重构：AI 论文降重的技术演进 —— [腾讯云开发者社区](https://cloud.tencent.com.cn/developer/article/2699199)
  - **仅作技术参考**：了解降重工具在做什么，**不代表本方案推荐使用**。
- 学位论文检测部分问题解答（某高校） —— [链接](https://zfxy.cnu.edu.cn/docs/2016-03/3b86d16d0682400a9b97886566f9b6ad.docx)
  - 学校侧对查重口径的解释样本。

## 未核实 / 待用户补充

> **★★★ Round 125 重写本节**。**原文（留痕）**：「本方案**不编造具体数字**，须以用户本校研究生院文件为准 / 各刊不同，须逐刊查 Author Guidelines / 不引用具体准确率数字」。
> **⇒ 为什么重写**：**那三行**已经过期** —— Round 117–122 已把其中两项**填进了可核实的数字**（**3 个机构 / 2 个体系**的查重合格线 + **5 个来源**的 AI 声明口径），而本节仍在说「没有数字」。
> **⇒ 这属于本项目反复抓到的「**声明与事实不符**」一类**（与**修正三十四「计数声明必须机器对账」**同族）—— **留着过期声明比没有声明更坏：它会让读者以为要去别处找，而其实下面已经有了。**

### 一、★ 已经填上的（**含证据边界，勿越界引用**）

| 原来缺什么 | 现在有什么 | 证据边界（**必须一起读**） |
| --- | --- | --- |
| **各校查重合格线** | **★ 3 个独立来源 / 2 个体系**：**≤20% 通过 · 20–30% 修改复检 · >30% 不受理**（遵义医科大）· **<10% 才送审**（中科院昆明动物所）· **指标名与免责清单**（辽宁科大/东北师大） | **★ 数字**逐机构不同**，且差异可达一倍** ⇒ **10% 与 20% 都不是通用线**。见 §9.18 · §9.20 |
| **查重指标的口径** | **★ 术语「去除本人已发表文献复制比」** —— **4 个来源都用它**（含 1 份副本） | **★ 术语**可能统一**，参数**绝不统一**（§9.20 结论） |
| **免责清单** | **2 份不重合的清单**（一份含封面/目录/授权书/脚注；另一份含注释/附录/致谢） | **★ 逐校不同，不许跨校套用**（§9.18 第四节有硬证据） |
| **AI 检测与声明政策** | **★ 5 个独立来源**：COPE 系 · AIP · Elsevier（公告 + 完整政策页 + 官方声明模板）· Springer Nature（**风险分级模型**）· 一份 2026 同行评议研究 | **★ 四家对「语言润色要不要声明」给出**四个不同答案**（COPE 要 / AIP 不要 / Elsevier 仅拼写语法标点豁免 / Springer Nature 低风险但仍要）⇒ **必须逐刊核**（§9.11–§9.14 · §9.x） |
| **学位论文复用是否算重复** | **★ 两条线**都允许**：答辩线有单独指标；SCI 线**Elsevier 明文把「作为学位论文发表」排除在 prior publication 之外**** | **★ 但都不允许「不说」** —— 两条线的共同动作是**写清来源**（§9.19） |

### 二、★ 仍然必须**用户本人**去查的（**本方案不能代查，因为它是「你那一本」的事**）

| # | 要查什么 | 去哪查 | 判据 |
| --- | --- | --- | --- |
| **1** | **本校本所的**查重合格线**与**免责清单**** | 研究生院**学位工作**页（**搜「去除本人已发表文献复制比」命中率高**） | **★ 抄下**逐项清单**，不许用本节任何数字代替** |
| **2** | **本校本所的**上传形态**（全文 vs 只含正文）与**上限度量**（字符数 vs 文件大小）** | 同一页 | **实测两份要求相反** ⇒ 传错会退回 |
| **3** | **本校本所的**去标识要求**（XXX / □□□+学号 / 是否含「在学期间成果清单」）** | 送审或盲审通知 | **实测至少两种写法** |
| **4** | **本校本所的**查重时机**（评阅前 / 答辩前）与**不合格后果**（延期 / 终止 / 退学）** | 管理办法类文件 | **实测三种后果** ⇒ 决定排期 |
| **5** | **目标 SCI 刊的 AI 声明条款** | 该刊 Author Guidelines（**不要只查出版社**） | **★ Elsevier 自己声明 Cell Press / The Lancet / 部分学会刊**政策不同** |
| **6** | **目标 SCI 刊的 prior-publication 条款** | 同上 | **确认「学位论文版本」是否被明确排除** |

### 三、★ **有意不填**的（**并说明为什么**）

| 项 | 为什么不填 |
| --- | --- |
| **AI 判别器的具体准确率** | **该领域论文结论分歧大**，引用任一数字都会**误导读者以为有可信阈值**。**⇒ 本方案的做法是**不依赖判别器分数**，只做**可核查的文本特征**（句长方差 · 连接词密度 · 可检出率），见 §9.10 与修正二十二 |

**⇒ ★ 一句话总结本节**：**查重线与 AI 口径**已经不是空白**（有 3+5 个来源）；**空白转移到了「你那一本/那一刊的条款」** —— 而那**只能你查**，本方案能做的是**把该查的六项列成表，并告诉你查出来之后怎么用。**


## 可数清单（Round 40 补）

> **为什么补这一节**：两次成熟度审计都显示本维度**示例 0 处、可数清单 0 处**（本维度已有 8 项验收，但缺可数量化）。
> **⇒ 「降重做得好」无法验证；能验证的是「改了多少处、禁改项零漂移、重复率记录」。**

### 改写工作的 5 项可数记录（写在 `改写记录.md`）

| # | 记录项 | 数法 |
| --- | --- | --- |
| 1 | **改写的段落数** | 逐条列出（**若为 0 ⇒ 本轮没做改写，是检查不是改进**） |
| 2 | **改写的类型** | 结构重排 / 具体化 / 拆分句 / 合并句 —— **各多少处** |
| 3 | **六类禁改项漂移数** | 数值 · 单位 · 化学式 · 牌号 · 公式 · 结论方向 ⇒ **漂移数必须 = 0** |
| 4 | **重复率记录** | 系统名 + 日期 + 数值（**不得自验时如实写「不可自验」**） |
| 5 | **AI 使用声明状态** | 【SCI】已声明 / 未声明（**未声明 = 高风险**） |

### 三类可自动化检查（优先做，因为它们不需要人读全文）

| # | 检查 | 操作 |
| --- | --- | --- |
| 1 | **六类禁改项零漂移** | 用脚本比对前一版与终版：抽取全部数值/单位/牌号/公式，**逐项比对差异**（差异数须 = 0） |
| 2 | **改写量** | **【已删除「相似度阈值」判据（Round 80 红队第 11 条）】** 阈值 0.8 **无来源、无算法定义**，且与下方「数字/条件数是否上升」**互斥**（换词可压低相似度但数字不变）。**统一判据：改写后该段落里【数字与具体条件的数量】是否上升** |
| 3 | **AI 痕迹的机械特征** | 统计**句长方差**与**连接词密度**（AI 文本常句长均匀、连接词密集） |

### 例 · 六类禁改项比对的实际输出（示意）

```
比对 初稿.md vs 终稿.md
  数值类   : 抽取 147 个，差异 0  ✅
  单位类   : 抽取  89 个，差异 0  ✅
  化学式类 : 抽取  12 个，差异 0  ✅
  牌号类   : 抽取   8 个，差异 0  ✅
  公式类   : 抽取   6 个，差异 0  ✅
  结论方向 : 人工核对 4 条结论句，方向一致  ✅
⇒ 零漂移确认
```

**⇒ 这份输出本身就是「改写没改坏东西」的证据 —— 比任何「我核对过了」的声明都强。**

### 一条重要区分（可数判据）

| 动作 | 产生了什么 | 算不算改进 |
| --- | --- | --- |
| **同义替换**（改词不改结构） | 相似度下降，**但数字/条件数不变** | **不算**（Round 19 已实证：可被逐字复制满足） |
| **结构重排 + 具体化**（真的把内容写实） | 相似度下降 **且** **数字/条件数上升** | **算** |

**⇒ 判据：改写后段落里的「数字/具体条件」数量是否上升。上升才算真改写。**

---

## 9.10 ★ 实测：为什么「同义替换」不算改进（Round 79 补）

> **为什么补这一节**：**本维度有「同义替换不算改进」这条规定，但没给「为什么」和「怎么判」。**

### 规定背后的机制

**AI 检测器看的是**文本的统计特征**（困惑度 / 突发性 / 词汇分布的规整程度），不是**词面**。**

| 改写方式 | 会不会改变检测器读到的特征 | 判断 |
| --- | --- | --- |
| **同义词替换**（改词不改结构） | **几乎不变** —— 句子结构、长度分布、连接词习惯全保留 | **不算改进** |
| **语序调整**（把状语提前） | 变化很小 | **基本不算** |
| **★ 结构重排 + 具体化**（拆句/合并、把「显著提高」换成「提高 45%（412 vs 284 HV）」） | **明显改变** —— 句长分布变了、词汇从通用变专用 | **算改进** |

### ★ 可执行判据（本项目自用，一行就能判）

> **判据：改写后，该段落里【数字与具体条件的数量】是否上升？**
> **上升 ⇒ 是实质改写；不变或下降 ⇒ 只是换词，不算改进。**

**例：**

| 改前 | 改后 | 数字/条件数 | 判定 |
| --- | --- | --- | --- |
| 「时效处理显著提高了合金的硬度」 | 「时效处理后硬度有所提升」 | 0 → 0 | **不算**（同义替换） |
| 「时效处理显著提高了合金的硬度」 | **「175 ℃/8 h 时效后，硬度由固溶态的 284 HV 升至 412 HV（+45%）」** | 0 → **4** | **算**（具体化） |

### ★ 为什么这条判据「一箭双雕」

**① 它同时是**降重**的判据**（具体化的表达天然与原文不同）；
**② 它也是**降 AI 率**的判据** —— **因为具体化会改变句长分布与词汇分布，而这正是检测器读的东西**；
**③ 更重要的是：它指向的动作（补真实数据、写清条件）**在学术上是本来就该做的事** —— 不涉及对抗检测器。**

### ⚠ 合规红线（重述，不可越过）

**本维度的「降 AI 率」**指的是**把文本写实**，不是**针对检测器做对抗性改写**。**
**⇒ 红线：不用反 AI 检测工具反复试探；不伪造数据；不隐瞒工具使用；不批量改写他人论文。**
**⇒ 理由（本方案的判断）：用改写工具对抗检测器，是拿学术诚信赌一个随时会失灵的判别器 —— 判别器换代时，你押的是自己。**

**⇒ 出处**：`../playbook/99-methodology.md` 维度 09 的合规部分。

---

## 9.11 ★ 外部权威：AI 使用披露怎么写（COPE 立场 + 一份完整政策原文）

> **来源**：**COPE（Committee on Publication Ethics）立场声明 `Authorship and AI`**（DOI `10.24318/cCVRZBms`，© 2024 COPE，CC BY-NC-ND 4.0）；
> **以及一份逐字对齐 COPE 的期刊 AI Use Policy**（[*Review of International American Studies*, University of Silesia Press](https://journals.us.edu.pl/index.php/RIAS/AI-USE)，实抓于 2026-10-08）。
> **本节的定位**：**§9.10 讲「为什么降 AI 率的正确做法是写实」；本节讲「用了 AI 之后**怎么合规地披露**」—— 这是本维度此前缺的一块。**
> **★★ 越过了本节的读者，建议先看 §9.15**（**一页对照：投稿前只查这一张**）—— 它把本节到 §9.x 六节压成一张「你投哪家 → 读哪几节 / 门槛 / 位置 / 图像」的表。**

### ★★ COPE 的核心立场（三条 —— **⚠ 转引，引用前须核对原文**）

| # | 立场 | 原文要点 |
| --- | --- | --- |
| **1** | **AI 工具不能署名为作者或共同作者** | **「AI tools cannot be credited as authors or co-authors」** —— 理由：它们无法满足作者身份的核心标准（**责任 / 问责 / 智识能动性**）。**COPE 与 WAME、JAMA Network 立场一致。**【**须查证**：这句「与 WAME、JAMA 一致」来自该政策的**转述**，**本节未核 WAME 与 JAMA 的原文件**】 |
| **2** | **必须披露，且要说明**怎么用的** | **「Transparency regarding the use of AI tools is required, including a brief description of how they were used」** —— 例：语言润色 / 文体编辑 / 结构调整。 |
| **3** | **全部责任在人类作者** | **「Full responsibility for the content, accuracy, originality, and integrity of the manuscript rests exclusively with the human author(s)」** |

### ★★★ 一条对本方案极其重要的外部印证

**该政策明文写道：**

> **期刊**不依赖 AI 检测软件**作为编辑或同行评审决策的**决定性证据**；
> **「Such tools are not considered sufficiently reliable to distinguish between AI-assisted editing and original scholarly writing.」**
> **（这类工具**不够可靠**，无法区分「AI 辅助编辑」与「原创作」。）**

**⇒ 这**从外部确认了本方案维度 09 的核心判断**：**
**「用改写工具对抗检测器，是拿学术诚信赌一个随时会失灵的判别器」（§9.10 的原话）。**
**⇒ 现在这条判断不再只是本方案的观点 —— 它与国际出版伦理委员会的立场方向一致。**
**⇒ 且政策同时写明：**「披露 AI 辅助的语言/文体/结构编辑**不构成拒稿理由**，也不应被视为学术不端的证据」** ——**即：合规披露不会害你。**

### ★ 怎么写这段披露（可直接套的三种句式）

**政策要求「a brief description of how they were used」。按用途分三种写法：**

| 用途 | 披露句式（英文，可直接改） |
| --- | --- |
| **语言润色** | *The authors used [tool name] solely for language polishing of the manuscript. All scientific content, analyses, and conclusions are the authors' own.* |
| **结构/文体建议** | *[Tool name] was used to suggest improvements to the structure and style of the manuscript. The authors reviewed and revised all suggestions, and take full responsibility for the final text.* |
| **文献检索辅助** | *[Tool name] was used to assist literature searching. All retrieved references were independently verified by the authors against the original sources.* |

**⇒ 三条共同要素**：**①点名工具 ②写清用途 ③明确人类作者承担全部责任。**

### ★ 落地：本节给本维度的四条动作

| # | 动作 | 判据 |
| --- | --- | --- |
| **1** | **投稿时必附 AI 使用声明** | 用 **§9.11** 的三种句式之一，**或更省事：直接用 §9.14 里 Elsevier 给的官方模板**；**无使用也要写「No AI tools were used」**（部分刊要求显式声明无使用） |
| **2** | **查目标刊的两处** | **`Guide for Authors` 与 `Editorial Policies` 都查** —— AI 政策常在 `Editorial Policies` 或单独的 AI Policy 页（**本政策就是一个独立页 `AI-USE`**） |
| **3** | **找官方声明表** | **部分刊提供 AI use declaration form**（该刊提供 DOCX 与 PDF 两种）—— **有表就填表，别自己写** |
| **4** | **★ 不要因为「怕被判 AI」而隐瞒或对抗** | **隐瞒违反立场 2（必须披露）；对抗检测器违反立场 3 的精神** —— **而政策明说合规披露不会导致拒稿 ⇒ 披露的风险低于隐瞒** |

### ⚠ 本节的两条局限（如实标注）

**① COPE 原页在抓取时返回 403（Cloudflare），本节引用的 COPE 三条立场来自**一份逐字对齐 COPE 的期刊政策**，不是 COPE 原文页面本身。**
**⇒ 动笔引用前，请自己打开 `https://doi.org/10.24318/cCVRZBms` 核对原文。**
**② AI 政策是 2024–2026 变化最快的领域之一 —— 本节所有内容都应按【须查证】使用，以目标刊当期政策为准。**

### ★ 与本维度其他节的关系

| 节 | 管什么 |
| --- | --- |
| §9.10 | **怎么做**：写实（具体化）既是降重也是降 AI 率的正路 |
| **§9.11（本节）** | **怎么披露**：合规义务 + 三种句式 + 官方表格 |
| 合规红线（本文件他处） | **不能做什么**：不伪造、不隐瞒、不对抗检测器 |
---

### ★★★ 补：AIP Publishing 的政策 —— 披露门槛**不同**（Round 87 实抓）

> **来源**：**[AIP Publishing AI Policy](https://publishing.aip.org/resources/researchers/policies-and-ethics/ai-policy/)**（实抓于 2026-10-08，HTTP 200）。

**★ 与上节 COPE 系政策的关键差异在这里：**

| 社 | 语言润色要不要披露 | 原文 |
| --- | --- | --- |
| **COPE 系**（上节那份刊） | **要** —— 「Transparency regarding the use of AI tools **is required**」 | — |
| **AIP Publishing** | **不要** —— **「The use of AI tools to prepare manuscripts or improve the readability of original content created by the authors is permitted and **does not require disclosure**.」** | — |

**⇒ AIP 的披露门槛是「**是否可能影响发现或结论**」，它明确列了三类必须披露的用途：**

| # | 必须披露的用途（AIP 原文） |
| --- | --- |
| 1 | **Analysis of content, data, or images**（分析内容/数据/图像） |
| 2 | **Designing or conducting experiments**（设计或执行实验） |
| 3 | **Extracting or synthesizing information**（抽取或综合信息） |

**⇒ 且 AIP 对**怎么写**给出了三项必填**（比 COPE 系更具体）：

> **「the description must include **the exact tool (name, version, manufacturer)**, **what the tool was used for**, and **the reason for using it** for the task」**
> **⇒ 且要求写在 `Methods` 节**（而不只是文末声明）。

### ★★ 这条差异的方法论意义

**⇒ 这是本方案**修正二十一（判据必须平台感知）在「披露义务」上的又一实例**：**
**同一件事（AI 用了要不要说），两个出版社给出的答案不同 —— 且都不是错的，只是门槛不同。**
**⇒ 落地结论：AI 披露不能按「一个通用规则」办，必须**按目标刊**办。**
**⇒ 安全做法（兼顾两社）：**语言润色也写一句**（对 COPE 系是义务；对 AIP 是多说一句，不会被罚）。**

### ★ AIP 另外三条与本方案其他维度直接相关的硬规定

| # | AIP 原文要点 | 对应本方案维度 |
| --- | --- | --- |
| **1** | **「Any use of AI-generated references or citations that do not exist in real sources is a breach of publication ethics.」**（用 AI 生成不存在的参考文献 = 违反出版伦理） | **05 参考文献** —— 引用必须逐条核到原文 |
| **2** | **「Generative AI should not be used to create, alter, or manipulate original research data results or make adjustments to original images that alter the accuracy or interpretation of the original material.」** | **11 图像与原始数据处理** —— 与「不修饰图像」红线一致 |
| **3** | **★「During the review process, the journal may request the original images or data if there are concerns about their validity. Authors are expected to **maintain the original image and data files** during the submission and publishing process and provide them if requested.」** | **★ 11 维度** —— **这是「原始数据必须留档」的**出版社明文依据**；**且要求**整个投稿到出版期间**都保持可提供** |

### ★ AIP 给作者的「最佳实践」三条（可当自查项）

| # | 原文要点 |
| --- | --- |
| **1** | **「Verify the output of an AI tool」** —— 确保科学上站得住、术语符合领域、事实陈述能被可靠来源佐证 |
| **2** | **★「using generative AI in analysis and interpretation of results might make the scientific output **harder to reproduce**」** —— 因为生成式 AI 输出本身有变异性且有幻觉，**同样的步骤与提示词换个人跑可能得到不同结果** |
| **3** | **查工具的条款** —— 谁拥有生成内容的权利、商用限制、工具方如何留存/复用/再分发你上传的内容；**如工具方要求，须在稿件中适当致谢该工具** |

**⇒ 第 2 条尤其值得记：**生成式 AI 参与分析会**降低可复现性** —— **这与本方案修正十八（测量必须可复现）方向一致**，且给出了一个此前没写的具体机制（**同一提示词换人跑结果会变**）。**

---

## 9.12 ★★★ 四社 AI 政策系统对比（2026 同行评议研究）—— 外部把「平台差异」系统化了

> **来源**：**Chigwada, J. & Ngulube, P. (2026). _Use of artificial intelligence tools in the publishing process: expectations from publishers through author guidelines_. Frontiers in Research Metrics and Analytics, 11:1740510. DOI `10.3389/frma.2026.1740510`**（Open Access, CC BY；2026-05-14 出版）。
> **实证状态【已核实】**：**已抓 PDF 全文并通过提取物有效性门【已核实】（字母占比 92.1% · 正文特征词 5 个 · 字节比 0.191 —— 三项均为本机实测值）**；本次引用的两张表与结论**逐字来自该文**。
> **★ 为什么这一节分量最重**：**§9.11 与 §9.11 补充里的「两社披露门槛不同」是本项目**自己比对两家**得出的；这一篇是**同行评议的**四社系统比较** —— 它把同一个发现**做成了可引用的研究结论**。**

### 该文的核心结论（原文）

> **「The findings revealed that AI policies are **not standardized** across publishers; instead, each adopts its own unique rules regarding AI-assisted writing, authorship, peer review, and disclosure.」**
> **「This inconsistency means that authors working across different publishers face **genuinely contradictory expectations** regarding the same practice.」**

**⇒ 本项目修正二十一（判据必须平台感知）在 AI 政策这一项上，获得了**同行评议文献的支证**。**

### ★★ 表 1：按「活动」划分的政策（该文 Table 1）

| 活动 | 政策 | 含义（原文要点） |
| --- | --- | --- |
| **构思与假设形成** | **Mostly forbidden** | **被视为需要人类原创性与问责的核心智识贡献；研究者必须独立产生研究构思，AI 不能被赋予智识所有权** |
| **写作协助** | **Accepted with proper disclosure** | **必须致谢所用 AI 工具；AI 被视为**语言精炼**的辅助工具，而非**内容生成**工具** |
| **文献综述协助** | **Mixed**（有的允许并披露，有的禁止） | **顾虑是偏见与幻觉 —— 研究者须自行核实 AI 生成的摘要** |
| **图像与图表制作** | **Varies by publisher** | **须确认原创性，可能需提供方法学透明度** |
| **数据分析与解释** | **Restricted in most publishers** | **须显式披露并给出理由** |
| **同行评议过程** | **Not allowed by most** | **评议人不得使用 AI；一经发现可能被取消资格或受处分** |

### ★★ 表 2：四社逐项对比（该文 Table 2）

**四社 = Taylor & Francis · Emerald · Frontiers · Sage**（该文明确列出；数据采集期 **2025-09 至 2025-12**）。**

| 政策维度 | T&F | Emerald | Frontiers | Sage | 该文列的「比较洞见」 |
| --- | --- | --- | --- | --- | --- |
| **AI 作为作者** | No | No | No | No | **普遍共识**：AI 无问责能力、不能承担作者责任 |
| **披露是否强制** | Yes | Yes | Yes | Yes | **高度一致** —— 透明度是基础原则 |
| **文献综述** | Conditional | Conditional | Conditional | **Conditional 且应披露** | 差异反映对「AI 辅助知识综述」的容忍度不同 |
| **图像生成** | Conditional | Conditional | **Prohibited** | Conditional | 对**伪造或误导性视觉输出**的警惕在上升 |
| **数据分析** | Conditional | Conditional | Conditional | Conditional | **一致的审慎** —— 承认潜力但需监督 |
| **同行评议使用** | Prohibited | Prohibited | Prohibited | Prohibited | **完全一致** —— 强调此限制的重要性 |
| **执行机制** | Described | Described | Described | Described | 各社都强调治理结构，但执行严格度可能不同 |

### ★★★ 从两张表能读出的**分类结构**（四类 —— 其中只有一类可放心依赖）

**⇒ 该文的两张表合起来给出了一个极有用的结构：**哪些是**共识**（可放心依赖），哪些是**变量**（必须逐刊查）。**

| 类别 | 内容 | 怎么用 |
| --- | --- | --- |
| **✅ 四社一致** | **①AI 不能署名 ②同行评议中禁用** | **这两条**在四社里完全一致** —— 但仍**仅限这四社**（Emerald / Frontiers / Sage / Taylor & Francis）；**其他出版社须自行核对**** |
| **✅✅ 有更强依据的一条** | **披露是必须的** | **⚠ 注意区分「要不要披露」与「披露门槛」**：**「必须有声明」在四社 + AIP + Elsevier 都成立（可当通例）**；**但「什么程度要披露」三家不同**（COPE 系最严 / AIP 与 Elsevier 都豁免拼写语法检查）—— **见下方「三套口径」表** |
| **⚠ 逐刊不同（必须查目标刊）** | **文献综述 · 图像生成 · 数据分析 · 执行严格度** | **这四项**只能查目标刊**；其中**图像生成**的差异最大（有的直接禁止） |
| **❌ 普遍被禁（不要做）** | **同行评议使用**（四社一致 Prohibited） | **★ 这一项不要用 AI** |
| **⚠⚠ 争议最大（★ 别照任何一边办）** | **构思与假设形成** | **★ 四社研究说是 Mostly forbidden，但 Elsevier **明确允许** generating ideas（详见 §9.13 / §9.14）—— **这一项没有通例，必须查目标刊**；**且两家都要求责任在你** |

### ★ 该文给出的三条与本方案其他维度直接相关的具体规定

| # | 原文要点 | 冲击哪个维度 |
| --- | --- | --- |
| **1** | **★「it is recommended that authors who utilize AI should **disclose in the materials and methods section** how they have used AI and indicate which tools were used.」** | **09 / 03** —— **该文建议放 Methods，但**这条建议不是通例**：**Elsevier 用独立的 AI declaration statement（见 §9.13）** |
| **2** | **★「Emerald explicitly prohibits AI use in generating literature reviews because this constitutes a core intellectual contribution, while Taylor and Francis takes a more permissive view.」**；**「in-text reporting of AI-generated statistics is explicitly prohibited by Emerald」** | **★ 05 参考文献 · ★ 10 统计** —— **文献综述与统计报数这两件事上，有的社直接禁止** |
| **3** | **★「several publishers explicitly prohibited editors and peer reviewers from uploading manuscripts to AI platforms」**（保密性风险）；**「Springer Nature prohibits the publication of generative AI images」** | **11 图像** —— **生成式 AI 图像在 Springer Nature 被禁止发表** |

### ★★ 本节给本维度加的四条动作

| # | 动作 | 判据 |
| --- | --- | --- |
| **1** | **先按表 1 分类你用了 AI 做什么** | **构思/写作/综述/图/数据分析/评议** —— **①「评议」一律不能用；②「构思」争议最大（四社禁、Elsevier 允许）⇒ 查目标刊；③其余按目标刊查** |
| **2** | **再按表 2 查目标刊属于哪一列** | **四社口径不同**；不在四社之列的刊，**用表 2 的四个维度去查**（**文献综述 / 图像生成 / 数据分析 / 执行严格度**） |
| **3** | **披露写到哪** | **⚠ 见 §9.13 —— 至少**三处不同位置**，务必按目标刊：①**独立的 AI declaration statement**（Elsevier 的主位置）②**`Methods` 节**（AIP；Elsevier 用于「研究本身」的用途）③**图注本身**（Elsevier：用过 AI 创建或编辑图像时，**除总声明外还要在图注里再写一次**） |
| **4** | **★ 引用时注明数据采集期** | **该文采集期是 2025-09 至 2025-12，且论文自己声明「考虑到出版业 AI 治理的快速演变，采集窗口被明确限定」** —— **引用它的结论时必须带上这个时间限定** |

### ⚠ 三条局限（如实标注）

**① 样本是**四家**（Emerald / Frontiers / Sage / Taylor & Francis）—— 不覆盖 Elsevier、Springer Nature、Wiley、AIP、以及日本与中国学会刊。**
**② 数据采集期 2025-09～2025-12 —— 政策在变，引用前应查目标刊当期政策。**
**③ 该文是**定性研究**（qualitative design），不是政策普查；它的两张表是「所采四社的对比」，不能读成「所有出版社的比例分布」。**

**⇒ 出处**：`../_refs/p8-frontiers-ai-policies-2026.pdf`（255,097 字节）· `../_refs/p8-frontiers-ai-policies-2026.txt`（提取文本，已过门）。

---

## 9.13 ★★★ Elsevier 生成式 AI 政策（2026-08-18 更新）—— 第三个披露门槛 + 最细的图像规定

> **来源**：**[Elsevier, _Updated generative AI policies for journals_](https://www.elsevier.com/connect/updated-generative-ai-policies-for-journals-supporting-responsible-use-while-protecting-trust)（2026-08-18）**；**完整政策页**：`https://www.elsevier.com/about/policies-and-standards/generative-ai-policies-for-journals`。
> **实证状态【已核实】**：**公告页实抓【已核实】（HTTP 200）**；**完整政策页**后来已实抓（见 §9.14）**；**FAQ 与 `For reviewers` / `For editors` / `Publication process` 三节**仍未抓，需自行核对**。

### ★★★ 一、披露门槛：现在是**三套**，不是两套

**把三家的口径并排看，差异一目了然：**

| 社 | **拼写/语法/标点检查** | **语言润色** | **实质修改（句结构/组织/内容）** |
| --- | --- | --- | --- |
| **COPE 系**（§9.11） | **【须查证】**（该政策的引文只说「透明度是必须的」，**未逐字提到拼写/语法/标点检查** —— 这一格是**推断**，不是引文） | 要 | 要 |
| **AIP**（§9.11 补充） | 不要 | **不要** | 影响发现或结论时才要 |
| **★ Elsevier**（本节） | **不要** | **不要**（原文只豁免「basic spelling, grammar and punctuation checks」；实质改动要披露） | **要** |

**⇒ Elsevier 原文**：**「Basic spelling, grammar and punctuation checks do not need to be declared. However, where an AI tool makes **substantive changes to sentence structure, organization or content**, that use should be disclosed.」**

**⇒ ★ 结论：披露门槛不存在通用答案 —— 这已经是**第三个**不同口径。**
**⇒ 安全做法（同时满足三家）：**按最严的写 —— 即**任何 AI 参与都写一句**。**对宽的一边是「多说一句」，对严的一边是「履行义务」。**
**⇒ ⚠ 唯一的例外：**Elsevier 明文豁免「残障相关辅助技术、且**仅**用于可及性目的」**（见 §9.14）—— **若属这一类则不需声明**；**一旦兼作他用，豁免不成立。**

### ★★★ 二、披露位置：Elsevier 用**独立的 AI declaration statement**

**原文**：**「authors are asked to disclose the use of AI tools in manuscript preparation through **a separate AI declaration statement at submission**.」**

**⇒ 该声明须包含三项：**

| # | 内容 |
| --- | --- |
| **1** | **identify the tool used**（点名工具） |
| **2** | **explain the purpose of its use**（说明用途） |
| **3** | **confirm that the authors reviewed and edited the content and take full responsibility for the published article**（确认作者审阅并编辑过，且对发表文章负全责） |

**⇒ ★★★ 关键：Elsevier 把「AI 用于稿件准备」与「AI 用于研究本身」**分开处置****：**

| 用途 | 披露位置 |
| --- | --- |
| **稿件准备**（写作、语言、组织…） | **独立的 AI declaration statement** |
| **研究本身**（research design / methods / data collection / analysis / interpretation） | **★ 写进 `Methods` 节，且要写得**可复现**（「described in the Methods section in a **reproducible way**」）** |
| **图像**（创建或编辑过） | **★ 除总声明外，还须**在图注本身里**也声明（「disclosed in the image caption itself, **in addition to** the general AI declaration」）** |

**⇒ 对本方案的直接冲击**：**§9.11 与 §9.12 里那两条「两份独立来源都指向 Methods」的推论**作废** —— **至少三处位置，且 Elsevier 的主要位置不是 Methods。**
**⇒ 修正：**披露位置**没有通例**，必须按目标刊；**唯一可当通例的是**「必须有一个单独的、点明工具与用途、并声明作者担责的声明」。**

### ★★★ 三、图像规定：本方案见过的**最细**的一套（直接冲击维度 11）

**Elsevier 按图像**角色**分三类，规定完全不同：**

| 类别 | 允许 AI？ | 原文要点 |
| --- | --- | --- |
| **① 解释性图像**（流程图、决策树、时间线、示意图、实验流程图） | **✅ 可以** | 「Authors may use AI tools to support the creation of certain explanatory images, such as flow charts, decision trees, timelines, schematic illustrations or experimental workflow diagrams.」 |
| **② 数据可视化** | **⚠ 有条件** | **仅当输出**直接来源于底层数据**且**方法可复现并清楚报告**时可用 AI 支持；**「AI tools must not be used to **fabricate results, invent or alter underlying data**, or generate figures that are **not faithfully derived from the research**」** |
| **③ 原始研究图像**（显微、组织学、Western blot、放射影像、患者图像） | **❌ 不得** | **「AI tools must not be used to **create or alter images representing primary observed or experimental data that were not directly obtained in the research**」** |

**另两条细则：**

| # | 规定 |
| --- | --- |
| **1** | **★ 通用生成式 AI 图像工具**不得**用于制作 graphical abstract（图文摘要）** **（**★ Round 166 同源注记**：**本行的措辞与 **`07-abstract.md` §7.17 三** 记录的官方页原文**不一致** —— **官方页现写的是**`must align with our generative AI policies for journals`（**须符合其生成式 AI 政策**）**，**是**指针不是禁令****。**⇒ **投稿前打开**目标刊 guide for authors **与** Elsevier generative AI policies **这两页**，**以你实际看到的为准****。）** |
| **2** | **AI 生成的封面图（cover art）**在部分情况下可被允许，但**须事先取得期刊编辑与出版社许可** |

**⇒ ★ 对本方案维度 11 的意义**：**此前维度 11 的「不修饰图像」是**本方案的红线**；现在它有了**按图像类别分层的出版社明文依据** —— 而**注意它比「一律不许」更细**：**解释性图像可以，原始数据图像不可以。**

### ★ 四、Elsevier 同样允许的用途清单（与四社研究冲突的一处）

**原文列举：「AI tools can support authors during manuscript preparation. These tools can help with tasks such as **summarizing complex literature, identifying research gaps, organizing content, generating ideas, creating explanatory images and improving language or readability**.」**

**⇒ ★★ 注意「**generating ideas**」与「**identifying research gaps**」两项：**
**这**直接与维度 01 引用的四社研究 Table 1（构思与假设形成 = Mostly forbidden）冲突。**
**⇒ 已在 `维度 01 §1.12` 顶端加入更正说明，把两方证据并列。**

### ★ 五、作者的责任清单（Elsevier 原文）

| # | 责任 |
| --- | --- |
| **1** | **检查 AI 生成材料**的准确性与偏见、完整性、以及**伪造或错误的参考文献** |
| **2** | **编辑与改写 AI 辅助内容**，使稿件反映**作者自己的**分析与解释与原创新贡献 |
| **3** | **检查所用 AI 工具的条款** —— 尤其是涉及**未发表稿件、研究数据、个人信息**时；**只要工具能保护保密性、数据隐私、知识产权与未来发表权，就可以用** |

**⇒ 第 1 条里的「**fabricated or incorrect references**」与 AIP 的「AI 生成不存在的参考文献 = 违反出版伦理」同向 ⇒ 维度 05 的红线获得第二家出版社背书。**

### ⚠ 三条局限

**① 本节依据的是 Elsevier 的**政策公告页**，不是完整政策页与 FAQ —— 后两者本轮未抓，**引用前请自行核对**。**
**② Elsevier 说的是**其期刊的通用政策**，具体期刊可能有更严的补充要求 ⇒ 仍须查目标刊。**
**③ 「AI declaration statement」的具体表单与措辞由投稿系统提供 —— 投稿时以系统里看到的为准。**

**⇒ 出处**：本轮实抓的公告页（URL 见本节开头）。

---

## 9.14 ★★★ Elsevier **完整政策页**（不是公告）—— 官方声明模板 + 两条此前没写的规则

> **来源**：**[Elsevier, _Generative AI policies for journals_](https://www.elsevier.com/about/policies-and-standards/generative-ai-policies-for-journals)**（完整政策页，实抓 2026-10-08，HTTP 200）。
> **★ 为什么单列**：**§9.13 依据的是 Elsevier 的**公告页**；这一节依据**完整政策页** —— 它多出了**一份官方声明模板**与**两条公告页没写的规则**。**

### ★★★ 一、官方声明模板（可直接填空用 —— 本方案目前最可直接使用的产物）

**Elsevier 在完整政策页里给出**推荐格式**，原文如下：**

```
Title of section: Declaration of generative AI and AI-assisted technologies
                 in the manuscript preparation process

Statement: During the preparation of this work, the author(s) used
           [NAME OF TOOL / SERVICE] in order to [REASON].
           After using this tool/service, the author(s) reviewed and edited
           the content as needed and take(s) full responsibility for the
           content of the published article.
```

**⇒ 中文填写版（同样结构，投稿中文刊时可用）：**

```
节标题：稿件准备过程中生成式 AI 与 AI 辅助技术的使用声明

声明：在本工作准备过程中，作者使用了【工具/服务名称】用于【用途】。
      使用该工具/服务后，作者按需审阅并编辑了内容，
      并对已发表文章的内容承担全部责任。
```

**⇒ ★ 这份模板比 §9.11 里我自己写的三种句式更值得用** —— **它是出版社给出的格式，照抄不会错**。**
**⇒ 用法：把 `[NAME OF TOOL / SERVICE]` 与 `[REASON]` 两处替换掉，其余原样。**

### ★★ 二、两条公告页没写的规则

**规则一 · 无障碍工具豁免：**

> **「authors are **not required to disclose** the use of AI tools or features within **specialist disability-related assistive technology**, provided these are used **solely for accessibility purposes**.」**

**⇒ 落地：**若你用的是残障相关的辅助技术（且**仅**用于可及性目的），**不需要声明**。**
**⇒ 边界：**「solely for accessibility purposes」是限定 —— 一旦兼作他用，豁免就不成立。**

**规则二 · 查工具条款的**两条硬要求**（比公告页的「查条款」具体得多）：**

| # | 原文要求 | 中文含义 |
| --- | --- | --- |
| **1** | **「they only grant to the AI tool the right to use their materials **to provide the service to them** and that they **do not grant** to the AI tool any other rights to the materials that they input (including without limitation **the right to train the AI tool on those materials**)」** | **你只授予工具「为你提供服务」的权利；**不得**授予**训练权**等其它权利** |
| **2** | **「They must also ensure that the AI tool **does not impose constraints on the use of outputs** from the AI tool in a way that **could restrict the subsequent publication** of the relevant article.」** | **工具**不得**对你的输出施加**限制后续发表**的约束** |

**⇒ ★ 这两条给了「查工具条款」一个**可执行的判据**：不要只问「隐私政策好不好」，要问两句：**

| 问工具/看条款 | 要得到否定的答案 |
| --- | --- |
| **「你们会用我上传的内容训练模型吗？」** | **必须是「不会」（或你能接受并可关闭）** |
| **「我用你们生成的输出发表论文，你们有权利限制吗？」** | **必须是「没有」** |

**⇒ 若任一条答不上来或答案是「会/有」 ⇒ 不要用这个工具处理未发表稿件。**

### ★ 三、完整政策页的另外三处补充

| # | 内容 |
| --- | --- |
| **1** | **该声明**会出现在已发表文章里**（不只是投稿系统内部）—— 「This statement **will appear in the published article**」** |
| **2** | **书（Books）有**单独的一套**生成式 AI 政策** —— 完整 URL：**`https://www.elsevier.com/about/policies-and-standards/publishing-ethics-books/generative-ai-policies`**（该链接取自完整政策页的「Read the Generative AI Policies for Books」按钮）—— **写书稿时按那一套** |
| **3** | **完整政策页分七节**：About · **For authors** · **Images and artwork** · **For reviewers** · **For editors** · Publication process · FAQ —— **投稿前这七节都值得扫一遍**（本方案只覆盖了 For authors 与 Images）** |

### ★ 四、作者「问责清单」的完整四项（完整政策页原文）

| # | 原文 |
| --- | --- |
| **1** | **「Carefully reviewing and verifying the accuracy, comprehensiveness, and impartiality of all AI-generated output (**including checking the sources, as AI-generated references can be incorrect or fabricated**)」** |
| **2** | **「Editing and adapting all material thoroughly to ensure the manuscript represents **the author's authentic and original contribution** and reflects their own analysis, interpretation, insights and ideas」** |
| **3** | **「Ensuring the use of any tools or sources, AI-based or otherwise, is made **clear and transparent to readers**」** |
| **4** | **「Ensuring the manuscript is developed in a way that **safeguards data privacy, intellectual property and other rights**, by checking the terms and conditions of any AI tool」** |

**⇒ 第 2 条是本方案反复强调的那件事的出版社原话：**改到「读起来是你自己的分析、解释、洞见与想法」** —— 这正是维度 06 与 09 §9.10「写实」要达到的效果。**

### ⚠ 两条局限

**① 本节与 §9.13 都只覆盖了完整政策页的 `For authors` 与 `Images and artwork` 两节；`For reviewers` / `For editors` / `Publication process` / `FAQ` 四节**本方案未覆盖**。**
**② Elsevier 政策是**刊群通用**的，具体期刊可能更严 ⇒ 仍须查目标刊。**

**⇒ 出处**：完整政策页 URL 见本节开头（实抓 2026-10-08）。

---

---

## 9.x ★★★★ Springer Nature：**风险分级模型** —— 与前四家的**结构不同**（Round 109 补）

> **为什么补这一节**：本方案此前核实的四家（**COPE 系 · AIP · Elsevier · 四社研究里的 Emerald/Frontiers/Sage/T&F**）都是**二元模型** —— 问「**要不要披露**」，
> **⇒ 而 Springer Nature 在 2026-09 把政策换成了**四维风险模型**。这不是又一家说不同的话，**是换了一个坐标系**。

### 一、出处与状态

| 项 | 内容 |
| --- | --- |
| **发布方** | **Springer Nature Group**（伦敦 / 海德堡 / 纽约） |
| **日期** | **2026 年 9 月 10 日** |
| **标题** | *Springer Nature réactualise ses politiques et recommandations sur l'IA pour encourager une utilisation responsable*（集团新闻稿） |
| **URL** | <https://group.springernature.com/de/group/media/communiques-de-presse/politiques-recommandations-intelligence-artificielle/53695940> |
| **实抓状态** | **HTTP 200（2026-10-08 实抓）** · **注意：实抓的是**法语版**（英/德语版走 `www.springernature.com` / `link.springer.com`，**跨域重定向未取到**） |
| **指引页（原文给出）** | <https://group.springernature.com/gp/group/ai/ai-guidance-for-our-researchers-and-communities> |
| **编辑政策（原文给出）** | <https://www.springernature.com/gp/policies/editorial-policies> |

### 二、★★★★★ 政策重心的转移（**原文，本节直译**）

> **原文：Au lieu de se limiter à la question de savoir si l'IA a été utilisée ou pas, les politiques actualisées s'intéressent désormais aux points suivants :**
> **⇒ 不再局限于「AI 有没有被使用」，更新后的政策现在关注：**

| # | 原文 | 直译 | 落地含义 |
| --- | --- | --- | --- |
| **1** | **la façon dont l'IA a été utilisée** | **AI 是**怎么被用的**** | **不是 yes/no，是用法** |
| **2** | **l'impact potentiel de cette utilisation** | 这种使用的**潜在影响** | 影响哪个环节（写作 / 分析 / 结论） |
| **3** | **le niveau de risque que cette utilisation implique** | 它涉及的**风险等级** | **★ 核心是分级，不是披露与否** |
| **4** | **la garantie d'une supervision humaine adéquate** | 是否保证了**充分的人类监督** | **监督**是可检查项 |

**⇒ ★ 与本方案已有四家的根本差别：**
**⇒ 前四家问「**要不要写一句声明**」；这一家问「**你这次用法的风险等级是多少、谁来监督**」。**
**⇒ 前者是一个**合规动作**，后者是一个**评估框架 —— 后者更难伪造，也更难照抄。**

### 三、★★★ 三档用法（**原文分类，本节照录**）

**原文明确：**「le cadre reconnaît également que toutes les utilisations de l'IA ne se valent pas」（框架承认并非所有 AI 用法都等价）**。**

| 档 | 原文举例 | 直译 | 要求 |
| --- | --- | --- | --- |
| **低风险** | **l'amélioration linguistique · le nettoyage de données · la structuration de commentaires** | **语言改进 · 数据清洗 · 评述结构化** | 原文：**risque relativement limité**（风险相对有限） |
| **高风险** | **la suggestion de méthodes · l'identification de tendances dans les données · l'aide à l'interprétation de résultats** | **方法建议 · 识别数据中的趋势 · 协助解读结果** | 原文：**nécessitent une évaluation, une supervision humaine et un niveau de transparence plus élevés**（需要更高的**评估**、**人类监督**与**透明度**） |
| **★ 禁止** | **générer des conclusions · déléguer l'évaluation par les pairs à un outil d'IA** | **用 AI 生成结论 · 把同行评议委托给 AI 工具** | 原文：**restent interdits**（仍然禁止）—— 理由是**它们会替代负责任的人类判断、或损害出版流程的完整性** |

**⇒ ★★★ 对本方案最重要的一条：「**协助解读结果**」被归入**高风险**档。**
**⇒ 而本方案的**主要服务对象**恰恰是「拿到数据之后怎么把它写清楚」——**那正是「协助解读」的邻近地带**。**
**⇒ 所以本方案必须给出一条**划线判据**（见下一节）。**

### 四、★ 划线判据：**「协助解读」与「生成结论」的分界在哪**

**⇒ 原文只给了两端（高风险 / 禁止），没有给分界线。下面这条**是本方案据原文逻辑给出的【作者判断】：**

| 问 | 归属 |
| --- | --- |
| AI 帮你把**你已经得出的结论**写得更清楚 | **低风险或高风险**（视是否改动结论内容） |
| AI 建议了几种可能的解释，**你逐条用数据检验、并写下你采信哪条与为什么** | **高风险（可接受，须披露 + 有人类监督痕迹）** |
| AI 给出一个解释，**你没有独立检验就写进论文** | **★ 这是「生成结论」的实质 —— 禁止** |

**⇒ 一句话判据：**结论的**责任主体**是不是你 —— 若你说不清「我为什么采信这一条」，那结论就是 AI 生成的，不是你的。**
**⇒ 这正好与本方案维度 06 的**反表演性自查**（「如果这条数据是我编的，我的正文会不会还这么通顺」）同源：**两者问的都是「责任主体是谁」。**

### 五、★★ 语言改进：**第三家口径出现了**

**⇒ 这是本方案第二次遇到「同一问题、三份不同答案」：**

| 家 | 对**语言润色**的口径 |
| --- | --- |
| **COPE 系** | 披露要求**包括**语言润色 |
| **AIP Publishing** | 语言润色**不需要**披露 |
| **Elsevier** | 拼写/语法/标点**不需要**声明；**实质性**句构/组织/内容改动需要 |
| **★ Springer Nature（2026-09）** | 归入**低风险**档（**风险相对有限**），但原文同时说：**systematically demanding appropriate declarations**（**系统性地要求适当的声明**） |

**⇒ ★ 本条最值得记的一点：**Springer Nature 在把它归入「低风险」的**同一份文件里**，仍然要求**系统性地**要声明。**
**⇒ 所以「低风险」**不等于**「不用声明」** ——**这两件事在这份政策里是分开的。**（这是本方案此前四家里**没有出现的区分**。）**

### 六、★ 本节给本维度加的可执行动作

| 动作 | 判据 |
| --- | --- |
| **1. 投 Springer Nature 系前，按四维自查** | 写下：**怎么用的 · 潜在影响 · 风险等级 · 谁监督**（四维，不是一句「使用了 AI」） |
| **2. 把用法按三档归类** | 语言改进/数据清洗/评述结构化 = 低风险；**方法建议/趋势识别/协助解读结果 = 高风险**；**生成结论/委托评审 = 禁止** |
| **3. ★ 协助解读必须留监督痕迹** | 若 AI 建议过解释，**逐条记录：AI 建议了什么 → 你用什么数据检验 → 你采信哪条与为什么** |
| **4. 低风险 ≠ 不声明** | **该刊仍要求系统性声明** —— **不要因为「只是润色」就省略** |
| **5. 不把同行评议给 AI** | **原文明确禁止**（这是编辑侧的红线，作者也不应参与此类请求） |

**⇒ 出处**：Springer Nature Group 新闻稿（**一手实抓 HTTP 200，2026-10-08；法语版**，发布日 **2026-09-10**）· 与 `../期刊投稿要求核实清单.md` 里已核实的四家（COPE 系 / AIP / Elsevier / 四社研究）并列使用。
**⇒ 未抓到**：Springer Nature 的**编辑政策正文页**（`www.springernature.com/gp/policies/editorial-policies`）与**指引页正文** —— **英/德语版走跨域重定向（`idp.springer.com` / `link.springer.com`），本轮未取到**。**⇒ 引用具体条款前请自行打开那两页核对。**

---

---

## 9.15 ★★★★★ 一页对照：**投稿前只查这一张**（Round 110 补）

> **为什么补这一节**：本维度的 AI 政策材料是**按发现时间**追加的 —— **§9.11（COPE 系 + AIP）· §9.12（四社研究）· §9.13 / §9.14（Elsevier）· §9.x（Springer Nature）**。
> **⇒ 于是想回答**一个问题**「我这篇该怎么披露 AI」，得在**五个按时间顺序排列的小节**里翻。**
> **⇒ 本节把它们压成一张表。**（§9.13 里已有一张三社门槛对照表，但**只比三家、只比一个轴**；本节补全。）

### 一、★ 先按「你投哪家」定位（导航）

| 你投的 | 读哪几节 |
| --- | --- |
| **COPE 系**（多数采用 COPE 立场的刊） | **§9.11**（核心立场 + 三种披露句式） |
| **AIP Publishing** | **§9.11 的「补」段**（门槛不同 + Methods 三项必填 + 最佳实践三条） |
| **Elsevier** | **§9.13**（门槛 + 披露位置 + 图像三档）· **§9.14**（**官方声明模板** —— 本方案最可直接用的产物） |
| **Springer Nature** | **§9.x**（四维风险模型 + 三档用法 + 协助解读的划线判据） |
| **Emerald / Frontiers / Sage / Taylor & Francis** | **§9.12**（四社系统对比，同行评议研究） |
| **其它任何刊** | **本节第三节的「唯一通例」+ 目标刊的 `Editorial Policies` 页** |

### 二、★★★ 五个来源，**五种模型** —— 这是本方案对 AI 政策最重要的结构性认识

**⇒ 它们不是「五份说法不同的文件」，是**五种不同的政策形态**：**

| # | 来源 | 模型 | 一句话 |
| --- | --- | --- | --- |
| **1** | **COPE 系** | **一律披露模型** | **用了就说**（包括语言润色） |
| **2** | **AIP** | **影响门槛模型** | **只有可能影响发现或结论时才说**（语言润色不说） |
| **3** | **Elsevier** | **实质性门槛 + 位置分工模型** | **拼写/语法/标点不说；实质性句构/组织/内容改动要说**；**而且按用途分三处位置** |
| **4** | **Springer Nature** | **★ 风险分级模型** | **不问「用没用」，问「怎么用的 / 影响 / 风险等级 / 谁监督」** |
| **5** | **四社研究（Emerald·Frontiers·Sage·T&F）** | **实证「无标准」模型** | **原文结论：政策未标准化，期望真实地互相矛盾** |

**⇒ ★★★ 这句话是本节的核心：**「AI 披露」这句话本身没有唯一答案，因为**问法在不同出版社那里就不一样**。**
**⇒ 所以本方案不给「一个正确答案」，给的是**一条查找路径 + 一条安全默认值**。**

### 三、★★★ 三个轴并排（**门槛 / 位置 / 图像**）

**⇒ 轴 1：披露门槛**（表已含 Springer Nature，即 §9.13 那张表的补全）

| 社 | 拼写/语法/标点 | **语言润色** | **实质性改动**（句构/组织/内容） |
| --- | --- | --- | --- |
| **COPE 系** | **【须查证】**（引文未逐字提及，属推断） | **要** | **要** |
| **AIP** | **不要** | **不要** | **影响发现或结论时才要** |
| **Elsevier** | **不要** | **不要** | **要** |
| **★ Springer Nature** | 归入**低风险**档 | 归入**低风险**档 | 归入**高风险**档（需更高评估/监督/透明度） |
| **★ 但注意** | — | — | **Springer Nature 在归入「低风险」的同一份文件里，仍要求「系统性地」索取声明** ⇒ **「低风险」≠「不用声明」** |

**⇒ 轴 2：披露位置**（**⚠ 没有通例**）

| 社 / 来源 | 位置 |
| --- | --- |
| **COPE 系** | **独立的 AI 使用声明**（该刊提供 DOCX / PDF 声明表） |
| **AIP** | **★ `Methods` 节**（且须写 工具名+版本+厂商、用途、**用的理由**） |
| **Elsevier** | **★ 按用途分三处**：**稿件准备** ⇒ 独立 AI declaration statement；**研究本身**（设计/方法/采集/分析/解读） ⇒ **写进 `Methods` 且要**可复现**；**图像**（创建或编辑过） ⇒ **除总声明外，还须在**图注本身**里声明 |
| **四社研究** | 原文结论：**至少三处位置，没有通例** |

**⇒ ★ 本方案此前有一条推论「两份独立来源都指向 Methods」—— 该推论**已被 Elsevier 作废**（见 §9.13 第二节末）。**

**⇒ 轴 3：图像**（**只有 Elsevier 给了分层规定**）

| 图像类别 | Elsevier 的规定 |
| --- | --- |
| **① 解释性图像**（流程图 / 决策树 / 时间线 / 示意图 / 实验流程图） | **✅ 可以用 AI** |
| **② 数据可视化** | **⚠ 有条件** —— 仅当输出**直接来源于底层数据**且**方法可复现并清楚报告**；**不得伪造结果、编造或改动底层数据、生成不是忠实来自研究的图** |
| **③ 原始研究图像**（显微 / 组织学 / Western blot / 放射 / 患者图像） | **❌ 不得用 AI 创建或改动** |
| **另** | **通用生成式 AI 图像工具**不得**用于制作 graphical abstract**；**封面图**须事先取得编辑与出版社许可 |
| **★ 同源注记 2** | **★ Round 166**：**本条与 `07-abstract.md` §7.17 三 记录的官方页原文**不一致**** —— **官方页现写**`must align with our generative AI policies for journals`（**须符合其生成式 AI 政策**）**，**是**指针不是禁令****。**投稿前以目标刊 guide for authors 与出版社 AI 政策两页为准****。 |

**⇒ ★ 注意它比「一律不许」更细：**解释性图像可以，原始数据图像不可以。**（§9.x 里 Springer Nature 的**三档**与之同构 —— 一家按图像角色分、一家按用途风险分。）**

### 四、★★★★ 唯一通例（**可以当通用规则用**）

**⇒ 跨全部五个来源，只有这一条是一致的：**

> **必须有一个**单独的**声明：**点明工具** · **说明用途** · **声明作者承担全部责任**。**

**⇒ 三个要素，缺一不可。**
**⇒ 且：**披露合规**不构成拒稿理由**（COPE 系政策明文）；**期刊不把 AI 检测软件当作编辑或评审决策的决定性证据**（同上）。**

### 五、★★ 安全默认值（**拿不准时照这条做**）

| # | 动作 | 理由 |
| --- | --- | --- |
| **1** | **任何 AI 参与都写一句**（含语言润色） | 对严格的一边（COPE 系）是**履行义务**；对宽松的一边（AIP / Elsevier）是**多说一句，不会被罚** |
| **2** | **声明按三要素写**：点名工具 · 说明用途 · 作者担责 | **唯一通例** |
| **3** | **把 AI 参与研究的过程也写进 `Methods` 且写得可复现** | **AIP 与 Elsevier 都要求**（这一步常被漏 —— 多数人只在文末写一句） |
| **4** | **图像一律按最严处理** | 只有 Elsevier 给了分层，**别的刊可能更严**；**原始数据图像任何情况下都不许用 AI 创建或改动** |
| **5** | **无使用也显式声明「No AI tools were used」** | 部分刊要求显式声明无使用 |
| **6** | **查目标刊两处**：`Guide for Authors` **与** `Editorial Policies` | AI 政策常在后者或独立的 AI Policy 页 |
| **7** | **有官方声明表就填表，别自己写** | 多家提供 DOCX / PDF 声明表 |

**⇒ ★ 第 3 条是本方案要特别强调的：**大多数人以为「AI 披露 = 文末写一句」。**
**⇒ 而 AIP 要求写在 `Methods`、Elsevier 要求研究用途写在 `Methods` 且**可复现 —— **文末那一句不够。**

### 六、★ 一条纪律（**避免最常见的误用**）

> **⇒ 不要把本节的「安全默认值」当成「目标刊的要求」。**
> **⇒ 它是**拿不到目标刊政策时的兜底**，不是替代品 ——** 本方案**修正二十一（判据必须平台感知）在披露问题上的落点就是这句话。**
> **⇒ 顺序永远是：**先查目标刊 → 查不到才用兜底 → 并把「按兜底做的」记下来以便投稿时核对。****

**⇒ 出处**：本节是**对 §9.11 / §9.11 补 / §9.12 / §9.13 / §9.14 / §9.x 六节的汇总**，**不引入新来源**；各条原始出处见对应小节。**唯一新增**的是 **Springer Nature 那一行在「门槛」轴上的位置**（来自 **§9.x**，Round 109 实抓）。

---

---

## 9.16 ★★★ 修正十六落地：**改写后「大小不变」就是失败信号**（Round 114 补 · 此前只写在方法论里）

> **为什么补这一节**：**Round 114 审计发现**修正十六在维度 09 里没有对应判据** —— 而 09 正是**发生改写的地方**。**
> **⇒ 这条修正必须在这里，因为它是一个**改写操作者当场就能自查的失败信号**。**

### 一、修正十六的原始实证（Round 46→48）

**⇒ 本项目向技能文件**追加第 15 条修正**后，字节数显示 **9,706 —— 与改前完全相同**。**
**⇒ 查下去发现：**那次字符串替换根本没生效**（脚本找到了匹配位置但没有写回，或写到了别处）。**
**⇒ ⇒ 由此得判据：**一次「改写 / 替换 / 追加」操作之后，如果产物的**大小（字节数 / 字数 / 行数）完全不变**，那**首先怀疑操作没生效**，而不是「改得很精妙所以大小一样」。**

**⇒ ★ 注意它的适用边界（否则会误用）**：
**⇒ 这条对**增值型操作**（追加 / 替换 / 扩写）成立；对**等长替换**（把 A 改成等长的 B）不成立。**
**⇒ 所以判据要写成：「大小不变**且**你预期它应该变」⇒ 失败信号。**

### 二、★ 落地判据（**每次改写后当场做**）

| # | 判据 | 做法 |
| --- | --- | --- |
| **1** | **改写前后各记一次「字节数 / 字数」** | 一条命令的事；**不记就没有这条判据** |
| **2** | **★ 预期该变大却不变 ⇒ 按「没生效」处理** | **先回去看替换是否真的落盘**，不要先怀疑自己的判据 |
| **3** | **预期该变小却不变 ⇒ 同上** | 压缩类操作尤其容易「报成功而没写」 |
| **4** | **★ 与维度 09 已有的「改写量」判据**配合用** | §可数清单第 2 条问的是「**改得够不够深**」；**本条问的是「**改了没有**」** —— **先确认发生了，再确认够深** |
| **5** | **★ 批量替换后，抽查至少 3 处实际落点** | 与修正二十三（批量替换的边界不能依赖「下一个」）配合 |

**⇒ ★★ 两条的关系（本节要讲清的一点）：**
**⇒ **修正十六 = 存在性检查**（改了没有）**
**⇒ **可数清单第 2 条 = 充分性检查**（改得够不够）**
**⇒ ⇒ 顺序不能反：**先证存在，再证充分**。**
**⇒ 只做充分性检查时，若操作根本没生效，你会看到「数字数量没上升」—— 而你会去改写法，而不是去查脚本。**

**⇒ 出处**：`playbook/99-methodology.md` 修正十六（原实证见该条）· 本轮审计为 2026-10-08 本机实测。

---
---

## 9.17 ★★★★★ 答辩线的「自我复用」是怎么被制度处理的（**一手实抓 · Round 117**）

> **为什么补这一节**：**Round 116 把「thesis / prior-publication 政策」显式登记为**已知缺口**（对照表第 7 项曾指向一个不存在的第 12 维）。**
> **⇒ 本轮做**一手核实**，拿到了能直接落地的机制描述。**
> **⇒ 但**样本量 = 1 所学校** —— 按本方案**修正十二（核实两本 > 一本）**与**修正二十一（平台感知）**，**本节只描述该校口径，不许写成「各校如此」。****

### 一、★★★ 核心发现：答辩线**有一个专门的指标**来处理「复用自己已发表的内容」

**⇒ 出处（一手，HTTP 200 实抓）**：辽宁科技大学研究生院《研究生送审论文提交及复制比检测常见问题解答》，发布日期 **2026-04-01** —— <https://www.ustl.edu.cn/yjs/info/1070/3524.htm>

**该页原文（照录）**：

> **「去除本人已发表文献复制比」：是指去除作者本人发表的文献后，计算出来的重合字数在总字数中所占的比例。作者本人发表的文献（含二作、三作等）均不计入重合字数。**

**⇒ ★★★ 这条的制度含义（请逐字读，它反直觉）：**
**⇒ **学位论文复用你自己已发表的小论文，在答辩线上有一个**单独的、正式的计算口径** —— 只要在系统里能识别为「本人已发表文献」，它就不计入重合字数。**
**⇒ **⇒ 所以「学位论文与小论文重复」在答辩线上**不是**一条「禁止」，而是**一条「要按对的口径度量」**。**
**⇒ ★ 而**SCI 线没有这个豁免** —— 期刊查重（iThenticate 类）**不区分**「你自己以前的文章」。**
**⇒ ⚠⚠ 【**本句已更正** · 见 §9.19】**本条把「**查重工具的行为**」当成了「**出版政策**」——**Elsevier 官方明确「publication as an academic thesis」不算 prior publication**。**原文保留以为留痕**，正确陈述见 §9.19。**
**⇒ ⇒ 这正是两条线在同一件事上**机制完全不同**的典型：**同一份内容，在答辩线被单独计量，在 SCI 线按普通重复处理。****

### 二、★★ 该页给的四条可执行事实（**都可以直接照做**）

| # | 事实（原文口径） | 对本方案的动作 |
| --- | --- | --- |
| **1** | **查重范围**：除「**封面、目录、独创性声明、学位论文使用授权书、参考文献、脚注**」外，**其他部分均参与查重** | **⇒ 这六项是**不计入**的；**正文、绪论、方法、结果、讨论、结论、致谢全部计入**** |
| **2** | **★ 脚注的例外有上限**：「**脚注不能超过 500 字符，否则将计入正文参与查重**」 | **⇒ 把大段内容塞进脚注来规避查重**行不通**；**脚注 > 500 字符即等同于正文**** |
| **3** | **★ 字数上限**：「查重系统要求学位论文字符数上限为**四十五万**」 | **⇒ 超长学位论文需先确认本校系统的上限（各校不同）**** |
| **4** | **★★★ 报告颜色含义**：**红=文字复制** · **绿=引用（含系统自动识别为引用的部分）** · **棕灰=系统依据作者姓名识别的本人其他文献部分** | **⇒ ★ 「**红色和绿色文字部分，均参与『去除本人已发表文献复制比』的计算**」**** |

**⇒ ★★★ 第 4 条里最反直觉的一点（原文照录）：「**红色和绿色文字部分，均参与『去除本人已发表文献复制比』的计算**」。**
**⇒ 也就是说：**规范的引用（绿色）**并不会**因为你引了就不算重合 —— 它照样进那个比例的计算。**
**⇒ ⇒ 对本方案的含义：**「我都标了引用」不足以降低这个指标**；**真正降低它的，是让系统识别出「这是作者本人的文献」（棕灰色那一类）。****

### 三、★ 顺带拿到的：答辩线**双盲评阅**的去标识化清单（该页第一部分）

| # | 该页原文要求 |
| --- | --- |
| **1** | **学校名称和校徽**：参加双盲评阅**不需要隐去** |
| **2** | **封面**：删除作者姓名与导师姓名；须填一级学科/学位类别、二级学科/学位领域和研究方向；**密级只可写「无」或空白，不可出现「保密」「绝密」** |
| **3** | **论文中须隐去**：作者与导师信息部分；**「学位论文评阅专家及答辩委员会人员信息」页**；**后记/致谢中涉及人名部分均用 XXX 代替**；**★ 在学期间公开发表学术成果须删除成果名称和刊发时间，仅体现期刊名称、期刊级别和作者次序**；博士论文还须删除「导师（组）对学位论文的评语」与「答辩委员会决议书」页 |
| **4** | **格式**：封面用学校统一模板；**目录的格式与内容须与章节信息一致**（避免改了章节却没更新目录）；页码连贯、删除不必要的空白页；**提交前确保无批注/修订内容** |

**⇒ ★ 第 3 项里那条「**在学期间公开发表学术成果须删除成果名称和刊发时间，仅体现期刊名称、期刊级别和作者次序**」值得单独记：**
**⇒ 它是**双盲去标识**与**成果署名**之间的一个精确折中 —— **保留「发表了什么级别的刊、你是第几作者」，删掉「标题和时间」（因为标题会暴露你是谁）。**
**⇒ ⇒ 照此填「在学期间成果」清单时，**标题要删、时间要删、刊名与级别与作者次序要留**。**

### 四、⚠ 证据边界（**本节必须带这一段，否则会被误用**）

| 项 | 状态 |
| --- | --- |
| **样本量** | **1 所学校（辽宁科技大学）· 1 个页面 · 2026-04-01** —— **★ Round 119 补：又取到**东北师范大学**同名文件（HTTP 200，2025-09-16），但机械比对发现**两页锚定段各 858 字符、去空白后逐字完全相同** ⇒ 那是**副本不是第二本**，**独立样本仍为 1**（见修正三十六）** |
| **可否泛化** | **★ 不可以**。本方案**修正二十一（平台感知）**要求判据按平台区分；**各校的复制比口径、豁免项、字符上限、双盲要求均可能不同** |
| **因此本节的用法** | **作为「这一维**长什么样**」的样板与**该问哪些问题**的清单**，**不是**「照这个数填」** |
| **动笔前必做** | **★ 到**你本校**研究生院的学位工作页找同类文件**（关键词：「复制比」「去除本人已发表文献复制比」「双盲评阅」「送审」）；**取不到就按本方案纪律标「未核实」，不要用本节数字代替**** |
| **对照表的缺口状态** | **由「完全未做」改为「**已有一手样板 + 待逐校核实**」** |
| **★「第二本」的尝试（Round 118）** | **两条候选路线均未取得，原因已具名**：台湾教育部 PDF **站点不可达**；台大医院 PDF **已下载 632,384 字节但为 AES-256 加密（`/Filter /Standard /Length 256`）且无 `/ToUnicode`，不可提取**（见维度 04 §4.14）**⇒ 本节的证据仍是 n=1，未凑成「第二本」** |

### 五、★ 本节给本维度加的可执行动作

| # | 动作 | 判据 |
| --- | --- | --- |
| **1** | **写「在学期间成果」前先查本校的复制比口径** | **★ 是否存在「去除本人已发表文献复制比」这一项；若有，它就是答辩线处理自我复用的正式通道** |
| **2** | **别把内容塞脚注** | **该校口径：脚注 > 500 字符即计入正文** |
| **3** | **别以为标了引用就不算重合** | **该校口径：绿色（引用）**同样参与**「去除本人」比例的计算** |
| **4** | **同一份内容投 SCI 前必须重做查重** | **★ 期刊侧**不区分**「你自己以前的文章」—— 答辩线豁免的那部分，在 SCI 线是普通重复** |
| **5** | **双盲提交前按清单去标识** | **删作者/导师 · 删评阅与答辩委员会页 · 致谢人名 XXX · 在学成果删标题与时间（留刊名/级别/作者次序）· 删批注与修订** |

**⇒ 出处**：辽宁科技大学研究生院《研究生送审论文提交及复制比检测常见问题解答》（<https://www.ustl.edu.cn/yjs/info/1070/3524.htm>，**HTTP 200 一手实抓，页面自述发布日期 2026-04-01**）。
**⇒ 未取到**：COPE 立场文件《Publishing material from theses》（<https://publicationethics.org/guidance/cope-position/publishing-material-theses>，**HTTP 403 / Cloudflare**）· 台湾教育部《將學位論文發表成期刊論文時之作法》（**fetch 失败**）· 其余高校文件（多为 PDF，未逐一取）。

---
---

## 9.18 ★★★★★ 第三份（**体裁不同 · 文本不同**）带来了 FAQ 没有的五条硬规定（Round 120）

> **为什么补这一节**：**§9.17 只有一份一手样板（n=1）。Round 119 找到了**第二所学校**的同名文件，机械比对发现**逐字相同**（858 字符全同）⇒ 那是**副本**，n 仍为 1，并据此立了**修正三十六**。**
> **⇒ 本轮按**修正三十六的判据④**执行：要检验「上游统一模板」这个假设，必须找**文本不同**的第三份 —— 且**换体裁**（规则文件而非 FAQ）。**
> **⇒ ★ 结果：找到了，而且它**确实带来了新条款**。这同时正面验证了**修正十二**的核心主张。**

### 一、★ 现在手上是**三份**，但**只有两份是独立样本**

| # | 来源 | 体裁 | 日期 | 文本 |
| --- | --- | --- | --- | --- |
| **1** | **辽宁科技大学**研究生院 | **常见问题解答（FAQ）** | 2026-04-01 | **858 字符锚定段** |
| **2** | **东北师范大学**研究生院 | **常见问题解答（FAQ）** | 2025-09-16 | **★ 与 #1 逐字相同 ⇒ 副本** |
| **3** | **遵义医科大学**研究生院 | **管理办法（规则文件）** | **2024-11-11**（**自 2025-01-01 施行**） | **★ 文本完全不同** |

**⇒ 独立样本数 = **2**（#1 与 #3）。#2 不计（副本）。**

### 二、★★★★★ 第三份带来的五条新规定（**FAQ 里一条都没有**）

| # | 新规定（照录该办法原文） | 为什么重要 |
| --- | --- | --- |
| **1** | **检测系统被指名**：「学校依托**中国知网**『学位论文学术不端行为检测系统』进行检测。」 | **§9.17 那份只说「查重系统」，从未指名 ⇒ 这条把系统落到具体产品上** |
| **2** | **★★★ 三级复制比阈值与处置（FAQ 一个数字都没给）** | **见下方单列** |
| **3** | **提交检测的版本要求**：「提交检测的学位论文电子版应为**只含正文部分**的 PDF 版，须去除**封面、扉页、目录、中英文摘要、参考文献、致谢、附录**等部分。**提交检测的学位论文与拟送审的学位论文应为相同版本**。」 | **★ 「提交检测版 = 送审版」是一条可执行的自查项** |
| **4** | **★★ 免责清单与 FAQ **不一致****（见第三节） | **★ 这是修正二十一（平台感知）在同一国家、同类机构内部的实证** |
| **5** | **规避检测的后果**：「凡弄虚作假、**故意规避**学位论文检测者…**情节严重者将取消其学位申请资格**。」 | **★ 把「故意规避」单列为可处罚行为** |

**⇒ 另有三条附带信息**：**涉密学位论文不进行检测**（保密期内不检测，解密后如查实仍按规定处理）· **由研究生院统一送检** · **本办法自 2025-01-01 起实施**。

### 三、★★★★★ 三级阈值与处置（**本节最可直接落地的一条**）

**⇒ 该办法第七条原文**：

| 复制比 | 处置 |
| --- | --- |
| **≤ 20%** | **视为通过检测，可进行论文送审** |
| **20% ＜ x ≤ 30%** | **须修改，导师审核同意后方可申请复检**；**复检 ≤20% 方可送审**；**复检仍 >20% ⇒ 延期半年复检**，通过后方可送审 |
| **> 30%** | **不受理送审**；**修改不少于半年**，重新检测合格后方可送审 |

**⇒ ★★★ 这条与 §9.17 的「去除本人已发表文献复制比」**是两套不同的东西**：**
**⇒ §9.17 讲的是**指标口径**（哪个比例）；本条讲的是**通过线与处置**（多少算过、不过怎么办）。**
**⇒ ⇒ 两者**必须一起查**：先知道看哪个数，再知道那个数的阈值。**
**⇒ ★ 本节的用法：**20% / 30% 是**该校**的线，**不是全国的线**（见第四节）；但它给出了**阈值存在的形态与三级处置的阶梯** —— 这是「该问什么」的模板。**

### 四、★★★★★ 一份**硬证据**：两校的「不计入复制比」清单**不同**

**⇒ 两份文件对「哪些部分不参与复制比计算」给了**不同的清单****：

| 来源 | 不参与计算的清单（原文口径） |
| --- | --- |
| **§9.17（FAQ）** | **封面、目录、独创性声明、学位论文使用授权书、参考文献、脚注** |
| **本节（管理办法第六条）** | **独创性声明、注释、参考文献、附录、致谢** |

**⇒ ★★★ 两者的**并集与交集都不重合**：**
**⇒ 只有**参考文献**与**独创性声明**两份都列了；**
**⇒ FAQ 独有**：封面 · 目录 · 学位论文使用授权书 · 脚注**
**⇒ 管理办法独有**：注释 · 附录 · 致谢**

**⇒ ⇒ 这条的意义（**本方案修正二十一的又一次实证**）：**
**⇒ **在同一国家、同一类机构（中国大陆高校研究生院）内部，「免责清单」就已经不同。****
**⇒ ⇒ 所以「各校不同，须现查」**不是一句保守套话，而是有实证的** —— 而且差异出现在**最容易被当成全国统一的那一项**上。**
**⇒ ★★ 连带一条**可执行判据**：**不要因为「这两份都是中国高校的文件」就假定它们的免责清单相同**；**清单必须逐校核。****

**⇒ ★ 另外一处口径差异（同样值得记）**：
**⇒ §9.17 说「去除作者本人发表的文献后计算」⇒ **一个单独的指标**；**
**⇒ 本节第六条说「**对引用本人已发表论文的原创性内容，不计入复制比例**」⇒ **口径更宽**（不只是另算一个数，而是**本人原创内容不进那个比例**）。**
**⇒ ⇒ 两条**可能指向同一目的、但不是同一句话** —— 按修正十五（压缩会丢限定语），**不能把后者当成前者的同义改写**。**

### 五、★ 证据边界（**本节的 n 与它支持什么**）

| 项 | 状态 |
| --- | --- |
| **独立来源数** | **2**（辽宁科大 FAQ · 遵义医科大管理办法）；东北师大那份是**副本**，**不计** |
| **★ 两份独立来源是否给了相同结论** | **否** —— **免责清单不同**（第四节）、**口径措辞不同**（第四节末）**⇒ 这正说明「不许泛化」是必要的** |
| **本节支持什么** | **① 答辩线确实存在**具体的复制比阈值与三级处置**（形态已确认）；② **免责清单逐校不同**（有实证）；③ **检测系统可能是知网**（一所学校指名） |
| **本节**不**支持什么** | **✗ 20% / 30% 不是全国通用线**；**✗ 「知网」不是所有学校都用**；**✗ 免责清单不可跨校套用** |
| **动笔前必做** | **★ 到**本校**研究生院找**两类**文件**：**① FAQ 类（看指标口径）② 管理办法类（看阈值与处置）—— **两类都要，因为上述实证显示它们讲的是不同的东西** |

### 六、★ 本节给本维度加的可执行动作

| # | 动作 | 判据 |
| --- | --- | --- |
| **1** | **★ 查两件、不要只查一件** | **指标口径（FAQ 类）+ 阈值处置（管理办法类）** 是**两份**文件 |
| **2** | **★ 把「不计入复制比的部分」逐项抄下本校清单** | **实证：两校清单不重合 ⇒ 不许跨校套用** |
| **3** | **提交检测版要与送审版一致** | **一所学校明确要求「须为相同版本」⇒ 两版分别维护会出问题** |
| **4** | **★ 三级处置决定时间预算** | **>30% ⇒ 修改不少于半年** ⇒ **查重不是临交稿才做的事，是排期约束** |
| **5** | **别「故意规避」** | **一所学校把「故意规避检测」单列，情节严重可取消学位申请资格** |

**⇒ 出处**：遵义医科大学研究生院《研究生学位论文学术不端行为检测管理办法》<https://grs.zmu.edu.cn/info/1055/3575.htm>（**HTTP 200 一手实抓**，页面自述发布时间 **2024-11-11**，办法自 **2025-01-01** 施行）。
**⇒ 另见**：§9.17（辽宁科技大学 FAQ，HTTP 200）· 东北师范大学同名 FAQ（HTTP 200，**与前者逐字相同，判为副本**）。

---
---

## 9.19 ★★★★★ 更正 §9.17：**SCI 线其实也豁免学位论文** —— 我上一轮把「查重机制」与「发表政策」混成了一件（Round 121）

> **为什么补这一节**：**§9.17 我写过一句：「★ 而 SCI 线没有这个豁免 —— 期刊查重（iThenticate 类）不区分『你自己以前的文章』」。**
> **⇒ 本轮取到 **Elsevier 官方**的明确答复，**该句把两件不同的事混成了一件**，必须更正。**
> **⇒ 按本方案纪律：**更正要留痕 —— 原文保留在 §9.17，本节说明错在哪、对的是什么。****

### 一、★★★★★ Elsevier 官方原文（**一手实抓，HTTP 200，页面自述 Last updated on June 01, 2026**）

**出处**：《Which uses of a work does Elsevier view as a form of 'prior publication'?》—— <https://www.elsevier.support/elsevier/answer/which-uses-of-a-work-does-elsevier-view-as-a-form-of-prior-publication>

**照录**：

> **An author should not in general publish manuscripts describing essentially the same research in more than one journal or primary publication. Elsevier does not view the following uses of a work as prior publication: publication in the form of an abstract; publication as an academic thesis; publication as an electronic preprint. Please note that Cell Press, The Lancet, and some society-owned titles have different policies on prior publication.**

**⇒ ★★★ 三个要点：**
**⇒ **① 「publication as an academic thesis」**明确**不算 prior publication**；**
**⇒ **② 摘要（abstract）与电子预印本（electronic preprint）也不算；**
**⇒ **③ ★ 但「Cell Press、The Lancet 及部分学会刊**政策不同**」—— 同一出版社内部就有例外。****

### 二、★ 我的那句话错在哪（**逐字对照**）

| | §9.17 我写的（**原文保留**） | 更正后 |
| --- | --- | --- |
| **陈述** | 「**SCI 线没有这个豁免** —— 期刊查重（iThenticate 类）**不区分**『你自己以前的文章』」 | **两件事必须分开说：① **查重工具**的行为：iThenticate 类**会**把你的旧作标出来；② **期刊政策**：Elsevier **明确**把「作为学位论文发表」**排除在 prior publication 之外**。** |
| **错因** | **把「检测工具的行为」当成了「出版政策」** —— 两者是**不同的对象**，且**可以同时成立**（工具标出来，但政策允许） | **⇒ 正确的合成陈述**：**查重会亮，但政策允许 —— 前提是**你要说明/披露**。** |

**⇒ ★★★ 这条错误的形状（值得记）：**用一个**工具的默认行为**去推断一个**制度的立场**。**
**⇒ 工具的行为是「照字面比对」，制度的立场是「哪些情形不算重复发表」—— **后者必须读政策原文，不能从前者推**。**
**⇒ 与本方案已有修正的关系：**这是**修正十三（换类不换源）的反面误用** —— 我没换源，**直接换了对象**（从「政策」滑到「工具」）。**

### 三、★★★ 两条线的完整对照（**本节的实质产出**）

| | **答辩线** | **SCI 线** |
| --- | --- | --- |
| **「学位论文复用自己已发表内容」是否被允许** | **允许**（有单独的计算口径） | **允许**（**明确不算 prior publication**） |
| **机制** | **一个单独的指标**：**「去除本人已发表文献复制比」**（§9.17，n=1 校） | **一条排除规则**：**「publication as an academic thesis」不在 prior publication 之列**（Elsevier 官方，n=1 出版社） |
| **仍然会亮的地方** | **报告里的**棕灰色**文字**（系统识别的本人其他文献）**仍参与**该比例计算（§9.17） | **iThenticate 类工具**仍然会把旧作标为相似（**工具行为，不等于政策判定**） |
| **因此必须做的事** | **查清本校的指标口径与免责清单**（各校不同，§9.18 有实证） | **★ 在投稿时**说明**该内容已有学位论文版本 —— 这是「披露」而非「隐瞒」** |
| **★ 例外** | **各校免责清单不同**（§9.18 已实证两校不重合） | **★ Cell Press / The Lancet / 部分学会刊**政策不同（**同一出版社内部也有例外**） |

**⇒ ⇒ ★★★ 总结一句（本方案此前没有的一条）**：
**⇒ **两条线都允许「学位论文 → 论文」的复用，但都不允许「不说」。**
**⇒ **答辩线要你**对得上指标**；SCI 线要你**说清楚来源**。**
**⇒ **两条线的共同要求因此是同一个动作：**把「这段内容此前以什么形态存在过」写清楚。****

### 四、★ 本节给本维度加的可执行动作

| # | 动作 | 判据 |
| --- | --- | --- |
| **1** | **★ 不要把「查重会标出来」读成「不允许」** | **Elsevier 官方明确：学位论文 / 摘要 / 预印本**都不算 prior publication** |
| **2** | **★ 但披露义务仍在** | **政策允许 ≠ 可以不说明；投稿时须说明该内容的学位论文版本** |
| **3** | **★ 逐刊核，不要逐出版社核** | **Elsevier 自己声明 Cell Press / The Lancet / 部分学会刊**政策不同**** |
| **4** | **同一份内容的两条线动作不同** | **答辩线：对齐本校指标口径与免责清单 · SCI 线：写清来源与增量** |
| **5** | **★ 别用工具行为推制度立场** | **本节即反例：我从「iThenticate 会标」推成了「SCI 线不豁免」** |

### 五、⚠ 证据边界

| 项 | 状态 |
| --- | --- |
| **来源** | **Elsevier 官方支持页 · HTTP 200 一手实抓 · 页面自述 Last updated on June 01, 2026** |
| **覆盖面** | **★ 这是**一家出版社**的官方口径**（且它自己声明内部有例外）⇒ **不等于「所有期刊都如此」** |
| **与 §9.17/§9.18 的关系** | **§9.17/§9.18 是**答辩线**（中国高校）；本节是**SCI 线**（一家国际出版社）—— **两条线各有一份一手来源，但都不可泛化** |
| **动笔前必做** | **① 到**目标刊**的作者指南找 its prior-publication / duplicate-publication 条款；**② 若是**学会刊或 Cell/Lancet 系**，**额外核一遍** |

**⇒ 出处**：Elsevier Support《Which uses of a work does Elsevier view as a form of 'prior publication'?》<https://www.elsevier.support/elsevier/answer/which-uses-of-a-work-does-elsevier-view-as-a-form-of-prior-publication>（**HTTP 200 一手实抓**，页面自述 **Last updated on June 01, 2026**）。
**⇒ 关联**：**更正对象 = §9.17 那句「SCI 线没有这个豁免」**（原文保留在该节，未删）。

---
---

## 9.20 ★★★★★ 跨体系检验：**术语统一，参数不统一**（Round 122 · 中科院研究所）

> **为什么补这一节**：**§9.17–§9.19 的三份来源里，两份是同名 FAQ（其中一份是副本），一份是另一所高校的规则 —— **都还在内地高校**这个体系内。**
> **⇒ 本轮做**跨体系**检验：取一份**研究机构**（中国科学院昆明动物研究所）的通知 —— 它走的是**中国科学院大学**的培养系统，与三所高校**不是同一体系**。**
> **⇒ 结果：它**既**支持了 Round 119 那个待验假设，**又**推翻了它的另一半** —— 这比「统一 / 不统一」的二选一**精确得多**。**

### 一、★ 来源（**一手实抓**）

**⇒ 中国科学院昆明动物研究所研究生处《关于做好 2026 年冬季批次研究生学位论文查重及盲审工作的通知》**
**⇒ <https://www.kiz.ac.cn/yjsjy/tzgg/202510/t20251009_7985235.html>**（**HTTP 200 一手实抓**，页面自述 **2025-10-09**）

### 二、★★★★★ 术语：**第四份也用它** ⇒ 待验假设的「统一」那一半**得到支持**

**⇒ 该通知原文**：「学位论文检测系统使用**中国科学院大学指定的学位论文检测系统**，重复率要求**去除本人已发表文献复制比**后，学位论文文本复制比应低于 10%，否则不予送审。」

**⇒ ★★★ 关键：「去除本人已发表文献复制比」这个**术语**，现在出现在：**
**⇒ ① 辽宁科技大学 FAQ · ② 东北师范大学 FAQ（副本）· ③ 遵义医科大学管理办法 · ④ 中科院昆明动物所通知**
**⇒ ⇒ **四个来源、三种机构（两所高校 + 一所研究机构 + 一份副本）都用了同一个术语** ⇒ **这强烈支持 Round 119 的假设：该指标名可能是上游统一的。****

### 三、★★★★★ 但参数：**每一处都不一样** ⇒ 假设的「统一」那一半**被推翻**

| 参数 | 辽宁科大 / 东北师大（FAQ） | 遵义医科大（管理办法） | **中科院昆明动物所（本通知）** |
| --- | --- | --- | --- |
| **通过线** | **未给数字** | **≤20% 通过**；20–30% 修改复检；**>30% 不受理** | **★ <10% 才送审**（单一硬线） |
| **★ 两者相差** | — | **20%** | **10%** | ⇒ **差一倍** |
| **上传** | **只含正文的 PDF** | **只含正文的 PDF** | **★ 上传【全文】**（参考文献格式正确则**自动略去**） |
| **★ 操作相反** | — | **删到只剩正文** | **传全文，靠系统略去** |
| **上限的度量对象** | **四十五万字符** | — | **★ 70M（文件大小）** |
| **★ 度量对象不同** | **字符数** | — | **字节数** |
| **去标识方式** | **人名用 XXX 代替** | — | **★ 用「□□□」代替；封面姓名用学号代替** |
| **两次不合格的后果** | 未给 | **>30% 须改不少于半年** | **★ 两次仍不合格 ⇒ 终止本次送审；已达最长年限 ⇒ 按退学处理** |
| **检测系统** | 未指名 | **中国知网** | **中国科学院大学指定的检测系统** |

**⇒ ⇒ ★★★ 结论（本节的实质产出）：**
**⇒ **术语：可能统一**（四来源同术语）；**
**⇒ **参数：绝不统一**（通过线 10% vs 20% · 上传全文 vs 只含正文 · 文件大小 vs 字符数 · □□□+学号 vs XXX）。**

**⇒ ★★★★ 这比 Round 119 的「统一 / 不统一」二选一**精确得多**，而且**直接可执行**：**
**⇒ **可以照抄的只有**术语**（问的时候用对词）；**
**⇒ **必须现查的是**每一个参数**（通过线 · 上传形态 · 上限的度量 · 去标识方式 · 不合格后果）。****

### 四、★ 本通知独有的其他可执行事实

| # | 事实（原文口径） | 用途 |
| --- | --- | --- |
| **1** | **★ 送审前置条件**：「已通过预答辩、拟申请毕业、学位的研究生…**除已达最长年限的博士生外，其余博士生必须要有科研成果**」 | **博士毕业的硬前提** |
| **2** | **★ 查重时机**：「**在学位论文评阅前**进行学位论文查重」 | **排期：查重在评阅之前，不是答辩之前** |
| **3** | **★ 查重材料**：「查重报告**只需打印「章节报告」**即可」 | **交材料的具体形态** |
| **4** | **★ 盲审去标识**：「对研究生和导师姓名、**在学期间发表学术论文清单**、致谢等**可追溯**研究生、导师信息的内容进行隐匿处理（以符号「□□□」代替，**封面上的本人姓名用学号代替**）」 | **★ 覆盖面比 §9.17 那份更宽：它点名「在学期间发表学术论文清单」也要隐匿** |
| **5** | **盲审意见四级与终止规则**：「同意答辩 / 修改后答辩 / 修改后评阅 / 不同意答辩」；**累计 2 位及以上评阅人给「修改后评阅」，或有 1 位给「不同意答辩」⇒ 终止本次答辩程序** | **★ 可预判的风险门槛** |
| **6** | **盲审专家规则**：一般**至少三位**同行专家；**同一篇论文的评审专家来自同一单位的原则上不超过 2 人**；**导师不得打听评审专家信息，不得对评审施加影响**；导师可推荐 5–7 名候选人 | **了解流程与回避规则** |
| **7** | **延迟公开论文**：需**线下评审**，提交三份纸质胶装盲审版，**系统里保留到目录页** | **保密/延迟公开的特殊通道** |

### 五、★ 证据边界（**本节把 §9.17–§9.20 四份来源的边界一次说清**）

| 项 | 状态 |
| --- | --- |
| **独立来源数** | **3**（辽宁科大 FAQ · 遵义医科大管理办法 · 中科院昆明动物所通知）；东北师大那份是**副本**，**不计** |
| **机构类型覆盖** | **2 所内地高校 + 1 个中科院研究所** ⇒ **比前几轮多了一个体系** |
| **★ 四份是否一致** | **术语一致；参数全不一致**（见第三节表） |
| **本节支持什么** | **① 该指标名可能是上游统一的（术语层面，4 来源同）；② 参数**逐机构不同**（跨体系也如此，且差异可达一倍）** |
| **本节**不**支持什么** | **✗ 10% 不是通用线（它是这个所的）；✗ 「传全文」不是通用做法；✗ 也不能说「内地高校都比研究所松」（样本不足以支持这种方向性结论）** |
| **动笔前必做** | **★ 按**术语**去搜（搜「去除本人已发表文献复制比」命中率高），但**按参数逐项核**（通过线 / 上传形态 / 上限度量 / 去标识 / 不合格后果）** |

### 六、★ 本节给本维度加的可执行动作

| # | 动作 | 判据 |
| --- | --- | --- |
| **1** | **★ 查的时候用对术语** | **搜「**去除本人已发表文献复制比**」比搜「查重」命中率高得多（四来源都用这个词）** |
| **2** | **★ 但绝不照搬数字** | **实测：同样的指标名，通过线从 10% 到 20% 不等** |
| **3** | **★ 先确认「传全文还是传正文」** | **实测两份要求相反** —— 传错形态可能直接退回 |
| **4** | **★ 确认上限是**字符数**还是**文件大小**** | **实测两种都有（四十五万字符 / 70M）** |
| **5** | **★ 确认去标识的确切形式** | **实测至少有 XXX 与「□□□ + 学号代替封面姓名」两种** |
| **6** | **★ 确认「查重不合格」的后果** | **实测有「延期半年」「终止本次送审」「达最长年限按退学处理」三种** |
| **7** | **查重在评阅之前** | **一所机构明确「在学位论文评阅前进行」⇒ 不能等到答辩前才做** |

**⇒ 出处**：中国科学院昆明动物研究所研究生处《关于做好 2026 年冬季批次研究生学位论文查重及盲审工作的通知》<https://www.kiz.ac.cn/yjsjy/tzgg/202510/t20251009_7985235.html>（**HTTP 200 一手实抓**，页面自述 **2025-10-09**）。
**⇒ 本节与 §9.17/§9.18/§9.19 合起来构成「学位论文 → 论文」这条线的完整证据集**：**答辩线 3 个独立来源（跨两体系）+ SCI 线 1 个官方来源；术语统一、参数逐机构不同、两条线都允许复用但都不允许不说。**

---

## 9.21 ★★★★ **信息缺失必须显式占位：AI 生成时「不许编，只许标」**（采纳自 B 站精读 #3 · 2026-10-11）

> **★ 来源与采纳纪律**：本条采纳自 B 站视频《Codex 学术写作一个晚上一个奇迹》（`BV1uLhB6iEx5`，2026-09-21，497 播放）第 **f002** 帧展示的指令原文。
> **★★ 落地前先做了覆盖度核查**（这是本轮被"声称≠实物"咬过一次之后立的纪律）：本方案全文检索 `待补充` **命中 0** ⇒ **确为缺口**，故落地。
> **⇒ 同批另两条候选经核查**不采纳**，理由一并记下**：① 综述「国外研究现状 → 国内研究现状 → 研究述评」——本方案已定为「**按主题 / 机制线索聚合，不按时间罗列**」（§5 四），且该三段式属**答辩线体例**（见两线差异对照表）；② 讨论「数据展示 → 结果解读 → 现象分析 → 规律总结」——本方案要求的是「**观察–对比–解释–边界**」四步，**多出「边界」这一步**，比它强，故不替换。

### 一、原始指令（照录视频画面 f002）

```
你现在是专业学术科研写作助手…所有写作内容不编造数据、不虚构文献、不夸大研究成果，
无主观臆断、无口语化表达、无网络话术…信息缺失处统一标注【待补充】，绝不自行编造。
工作边界：仅基于用户提供的研究素材、文献、数据、课题方向创作…
严禁虚假引用、虚假实验结果、虚假研究背景。
```

（对应英文段：`Mark missing information with [To Be Supplemented] instead of making up content` / `No false citations…`）

### 二、★ 为什么这一条值得单列

**⇒ 它不是「不要编造」的又一次重复，而是给出了**可机械检查的失败形态**：**

**⇒ 「编造」是不可观测的**意图**；而「本该缺的地方出现了完整内容」是可观测的**事实**。**

**⇒ ⇒ 判据（可机械执行）**：**凡是你没有提供输入的位置（缺数据 / 缺文献 / 缺参数），输出里必须出现占位标记**；**若某处「什么都有」而你并没有给它任何输入 ⇒ 那就是编造的现场。**

| 判据 | 操作 | 不合格形态 |
| --- | --- | --- |
| **① 输入-输出对账** | 列出你**实际提供**的素材（数据文件、文献题录、参数值），逐项检查输出里对应的数字 / 引用是否**都能回指到某个输入** | 输出里出现了你没给过的数值、卷期页码、实验条件 |
| **② 占位必须出现** | 没有输入的位置**必须留下占位**（本方案沿用【须查证】；**AI 生成场景下用【待补充】**） | 通篇无占位 ⇒ 要么你真的全有输入，要么你在编 |
| **③ 占位的下游纪律** | 占位符**不得被静默删除** —— 删占位等于把「不知道」改写成「已知」 | 定稿时占位被抹掉，却无对应补充证据 |

- [ ] 凡 AI 起草的段落，交付前已做「**输入-输出对账**」：输出里每个数字 / 引用都能回指到一份**实际提供过**的输入；没有输入的位置**留有占位标记**。

### 三、与既有条目的关系

- **与本方案「数字来源图例」（【已核实】/【作者判断】/【须查证】/【逻辑必然】）的关系**：图例管的是**方案自己写的每句话的来源**；本节的【待补充】管的是**AI 生成时的空缺** —— **同一套标注纪律的两个使用场景**。
- **与修正三十四（手写计数会漂）同族**：**都是「缺失不被显式表达 ⇒ 下游把它当成已知」**。
- **与 §10 学术诚信红线的关系**：本节是**那条红线的可操作形式**。
- **⚠ 一条诚实的边界**：本条**只防「编」，不防「错」** —— 你给错它的，它照错写。故仍须 §9.11 / §9.14 的披露纪律与人工核验。

### 四、本节给本维度加的可执行动作

**⇒ ① 凡用 AI 起草的段落，交付前跑一次「输入-输出对账」（§二 判据 ①）；**
**⇒ ② 占位符在定稿检查表里**单列一行**，删占位必须有对应的补充证据。**

---

> **【两线差异索引】** 本维度在【答辩线】与【SCI 线】上的具体差异，见 [`两条线差异对照表.md`](../两条线差异对照表.md) 的「**## 09 降重与降 AI 率**」一节。
> **★ 本维度此前未在此处标注两线差异**（Round 24 机械审计发现 11 个维度只有 2 个有标注）；差异集中在对照表，**动笔前先看那一节**。
