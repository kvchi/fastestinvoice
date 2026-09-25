import { describe, expect, it } from 'vitest';
import {
  DEFAULT_SETTINGS,
  createDocument,
  nextDocumentNumber,
  parseNaturalRequest,
  routeForType,
  validateDraft,
} from './documents.js';

const validDraft = {
  type: 'Invoice',
  customer: 'Acme',
  email: 'billing@acme.example',
  item: 'Website design',
  amount: '850000',
  currency: 'NGN',
  due: '2026-10-10',
  notes: '',
  tax: '7.5',
  deposit: '60',
};

describe('document domain', () => {
  it('extracts useful draft fields from a natural request', () => {
    expect(parseNaturalRequest('Website design for Acme, ₦850,000, 60% deposit')).toMatchObject({
      amount: '850000',
      currency: 'NGN',
      customer: 'Acme',
      deposit: '60',
    });
  });

  it('rejects invalid email, dates, currency, amounts, and percentages', () => {
    const { errors } = validateDraft(
      { ...validDraft, email: 'bad', due: '2026-09-01', currency: 'BTC', amount: 'NaN', tax: '101', deposit: '-1' },
      '2026-09-25',
    );
    expect(Object.keys(errors)).toEqual(expect.arrayContaining(['email', 'due', 'currency', 'amount', 'tax', 'deposit']));
  });

  it('creates an internal UUID and a separate sequential display number', () => {
    const result = createDocument(validDraft, DEFAULT_SETTINGS, [], new Date('2026-09-25T12:00:00Z'));
    expect(result.document.id).toMatch(/^[0-9a-f-]{36}$/i);
    expect(result.document.number).toBe('FI-2026-001');
    expect(result.document.amountMinor).toBe(85_000_000);
  });

  it('increments display numbers and routes receipts correctly', () => {
    expect(nextDocumentNumber('Invoice', [{ number: 'FI-2026-009' }], new Date('2026-01-01'))).toBe('FI-2026-010');
    expect(routeForType('Receipt')).toBe('/app/receipts');
  });
});
