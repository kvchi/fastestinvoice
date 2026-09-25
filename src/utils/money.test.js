import { describe, expect, it } from 'vitest';
import {
  calculateDocumentTotals,
  groupTotalsByCurrency,
  parseMoneyToMinor,
  parsePercentToBasisPoints,
} from './money.js';

describe('money utilities', () => {
  it('parses monetary input into integer minor units', () => {
    expect(parseMoneyToMinor('850,000')).toBe(85_000_000);
    expect(parseMoneyToMinor('10.99')).toBe(1099);
    expect(parseMoneyToMinor('1.999')).toBeNull();
    expect(parseMoneyToMinor('Infinity')).toBeNull();
  });

  it('calculates tax and deposit without floating point arithmetic', () => {
    const totals = calculateDocumentTotals({
      amountMinor: 10_001,
      taxBasisPoints: 750,
      depositBasisPoints: 6_000,
    });
    expect(totals).toEqual({
      subtotalMinor: 10_001,
      taxMinor: 750,
      totalMinor: 10_751,
      depositMinor: 6_451,
    });
  });

  it('groups totals without mixing currencies', () => {
    expect(
      groupTotalsByCurrency([
        { amountMinor: 100, currency: 'USD' },
        { amountMinor: 200, currency: 'NGN' },
        { amountMinor: 300, currency: 'USD' },
      ]),
    ).toEqual({ USD: 400, NGN: 200 });
  });

  it('validates percentages as basis points', () => {
    expect(parsePercentToBasisPoints('7.5')).toBe(750);
    expect(parsePercentToBasisPoints('100')).toBe(10_000);
    expect(parsePercentToBasisPoints('100.01')).toBeNull();
  });
});
