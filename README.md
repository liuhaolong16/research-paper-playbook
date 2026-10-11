# 科研论文写作 Playbook

> 毕业答辩论文 + SCI 论文**双目标**的全流程写作方法论：**11 个维度 · 14 道机器门 · 138 条投稿前检查表**。
> 不是理论介绍——每个维度都带**判据、硬伤清单、执行清单**，且检查表与门禁**可以机械跑**。

## 它解决什么问题

论文被拒/被退改，多数不是「写得不好」，而是几类固定的伤：

| 常见伤 | 本方案对应 |
| --- | --- |
| 创新点说不清、与已有工作分不开 | 维度 01 选题（创新矩阵 · PBME · 锚定 SOTA 单点突破） |
| 逻辑不闭环（问题↔方法↔发现↔解读断链） | 维度 02 框架（反向大纲法 · 四列 RQ 对号表 · 每节目的句） |
| 引用不实、格式不合规、假引用 | 维度 05 参考文献（GB/T 7714—2025 全 15 类矩阵 · 错引四类 · 撤稿核查 · **§5.18 引用↔主张对齐**） |
| 结果没有方差、基线过旧、无消融 | 维度 10 统计（实验噪声门：≥3 seed / mean±std / 配对检验） |
| 图表可复现性差、图像裁切与篡改 | 维度 11 图像完整性（含**确定性取证七查**规格） |
| AI 率与合规红线、答辩被质询 | 维度 09 降重与降 AI 率（含 2026 各刊 AI 政策矩阵 + 逐环节合规手册） |
| 投稿材料缺件、格式返工 | 顶层《期刊投稿要求核实清单》《投稿前总检查表》 |
| 答辩被问住、PPT 讲不清 | 维度 03 §3.13（问答对抗题库 · 演练 · PPT 六条） |

## 目录结构

```
research/                     11 个维度源文件（判据的唯一权威源）
├── 01-topic-selection.md     选题与创新定位
├── 02-framework.md           框架（含 §十一 框架搭建四道机械检查）
├── 03-structure.md           结构（含 §3.12 排版三边界 · §3.13 答辩问答/演练/PPT）
├── 04-databases.md           数据库与证据评价（含 §4.19 证据双轴分级）
├── 05-references.md          参考文献与著录（GB/T 7714—2025 · 15 类矩阵 · §5.18 引用↔主张对齐）
├── 06-content.md             内容写作（含 §6.13 成稿层不新增判断或引用）
├── 07-abstract.md            摘要与标题
├── 08-writing-style.md       写法与投稿信
├── 09-dedup-and-ai-rate.md   降重 / 降 AI 率 / AI 合规
├── 10-statistics.md          统计与实验噪声门（§10.13 · §10.14 数字三点映射）
└── 11-image-integrity.md     图像完整性（§11.13 确定性取证七查）
playbook/                     合成层与方法论
├── 01-master-playbook.md     总手册
├── 99-methodology.md         方法论修正（判据质量十七条等）
└── 03-peer-adoptions.md      外部方案与开源资产采纳台账（含覆盖度审计与不采纳理由）
投稿前总检查表.md              138 条（由源文件机械生成，可 --check 对账）
科研论文写作方案-完整版.md      单文件完整版
代写执行契约.md                谁给什么、产出什么、何时必须回头问
一页速查.md / 两条线差异对照表.md / 期刊投稿要求核实清单.md
_gate-registry.cjs 等          14 道机器门与构建工具（Node，无第三方依赖）
third_party/                  第三方资产（含许可与 NOTICE）
rounds/ sources/ figkit/      迭代记录 · 取材台账 · 图表工具
```

## 快速开始

```bash
# 1) 全门自检（无依赖，Node 18+）
node _gate-registry.cjs --run
#   → 通过 14 · 失败 0 · 跳过 2

# 2) 重建总检查表并对账
node _build-checklist.cjs
node _build-checklist.cjs --check

# 3) 生成单文件完整版
node _build-full.cjs
```

**改内容后的固定顺序**：改 `research/*.md` → `_build-checklist.cjs` → `_build-full.cjs` → `_src-snapshot.cjs` → `_gate-registry.cjs --run`（顺序颠倒会报 stale / 字节失配）。

## 14 道门是什么

| 门 | 作用 |
| --- | --- |
| `_verify` | 维度进度表字节数、四标签图例、结构与源文件一致性 |
| `_build-checklist` | 总检查表与源文件**同步性**（138 条 · 11 维） |
| `_verify-pos` | 含否定词的验收项必须有**正向可观察**等价表述 |
| `_sections` | 章节编号与结构完整性 |
| `_gate-matrix` / `_baseline-control` | 判据矩阵与基线对照 |
| `_src-snapshot` | 源文件快照自证（逐文件哈希，防漂移） |
| `_assertions-digest` / `_digest-revtest` | 断言摘要与反向测试（防「说了没做」） |
| **`_gate-claim-anchor`** | **第 14 道门：引用与主张对齐**（五类阻断 + 两类提示；注册表跑其自检，真实稿子另跑 `--draft`） |
| `_branch-test` / `_landing-check` / `_tempfile-ledger` / `_check-residue` | 分支口径、落点、临时文件、残留清扫 |

> 门禁的设计原则：**验证有效性的标准是「修复之前跑它是否会失败」**——不会失败的门等于没有门。

## 第 14 道门怎么用

```bash
node _gate-claim-anchor.cjs --selftest          # 门模式：7 组夹具（1 干净件 + 6 注入件）
node _gate-claim-anchor.cjs --calibrate         # 校准：逐类命中率 + FNR/FPR + 样本量声明
node _gate-claim-anchor.cjs --draft <稿子.md> --anchors <锚点表.json> [--manifest <预注册.json>] [--report <输出.json>]
```

**五类阻断**：`fabricated-reference`（标识符不可解析）· `anchorless`（引用无 locator）· `claim-not-supported`（强度词未被 scope 覆盖 / 证据层级越权 / PARTIAL 无分解）· `negative-constraint-violation`（撤稿·预印本当既定事实）· `constraint-violation-uncited`（无引用句命中禁用表述）。
**两类提示**：`uncited_assertion` · `claim_drift`（含 `EMITTED_NOT_SUPPORTED`：**「引了它」不等于「它支撑了」**）。
**它不做的事**：不判「原文是否真这么说」——那仍需人读原文；机械全过的条目会列进 `NEEDS_READ`，不冒充判定。格式与边界见 `_refs/claim-anchor-format.md`。

## 使用方式（三种）

1. **稿件体检**：跑门禁 → 对照 138 条检查表 → 按维度出待修项。
2. **带写**：按《代写执行契约》先确认「最小输入集」（方向 / 目标刊 / 语言 / 现有材料），再走六阶段：选题定位 → 框架 → 检索文献 → 实验数据 → 写作规范 → 答辩投稿。
3. **查规范**：GB/T 7714—2025 著录、各刊格式与 AI 政策，见维度 05 / 09 与《期刊投稿要求核实清单》。

## 边界与免责

- **不代写核心研究内容**：研究设计、数据、结论由作者负责。AI 使用口径见维度 09。
- **不做效果承诺**：机制均标来源与证据等级；无来源者标【须查证】/【作者判断】。
- **标准与期刊规则会变**：GB/T、各刊 Guide for Authors 以**当前官方文本**为准；本仓库给的是**核实记录与核实方法**。标准条文引用仅供格式核对参考，著作权归标准出版方。
- **第三方资产**：`third_party/` 下的文件为上游作者作品（**CC BY-NC 4.0，仅非商业使用**），不适用本仓库的 MIT 许可；署名与边界见 `third_party/README.md` 与各自的 NOTICE。本仓库的机械实现（如 `_gate-claim-anchor.cjs`）是对机制的独立描述，仍为 MIT。
- **与外部同题方案的关系**：本方案与一份独立维护的同题方案互相对拍（采纳台账见 `playbook/03-peer-adoptions.md`，含逐条行号与不采纳理由）。

## License

MIT（见 `LICENSE`），`third_party/` 除外。
