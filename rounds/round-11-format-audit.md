# 格式与规范审（Round 10 修正案的「前半」）

> **这一半 AI 能做、已做**。它证明的是「**形式合格**」，**不是「照做能得到好论文」**。
> 核对对象：`论文写作填空模板.md`。依据来自已检索到的一手材料（`sources/README.md`）。

---

## 一、逐项核对

| # | 模板里的做法 | 依据（真实来源） | 结论 |
| --- | --- | --- | --- |
| 1 | 图注要求写 n + SD/SEM + 检验方法 + 校正方式 | [AHA/ASA Statistical Recommendations](https://www.ahajournals.org/statistical-recommendations) 明确要求统计方法可复现 | ✅ **有依据** |
| 2 | 报告效应量与 95%CI（不只 p） | 同上；[Nature · Improving statistical reporting](https://www.nature.com/articles/s44271-025-00356-w) 要求统计描述到可复现 | ✅ **有依据** |
| 3 | 图像处理只做全局调整并声明 | [Nature · Image integrity and standards](https://www.nature.com/npjoceansustain/for-authors-and-referees/about/editorial-policies/image-integrity)；[日本 AMED 图像处理指南](https://www.amed.go.jp/content/000150365.pdf) | ✅ **有依据** |
| 4 | 数据可得性声明须与真实限制一致 | [AIP Data Availability 政策](https://publishing.aip.org/wp-content/uploads/2023/10/AIPP-DataAvailability-Jan2020-003.pdf)；[BMJ 数据共享政策更新](https://www.bmjchina.com.cn/News/Companynews/2025/0222/2040.html) | ✅ **有依据** |
| 5 | 声明段要齐（作者贡献/基金/利益冲突/致谢） | [Springer 公开评审实例：作者被要求补 Consent for publication 段](https://static-content.springer.com/openpeerreview/art%3A10.1186%2Fs12894-025-01829-0/12894_2025_1829_AuthorComment_V4.pdf) | ✅ **有依据（真实补件案例）** |
| 6 | 图件分辨率按目标刊要求（**模板未写具体 dpi**） | [Elsevier Artwork FAQ](https://www.elsevier.com/about/policies-and-standards/author/artwork-and-media-instructions/artwork-faq)；[Elsevier 期刊实例：halftone 最低 300 dpi](https://www.elsevier.com/journals/arthroscopy-techniques/2212-6287) | ✅ **模板的「不写死数字、要求查证」是对的** |
| 7 | 查重须用学校/期刊**指定系统** | 本方案维度 09（依据清华 AI 使用指导原则等的合规要求） | ✅ **有依据** |
| 8 | AI 使用如实声明 | 同上 | ✅ **有依据** |

## 二、★ 核对中发现的两个问题

### 问题 1：模板给的「图注模板」是**示例**，不是**通用格式**

模板写的是：`数据为 mean ± SD，n = ___ 个独立批次；单因素方差分析 + Tukey HSD…`

**核对结论**：**内容要素（n + 离散度类型 + 检验名 + 校正 + 显著性水平）是有依据的**（见上表第 1 项）；
**但这个句式本身只是示例** —— 不同期刊对显著性符号、单位、小数点位数另有规定。

**⇒ 已在模板中保留该句，但必须补一句限定。**（下节执行）

### 问题 2：模板缺一条**投稿系统行为**的要求

核对 AIP / Elsevier 材料时注意到：**图件在上传时会经过系统检查**（分辨率、格式、颜色模式），
**不符合会在提交环节被拦下** —— 这类失败**发生在投稿当天，而不是写作时**。

**⇒ 模板的「交稿前检查」里应加一条：提前用目标刊的图件要求把图导出成投稿格式，不要等投稿当天。**（下节执行）

## 三、据此对模板做了两处修补

1. 图注模板前加限定：**「★ 这是示例句式；显著性符号、小数位、单位以目标刊为准」**
2. 交稿前检查「图像」一行加：**「图件已按目标刊要求导出（分辨率/格式/颜色模式），并已在投稿系统试过一次上传」**

## 四、★ 这一半能证明与不能证明的

| | |
| --- | --- |
| **能证明** | 模板要求的每一项**都有真实来源**（8/8 有依据），不是凭感觉写的；且规格数字**统一写成「须查证」而非硬性数字** |
| **不能证明** | **照这个模板填出来的论文是好论文** —— 那需要真实数据与真实写作过程 |
| **也不能证明** | 模板**填空顺序**（先结果后引言）在实际写作中一定顺 —— 这有待 `试点任务单.md` 反馈 |

> **这正是方案自己写在 README 里的那条限定：覆盖率/完备度是「完备性指标」，不是「严谨性指标」。**
> **本报告属于「完备性」侧的证据，不能冒充有效性证据。**

## 五、未核实项（如实标注）

- 各目标刊**投稿系统**的图件预检规则细节（仅据 AIP/Elsevier 政策页与期刊实例推断行为）
- 模板里的字数区间（150–250 词 / 300–500 字）**未逐刊核实**，模板已标「须查证」
- 显著性符号的具体约定（`*` vs 小写字母 vs 其他）**各刊不同，未逐一核实**
