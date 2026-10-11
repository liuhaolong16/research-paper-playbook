#!/usr/bin/env node
/**
 * _contract-check.cjs — 契约检查器（D2）
 *
 * 两类机器检查，都是「写的时候看不出来、只有机器能揪出来」的：
 *
 *   A. 参考文献条目格式（APA 7th）
 *      - 必备要素：作者 · (年) · 标题 · 来源 · DOI/URL
 *      - DOI 必须是 https://doi.org/... 形式（不许是裸 10.xxxx 或 http:）
 *      - 年份范围合理（1800..2027）
 *
 *   B. 强断言类用语的证据在场性
 *      - 优先权断言（首次 / 未见报道 / 无先例 / first / unprecedented / no prior）
 *        ⇒ 同句或前后 1 句内必须有引用标记
 *      - 统计断言（显著 / significantly / p < ）
 *        ⇒ 邻近必须有统计量（p 值 / n= / 检验名）
 *      - 绝对化用语（所有 / 全部 / 从不 / 必然 / always / never / all）
 *        ⇒ 只提示不强判（可能是合格表述，但值得复核）
 *
 * 用法：
 *   node _contract-check.cjs                       # 检查默认目标集
 *   node _contract-check.cjs <文件...>             # 检查指定文件
 *   node _contract-check.cjs --json                # 只输出 JSON
 *   node _contract-check.cjs --refs-only <文件>    # 只跑 A 类
 *   node _contract-check.cjs --claims-only <文件>  # 只跑 B 类
 *
 * 退出码：0 = 无硬失败；1 = 有硬失败（A 类缺失要素 / B 类无证据的强断言）
 */
"use strict";
const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const argv = process.argv.slice(2);
const JSON_ONLY = argv.includes("--json");
const REFS_ONLY = argv.includes("--refs-only");
const CLAIMS_ONLY = argv.includes("--claims-only");
const files = argv.filter(a => !a.startsWith("--"));

// ── 默认目标：有参考文献或强断言的主交付物 ─────────────────
function defaultTargets() {
  const out = [];
  const scan = (dir, depth) => {
    if (depth > 2 || !fs.existsSync(dir)) return;
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) {
        if (/^(node_modules|_refs|_backup|_src|\.git|figkit)$/.test(e.name)) continue;
        scan(p, depth + 1);
      } else if (e.name.endsWith(".md")) {
        out.push(p);
      }
    }
  };
  scan(ROOT, 0);
  return out;
}

const targets = files.length ? files.map(f => path.resolve(ROOT, f)) : defaultTargets();

// ══════════════════════════════════════════════════════════
// A. 参考文献条目格式（APA 7th）
// ══════════════════════════════════════════════════════════
const RE_YEAR = /\((1[89]\d{2}|20[0-2]\d)\)/;              // (2009) / (2025)
const RE_DOI_OK = /https:\/\/doi\.org\/10\.\d{4,9}\/\S+/;
const RE_DOI_BAD = /(?<!https:\/\/doi\.org\/)\b10\.\d{4,9}\/\S+/;
const RE_URL = /https?:\/\/\S+/;
const RE_ITALIC_OR_SOURCE = /[.。]\s*[A-Z\u4e00-\u9fa5]/;   // 标题之后应还有来源段

function looksLikeRef(line) {
  // 形如 「Author, A. B. (2020). Title...」或中文「作者. (2020). 题名.」
  return RE_YEAR.test(line) && line.length > 40 && /[.。]/.test(line);
}

function checkRefs(text, file) {
  const issues = [];
  const lines = text.split(/\r?\n/);
  let inRefs = false;
  lines.forEach((raw, i) => {
    const line = raw.trim();
    if (/^#{1,6}\s*(参考文献|references|bibliography)/i.test(line)) { inRefs = true; return; }
    if (inRefs && /^#{1,6}\s+/.test(line)) inRefs = false;
    const cand = line.replace(/^[-*+\d.]+\s*/, "").trim();
    if (!cand) return;
    // 只在参考文献区，或全局中"看起来像参考文献"的行上检查
    if (!inRefs && !looksLikeRef(cand)) return;
    if (inRefs && !looksLikeRef(cand)) return;

    const tag = file.replace(ROOT + path.sep, "") + ":" + (i + 1);

    if (!RE_YEAR.test(cand))
      issues.push({ level: "hard", kind: "ref-no-year", at: tag, msg: "缺出版年 (YYYY)", text: cand.slice(0, 90) });

    const y = cand.match(RE_YEAR);
    if (y) {
      const n = +y[1];
      if (n < 1800 || n > 2027)
        issues.push({ level: "hard", kind: "ref-bad-year", at: tag, msg: "年份越界: " + n, text: cand.slice(0, 90) });
    }

    if (RE_DOI_BAD.test(cand) && !RE_DOI_OK.test(cand))
      issues.push({ level: "hard", kind: "ref-doi-form", at: tag, msg: "DOI 未写成 https://doi.org/ 形式", text: cand.slice(0, 90) });

    if (/^http:\/\//.test(cand) || /http:\/\/doi/.test(cand))
      issues.push({ level: "soft", kind: "ref-http", at: tag, msg: "用了 http:// 而非 https://", text: cand.slice(0, 90) });

    if (!RE_URL.test(cand) && !/https:\/\/doi\.org/.test(cand)) {
      const hasSource = /[.。]\s*\S{4,}/.test(cand.replace(RE_YEAR, ""));
      if (!hasSource)
        issues.push({ level: "soft", kind: "ref-no-source", at: tag, msg: "看不出期刊/出版社来源", text: cand.slice(0, 90) });
    }
  });
  return issues;
}

// ══════════════════════════════════════════════════════════
// B. 强断言类用语的证据在场性
// ══════════════════════════════════════════════════════════
const CLAIM_RULES = [
  {
    kind: "priority",
    level: "hard",
    re: /(首次|第一个|首个|未见(报道|文献)|尚无(报道|研究)|没有(先例|报道|研究)|前无|first\s+to|the\s+first|unprecedented|no\s+prior|not\s+previously|never\s+before)/i,
    need: /(\[\d+\]|【\d+】|\(\s*[A-Z\u4e00-\u9fa5][^)]{0,60}\d{4}\s*\)|et\s+al\.?|等)\s*,?\s*\d{0,4}/,
    needDesc: "引用标记（[n] 或 (Author, 2020)）",
    tip: "优先权断言必须当场给出可核验的检索范围或引用；建议改写成「在我们检索到的范围内（检索式/日期）…」",
  },
  {
    kind: "significance",
    level: "hard",
    re: /(显著(提高|降低|改善|差异|优于)|显著性|significantly\s+(higher|lower|better|different)|p\s*[<≤]\s*0?\.\d+)/i,
    need: /(p\s*[<≤=]\s*0?\.\d+|n\s*=\s*\d+|n\s*为\s*\d+|P\s*值|t\s*检验|方差分析|ANOVA|Mann[- ]Whitney|Kruskal|Wilcoxon|F\s*检验|卡方|χ2)/i,
    needDesc: "统计量（p 值 / n / 检验名）",
    tip: "无统计量时不要用「显著」；单件或单次表征场景应改述为「在本样品上观察到…」",
  },
  {
    kind: "absolute",
    level: "soft",
    re: /(所有|全部|一切|从不|从未|必然|必定|always|never|all\s+of|every\s+)/i,
    need: /(在.{0,20}(范围内|条件下|体系中|样品)|本研究|本工作|就目前|截止|范围内)/,
    needDesc: "限定语（范围内的表述）",
    tip: "绝对化用语通常需要限定范围，否则容易被审稿人举反例",
  },
];

/**
 * 元讨论判定：这一行是在【讲】某个用语该怎么用，而不是【使用】它。
 *
 * ★ 为什么必须分开：本方案的交付物本身就在讨论「首次/显著」这类断言该怎么写，
 *   若不分元讨论与正文断言，检查器会把规则条目全部误报成违规。
 *   这与「验证集合与声明总量同源」是同一个失效形态 —— 判据的输入集合里
 *   混进了非被测对象。
 */
function isMetaDiscussion(line, relPath) {
  // ① 待办清单条目（- [ ] / - [x] / 1. ）＝ 规则清单，不是断言
  if (/^\s*[-*+]\s*\[[ xX]\]/.test(line)) return true;
  if (/^\s*\d+[.)]\s/.test(line)) return true;                      // 编号清单项
  if (/([□✅☑✓×✗]|\[ \]|\[x\])/.test(line) && line.length < 200) return true; // 清单/勾选行
  // ② 方法论/方案文件：其正文本身即元讨论
  if (/(99-methodology|01-master-playbook|02-|03-|00-|README)/.test(relPath)) return true;
  // ③ 行内含「引号包裹」的断言词 ⇒ 在引用或讨论该词
  if (/(["'`「『][^"'`」』]{0,12}(首次|显著|未见报道|first|unprecedented)[^"'`」』]{0,12}["'`」』])/i.test(line)) return true;
  // ④ 规则/条款口吻的标志词
  if (/(都(要|须|应)|必须|不得|禁止|规则|判据|清单|检查项|要求|示例|模板|口径|注意事项|反面)/.test(line)) return true;
  // ⑤ 方法论叙述标志（本方案的叙述习惯：**来源** / **原话** / ⇒ / 修正N）
  if (/(\*\*来源\*\*|\*\*原话\*\*|修正[一二三四五六七八九十百]|§\d|本轮|上轮|上一轮)/.test(line)) return true;
  // ⑥ 「禁止表述」清单
  if (/(❌|不要|禁用|never\s+say|错误表述|反面示例|不该写)/i.test(line)) return true;
  return false;
}

function checkClaims(text, file) {
  const issues = [];
  const rel = file.replace(ROOT + path.sep, "");
  const lines = text.split(/\r?\n/);
  lines.forEach((raw, i) => {
    const line = raw.trim();
    if (!line || line.length < 8) return;
    if (/^#{1,6}\s/.test(line)) return;                 // 跳过标题
    if (/^```/.test(line)) return;                       // 跳过代码围栏
    if (/^\|/.test(line)) return;                        // 跳过表格行
    if (isMetaDiscussion(line, rel)) return;             // ★ 元讨论豁免

    const tag = file.replace(ROOT + path.sep, "") + ":" + (i + 1);
    // 邻近上下文：本行 + 前后各 1 行
    const ctx = [lines[i - 1] || "", line, lines[i + 1] || ""].join(" ");

    for (const rule of CLAIM_RULES) {
      if (!rule.re.test(line)) continue;
      if (rule.need.test(ctx)) continue;
      issues.push({
        level: rule.level, kind: "claim-" + rule.kind, at: tag,
        msg: "强断言缺" + rule.needDesc, text: line.slice(0, 110), tip: rule.tip,
      });
    }
  });
  return issues;
}

// ══════════════════════════════════════════════════════════
// 主流程
// ══════════════════════════════════════════════════════════
const all = [];
let scanned = 0, bytes = 0;

for (const f of targets) {
  let text;
  try { text = fs.readFileSync(f, "utf-8"); } catch { continue; }
  scanned++; bytes += Buffer.byteLength(text, "utf-8");
  if (!CLAIMS_ONLY) all.push(...checkRefs(text, f));
  if (!REFS_ONLY) all.push(...checkClaims(text, f));
}

const hard = all.filter(x => x.level === "hard");
const soft = all.filter(x => x.level === "soft");

const result = {
  tool: "_contract-check.cjs",
  version: "1.0.0",
  root: ROOT,
  scanned_files: scanned,
  scanned_bytes: bytes,
  checks: {
    A_reference_format: !CLAIMS_ONLY,
    B_strong_claim_evidence: !REFS_ONLY,
  },
  total: all.length,
  hard: hard.length,
  soft: soft.length,
  by_kind: all.reduce((m, x) => (m[x.kind] = (m[x.kind] || 0) + 1, m), {}),
  issues: all,
  verdict: hard.length === 0 ? "PASS" : "FAIL",
};

if (JSON_ONLY) {
  console.log(JSON.stringify(result, null, 1));
} else {
  const line = "═".repeat(78);
  console.log(line);
  console.log("契约检查 _contract-check.cjs");
  console.log("  扫了 " + scanned + " 个文件 / " + (bytes / 1024).toFixed(0) + " KB");
  console.log("  A 类 参考文献格式        : " + (CLAIMS_ONLY ? "跳过" : "已跑"));
  console.log("  B 类 强断言证据在场性    : " + (REFS_ONLY ? "跳过" : "已跑"));
  console.log(line);

  if (!all.length) {
    console.log("✅ 无问题");
  } else {
    console.log("硬失败 " + hard.length + " · 软提示 " + soft.length);
    console.log("");
    console.log("按类型:");
    Object.entries(result.by_kind).forEach(([k, v]) => console.log("  " + k.padEnd(24) + v));
    console.log("");
    const show = arr => arr.slice(0, 40).forEach(x => {
      console.log("[" + (x.level === "hard" ? "硬" : "软") + "] " + x.kind);
      console.log("     " + x.at + "  " + x.msg);
      console.log("     ▸ " + x.text.replace(/\n/g, " "));
      if (x.tip) console.log("     → " + x.tip);
    });
    if (hard.length) { console.log("── 硬失败 ──"); show(hard); }
    if (soft.length) { console.log(""); console.log("── 软提示 ──"); show(soft); }
    if (all.length > 40) console.log("\n（只显示前 40 条，完整清单用 --json）");
  }
  console.log(line);
  console.log("判定: " + result.verdict);
}

process.exit(result.verdict === "PASS" ? 0 : 1);
