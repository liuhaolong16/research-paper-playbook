"""figkit 端到端自测：出一张符合期刊规格的容量衰减图并自动验收。"""
import os, sys, math
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import figkit as fk

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "_selftest")
os.makedirs(OUT, exist_ok=True)

fk.apply_style()

# —— 造两组带物理意义的假数据（仅用于验证工具链，不是论文数据）——
n = list(range(1, 301))
def fade(rate, knee):
    out = []
    for c in n:
        v = 1.0 - rate * math.sqrt(c) / 100.0
        if c > knee:
            v -= 0.00035 * (c - knee)          # 拐点后加速衰减
        out.append(max(v, 0.6))
    return out

y1 = fade(2.2, 180)
y2 = fade(2.8, 140)

# —— 单栏线图 ——
fig, ax = fk.new_fig(width="single", ratio=0.78)
ax.plot(n, y1, **fk.line_kw(0, marker=None, label="A123 / 30 \u00b0C"))
ax.plot(n, y2, **fk.line_kw(1, marker=None, label="A123 / 45 \u00b0C"))
ax.axhline(0.8, **{**fk.line_kw(8), "linestyle": ":", "linewidth": 0.75})
ax.set_ylim(0.7, 1.02)
ax.set_xlim(0, 300)
fk.finish(fig, os.path.join(OUT, "fig_capacity.pdf"),
          xlabel="Cycle number", ylabel="$Q/Q_0$",
          legend=True)

# —— 双栏 + 半对数（检验对数轴也走同一规格）——
fig2, ax2 = fk.new_fig(width="double", ratio=0.43)
for i, (yy, lab) in enumerate([(y1, "Cell A"), (y2, "Cell B")]):
    ax2.semilogy(n, [1 - v + 0.05 for v in yy], **fk.line_kw(i, label=lab))
fk.finish(fig2, os.path.join(OUT, "fig_fade_double.pdf"),
          xlabel="Cycle number", ylabel="Capacity fade (1 $-$ $Q/Q_0$)",
          legend=True, legend_ncol=2)

# —— 600 dpi TIFF（位图路径也要合规）——
fig3, ax3 = fk.new_fig(width="single", ratio=0.78)
ax3.scatter(n[::10], y1[::10], **fk.scatter_kw(0, marker="o", label="measured"))
ax3.plot(n, y1, **{**fk.line_kw(0), "alpha": 0.45, "linewidth": 0.75})
ax3.set_ylim(0.7, 1.02)
fk.finish(fig3, os.path.join(OUT, "fig_scatter.tif"),
          xlabel="Cycle number", ylabel="$Q/Q_0$", legend=True)

print("\n导出目录：")
for f in sorted(os.listdir(OUT)):
    p = os.path.join(OUT, f)
    print("  %-26s %9d B" % (f, os.path.getsize(p)))

print()
for f in ["fig_capacity.pdf", "fig_fade_double.pdf"]:
    ok, rep = fk.report(os.path.join(OUT, f))
    if not ok:
        sys.exit(1)

print("\n★ 全部通过自动化验收")
