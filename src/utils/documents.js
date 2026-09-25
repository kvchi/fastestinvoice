import {
  CURRENCIES,
  calculateDocumentTotals,
  formatMoney,
  minorToInput,
  parseMoneyToMinor,
  parsePercentToBasisPoints,
} from './money.js';

export const DOCUMENT_TYPES = Object.freeze(['Invoice', 'Quote', 'Receipt']);
export const DOCUMENT_STATUSES = Object.freeze([
  'Draft',
  'Sent',
  'Viewed',
  'Paid',
  'Overdue',
  'Void',
]);

export const DEFAULT_SETTINGS = Object.freeze({
  business: 'Northstar Studio',
  email: 'hello@northstar.example',
  phone: '+234 800 000 0000',
  account: 'Demo bank details',
});

export const EMPTY_DRAFT = Object.freeze({
  type: 'Invoice',
  customer: '',
  email: '',
  item: '',
  amount: '',
  currency: 'NGN',
  due: '',
  notes: '',
  tax: '0',
  deposit: '0',
});

export const SEED_DOCUMENTS = Object.freeze([
  {
    id: 'seed-fi-2026-001',
    number: 'FI-2026-001',
    type: 'Invoice',
    customer: 'Acme Projects',
    email: 'accounts@acme.example',
    item: 'Brand identity and website design',
    amountMinor: 85_000_000,
    currency: 'NGN',
    status: 'Paid',
    date: '2026-09-19',
    due: '2026-09-26',
    business: 'Northstar Studio',
    account: 'Demo bank details',
    notes: 'Thank you for your business.',
    taxBasisPoints: 0,
    depositBasisPoints: 0,
  },
  {
    id: 'seed-fi-2026-002',
    number: 'FI-2026-002',
    type: 'Invoice',
    customer: 'Kora Events',
    email: 'hello@kora.example',
    item: 'Event production deposit',
    amountMinor: 32_000_000,
    currency: 'NGN',
    status: 'Viewed',
    date: '2026-09-22',
    due: '2026-10-02',
    business: 'Northstar Studio',
    account: 'Demo bank details',
    notes: '50% deposit to confirm booking.',
    taxBasisPoints: 0,
    depositBasisPoints: 0,
  },
  {
    id: 'seed-fq-2026-001',
    number: 'FQ-2026-001',
    type: 'Quote',
    customer: 'Amara Consulting',
    email: 'amara@example.com',
    item: 'Campaign strategy',
    amountMinor: 60_000_000,
    currency: 'NGN',
    status: 'Sent',
    date: '2026-09-23',
    due: '2026-10-05',
    business: 'Northstar Studio',
    account: 'Demo bank details',
    notes: 'Valid for 14 days.',
    taxBasisPoints: 0,
    depositBasisPoints: 0,
  },
]);

const TYPE_PREFIX = { Invoice: 'FI', Quote: 'FQ', Receipt: 'FR' };
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validIsoDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

export function normalizeDocuments(value) {
  if (!Array.isArray(value)) return [...SEED_DOCUMENTS];
  return value
    .filter((item) => item && typeof item === 'object')
    .map((item, index) => {
      const type = DOCUMENT_TYPES.includes(item.type) ? item.type : 'Invoice';
      const legacyNumber = typeof item.number === 'string' ? item.number : item.id;
      const amountMinor = Number.isSafeInteger(item.amountMinor)
        ? item.amountMinor
        : parseMoneyToMinor(String(item.amount ?? ''));
      return {
        id: typeof item.id === 'string' ? item.id : `legacy-${index}`,
        number:
          typeof legacyNumber === 'string'
            ? legacyNumber
            : `${TYPE_PREFIX[type]}-LEGACY-${index + 1}`,
        type,
        customer: String(item.customer ?? ''),
        email: String(item.email ?? ''),
        item: String(item.item ?? ''),
        amountMinor: amountMinor ?? 0,
        currency: CURRENCIES[item.currency] ? item.currency : 'NGN',
        status: DOCUMENT_STATUSES.includes(item.status) ? item.status : 'Draft',
        date: validIsoDate(item.date) ? item.date : new Date().toISOString().slice(0, 10),
        due: validIsoDate(item.due) ? item.due : '',
        business: String(item.business ?? DEFAULT_SETTINGS.business),
        account: String(item.account ?? DEFAULT_SETTINGS.account),
        notes: String(item.notes ?? ''),
        taxBasisPoints: Number.isInteger(item.taxBasisPoints)
          ? item.taxBasisPoints
          : parsePercentToBasisPoints(String(item.tax ?? '0')) || 0,
        depositBasisPoints: Number.isInteger(item.depositBasisPoints)
          ? item.depositBasisPoints
          : parsePercentToBasisPoints(String(item.deposit ?? '0')) || 0,
      };
    });
}

export function normalizeSettings(value) {
  if (!value || typeof value !== 'object') return { ...DEFAULT_SETTINGS };
  return {
    business: String(value.business || DEFAULT_SETTINGS.business),
    email: String(value.email || DEFAULT_SETTINGS.email),
    phone: String(value.phone || DEFAULT_SETTINGS.phone),
    account: String(value.account || DEFAULT_SETTINGS.account),
  };
}

export function validateDraft(draft, today = new Date().toISOString().slice(0, 10)) {
  const errors = {};
  if (!DOCUMENT_TYPES.includes(draft.type)) errors.type = 'Choose a valid document type.';
  if (!CURRENCIES[draft.currency]) errors.currency = 'Choose a supported currency.';
  if (!String(draft.customer).trim()) errors.customer = 'Customer name is required.';
  if (!String(draft.item).trim()) errors.item = 'A service or item is required.';
  if (draft.email && !EMAIL_PATTERN.test(String(draft.email).trim())) {
    errors.email = 'Enter a valid email address.';
  }
  const amountMinor = parseMoneyToMinor(draft.amount);
  if (amountMinor === null || amountMinor <= 0) {
    errors.amount = 'Enter a valid amount greater than zero with at most two decimals.';
  }
  const taxBasisPoints = parsePercentToBasisPoints(draft.tax);
  if (taxBasisPoints === null) errors.tax = 'Tax must be between 0 and 100.';
  const depositBasisPoints = parsePercentToBasisPoints(draft.deposit);
  if (depositBasisPoints === null) errors.deposit = 'Deposit must be between 0 and 100.';
  if (draft.due && (!validIsoDate(draft.due) || draft.due < today)) {
    errors.due = 'Due date must be today or later.';
  }
  return { errors, amountMinor, taxBasisPoints, depositBasisPoints };
}

export function nextDocumentNumber(type, documents, date = new Date()) {
  const year = date.getFullYear();
  const prefix = TYPE_PREFIX[type];
  const pattern = new RegExp(`^${prefix}-${year}-(\\d+)$`);
  const highest = documents.reduce((max, document) => {
    const match = document.number?.match(pattern);
    return match ? Math.max(max, Number(match[1])) : max;
  }, 0);
  return `${prefix}-${year}-${String(highest + 1).padStart(3, '0')}`;
}

export function createDocument(draft, settings, documents, now = new Date()) {
  const validation = validateDraft(draft, now.toISOString().slice(0, 10));
  if (Object.keys(validation.errors).length) return { document: null, ...validation };
  return {
    errors: {},
    document: {
      id: crypto.randomUUID(),
      number: nextDocumentNumber(draft.type, documents, now),
      type: draft.type,
      customer: draft.customer.trim(),
      email: draft.email.trim(),
      item: draft.item.trim(),
      amountMinor: validation.amountMinor,
      currency: draft.currency,
      status: 'Draft',
      date: now.toISOString().slice(0, 10),
      due: draft.due,
      business: settings.business,
      account: settings.account,
      notes: draft.notes.trim(),
      taxBasisPoints: validation.taxBasisPoints,
      depositBasisPoints: validation.depositBasisPoints,
    },
  };
}

export function parseNaturalRequest(request) {
  const source = String(request).trim();
  if (!source) return {};
  const amountMatch = source.match(
    /(?:₦|NGN\s*|\$|USD\s*|£|GBP\s*|GHS\s*|KES\s*)([\d,.]+)\s*(m|k)?/i,
  );
  const result = {};
  if (amountMatch) {
    const suffix = amountMatch[2]?.toLowerCase();
    const multiplier = suffix === 'm' ? 1_000_000 : suffix === 'k' ? 1_000 : 1;
    const parsedMinor = parseMoneyToMinor(amountMatch[1]);
    if (parsedMinor !== null && parsedMinor <= Number.MAX_SAFE_INTEGER / multiplier) {
      result.amount = minorToInput(parsedMinor * multiplier);
    }
    const token = amountMatch[0].toUpperCase();
    if (token.includes('$') || token.includes('USD')) result.currency = 'USD';
    else if (token.includes('£') || token.includes('GBP')) result.currency = 'GBP';
    else if (token.includes('GHS')) result.currency = 'GHS';
    else if (token.includes('KES')) result.currency = 'KES';
    else result.currency = 'NGN';
  }
  const depositMatch = source.match(/(\d{1,3}(?:\.\d{1,2})?)\s*%\s*deposit/i);
  if (depositMatch && parsePercentToBasisPoints(depositMatch[1]) !== null) {
    result.deposit = depositMatch[1];
  }
  const customerMatch = source.match(
    /\bfor\s+([\w\s&.-]+?)(?:,|\.|\s+(?:₦|NGN|USD|GBP|GHS|KES|\$|£))/i,
  );
  if (customerMatch) result.customer = customerMatch[1].trim();
  result.item =
    source
      .replace(amountMatch?.[0] || '', '')
      .replace(/\bfor\s+([\w\s&.-]+?)(?:,|\.|$)/i, '')
      .replace(/\d{1,3}(?:\.\d{1,2})?%\s*deposit/i, '')
      .replace(/[,.\s]+$/, '')
      .trim() || source;
  return result;
}

export function setDocumentStatus(documents, id, status) {
  if (!DOCUMENT_STATUSES.includes(status)) return documents;
  return documents.map((document) =>
    document.id === id ? { ...document, status } : document,
  );
}

export function createReminder(document, businessName) {
  const { totalMinor } = calculateDocumentTotals(document);
  return `Hello ${document.customer}, just a gentle reminder about ${document.type.toLowerCase()} ${document.number} for ${formatMoney(totalMinor, document.currency)}${document.due ? ` due ${document.due}` : ''}. Please let me know if you need anything from me. Thank you, ${businessName}.`;
}

export function convertQuoteToInvoice(quote, documents, now = new Date()) {
  return {
    ...quote,
    id: crypto.randomUUID(),
    number: nextDocumentNumber('Invoice', documents, now),
    type: 'Invoice',
    status: 'Draft',
    date: now.toISOString().slice(0, 10),
  };
}

export function routeForType(type) {
  return type === 'Quote'
    ? '/app/quotes'
    : type === 'Receipt'
      ? '/app/receipts'
      : '/app/invoices';
}
