// Round 10 pilot — Hall-Petch regression on real published data.
// Source of every number: Nakai et al., Mater. Trans. 62 (2021) 1320-1327, Table 1.
// DOI 10.2320/matertrans.Z-M2021837
// Table 1 was read from the publisher image:
// https://www.jstage.jst.go.jp/article/matertrans/62/9/62_Z-M2021837/_html/Graphics/Z-M2021837tab01.jpg

const d = [789, 219, 186, 173];                 // grain size, nm  (Table 1, col "Grain size d")
const utsAsDep = [768, 1433, 1690, 1815];       // MPa, as-deposited (Table 1, col sigma_UTS)
const utsAnnealed = [628, 1058, 1130, 1141];    // MPa, annealed 250C/1h (Table 1)
const fatAsDep = [65, 138, 163, 168];           // MPa, fatigue limit, as-deposited
const fatAnnealed = [85, 156, 188, 194];        // MPa, fatigue limit, annealed

// Student t(0.975, df) — needed because the playbook asks for an interval, not just a point slope.
const T975 = { 1: 12.706, 2: 4.303, 3: 3.182, 4: 2.776, 5: 2.571, 6: 2.447 };

function fit(x, y, label) {
  const n = x.length;
  const mx = x.reduce((a, b) => a + b, 0) / n;
  const my = y.reduce((a, b) => a + b, 0) / n;
  let sxy = 0, sxx = 0, syy = 0;
  for (let i = 0; i < n; i++) {
    sxy += (x[i] - mx) * (y[i] - my);
    sxx += (x[i] - mx) ** 2;
    syy += (y[i] - my) ** 2;
  }
  const k = sxy / sxx;            // Hall-Petch slope, MPa*nm^0.5
  const s0 = my - k * mx;         // intercept, MPa
  const r2 = (sxy * sxy) / (sxx * syy);
  const df = n - 2;
  const sse = syy - k * sxy;
  const s2 = sse / df;
  const seK = Math.sqrt(s2 / sxx);
  const seS0 = Math.sqrt(s2 * (1 / n + mx * mx / sxx));
  const t = T975[df];
  console.log(`--- ${label} (n=${n}, df=${df}) ---`);
  console.log(`  x = d^-1/2 : ${x.map(v => v.toFixed(5)).join(', ')}`);
  console.log(`  y (MPa)    : ${y.join(', ')}`);
  console.log(`  Hall-Petch slope k = ${k.toFixed(1)} MPa*nm^0.5`);
  console.log(`     = ${(k * Math.pow(1e-9, 0.5)).toFixed(4)} MPa*m^0.5  (1 MPa*nm^0.5 = 3.16228e-5 MPa*m^0.5)`);
  console.log(`  95% CI on k        = [${(k - t * seK).toFixed(1)}, ${(k + t * seK).toFixed(1)}]`);
  console.log(`  intercept sigma_0  = ${s0.toFixed(1)} MPa  (95% CI [${(s0 - t * seS0).toFixed(1)}, ${(s0 + t * seS0).toFixed(1)}])`);
  console.log(`  R^2 = ${r2.toFixed(4)}`);
  console.log(`  residual SD = ${Math.sqrt(s2).toFixed(1)} MPa`);
  return { k, s0, r2, seK, df, t };
}

const proofAsDep = [469, 990, 1065, 1241];      // MPa, as-deposited 0.2% proof (Table 1)

const x = d.map(v => 1 / Math.sqrt(v));
const p = fit(x, proofAsDep, 'as-deposited, sigma_0.2');
const a = fit(x, utsAsDep, 'as-deposited, sigma_UTS');
const b = fit(x, utsAnnealed, 'annealed 250C/1h, sigma_UTS');
const c = fit(x, fatAsDep, 'as-deposited, fatigue limit');
const e = fit(x, fatAnnealed, 'annealed 250C/1h, fatigue limit');

// Welch-style comparison of the two UTS slopes (unequal variances not estimated; df taken as n1+n2-4).
const diff = a.k - b.k;
const seDiff = Math.sqrt(a.seK ** 2 + b.seK ** 2);
const tcrit = T975[4];
console.log('--- as-deposited vs annealed, sigma_UTS slope ---');
console.log(`  delta k = ${diff.toFixed(1)} MPa*nm^0.5`);
console.log(`  95% CI  = [${(diff - tcrit * seDiff).toFixed(1)}, ${(diff + tcrit * seDiff).toFixed(1)}]`);
console.log(`  t = ${(diff / seDiff).toFixed(3)} (df=4, t_crit(0.975)=${tcrit})`);
console.log(`  interval contains 0 ? ${(diff - tcrit * seDiff) < 0 && (diff + tcrit * seDiff) > 0}`);
