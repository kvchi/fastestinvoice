export const CURRENCIES = Object.freeze({
  NGN: 'Nigerian naira',
  USD: 'US dollar',
  GBP: 'British pound',
  GHS: 'Ghanaian cedi',
  KES: 'Kenyan shilling',
});

const MINOR_FACTOR = 100;

export function parseMoneyToMinor(value) {
  const normalized = String(value ?? '').trim().replace(/,/g, '');
  if (!/^\d+(?:\.\d{0,2})?$/.test(normalized)) return null;
  const [whole, fraction = ''] = normalized.split('.');
  const minor = BigInt(whole) * 100n + BigInt((fraction + '00').slice(0, 2));
  if (minor > BigInt(Number.MAX_SAFE_INTEGER)) return null;
  return Number(minor);
}

export function minorToInput(minor) {
  if (!Number.isSafeInteger(minor) || minor < 0) return '';
  const whole = Math.floor(minor / MINOR_FACTOR);
  const fraction = String(minor % MINOR_FACTOR).padStart(2, '0');
  return fraction === '00' ? String(whole) : `${whole}.${fraction}`;
}

export function parsePercentToBasisPoints(value) {
  const normalized = String(value ?? '').trim();
  if (!/^\d+(?:\.\d{0,2})?$/.test(normalized)) return null;
  const [whole, fraction = ''] = normalized.split('.');
  const basisPoints = Number(whole) * 100 + Number((fraction + '00').slice(0, 2));
  return basisPoints <= 10_000 ? basisPoints : null;
}

export function basisPointsToInput(basisPoints = 0) {
  const whole = Math.floor(basisPoints / 100);
  const fraction = String(basisPoints % 100).padStart(2, '0');
  return fraction === '00' ? String(whole) : `${whole}.${fraction}`;
}

export function multiplyByBasisPoints(minor, basisPoints) {
  const value = BigInt(minor) * BigInt(basisPoints);
  return Number((value + 5_000n) / 10_000n);
}

export function calculateDocumentTotals(document) {
  const subtotalMinor = Number.isSafeInteger(document.amountMinor)
    ? document.amountMinor
    : 0;
  const taxMinor = multiplyByBasisPoints(
    subtotalMinor,
    document.taxBasisPoints || 0,
  );
  const totalMinor = subtotalMinor + taxMinor;
  const depositMinor = multiplyByBasisPoints(
    totalMinor,
    document.depositBasisPoints || 0,
  );
  return { subtotalMinor, taxMinor, totalMinor, depositMinor };
}

export function formatMoney(minor, currency = 'NGN') {
  const safeCurrency = CURRENCIES[currency] ? currency : 'NGN';
  const safeMinor = Number.isSafeInteger(minor) ? minor : 0;
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: safeCurrency,
    minimumFractionDigits: safeMinor % MINOR_FACTOR === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(safeMinor / MINOR_FACTOR);
}

export function groupTotalsByCurrency(
  documents,
  selectAmount = (document) => document.amountMinor,
) {
  return documents.reduce((totals, document) => {
    if (!CURRENCIES[document.currency]) return totals;
    const amount = selectAmount(document);
    if (!Number.isSafeInteger(amount)) return totals;
    totals[document.currency] = (totals[document.currency] || 0) + amount;
    return totals;
  }, {});
}
