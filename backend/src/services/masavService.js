/**
 * Masav (מס"ב) batch generator - simplified format.
 * The real Masav format is a fixed-width text file (160 cols) sent to banks.
 * This stub returns a CSV with all required fields, plus a JSON summary.
 * For production: replace with full Masav fixed-width formatter per bank spec.
 */

const pad = (s, n, ch = ' ', dir = 'right') => {
  s = String(s ?? '');
  if (s.length > n) return s.slice(0, n);
  return dir === 'right' ? s + ch.repeat(n - s.length) : ch.repeat(n - s.length) + s;
};

export const buildMasavCsv = (payouts) => {
  const header = ['accountHolder', 'idNumber', 'bankCode', 'branchCode', 'accountNumber', 'amount', 'currency', 'reference'].join(',');
  const lines = payouts.map((p) => [
    `"${p.bankSnapshot?.accountHolder || ''}"`,
    p.bankSnapshot?.idNumber || '',
    p.bankSnapshot?.bankCode || '',
    p.bankSnapshot?.branchCode || '',
    p.bankSnapshot?.accountNumber || '',
    p.amount.toFixed(2),
    p.currency || 'ILS',
    String(p._id),
  ].join(','));
  return [header, ...lines].join('\n');
};

export const buildMasavSummary = (payouts) => {
  const total = payouts.reduce((s, p) => s + p.amount, 0);
  return {
    batchId: `MASAV-${Date.now()}`,
    count: payouts.length,
    totalAmount: +total.toFixed(2),
    currency: payouts[0]?.currency || 'ILS',
    generatedAt: new Date().toISOString(),
  };
};
