import { useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Button from '../components/Button/Button.jsx';
import DocumentPreview from '../components/DocumentPreview.jsx';
import PageHeader from '../components/PageHeader.jsx';
import useApp from '../hooks/useApp.js';
import useToast from '../hooks/useToast.js';
import { buttonStyles } from '../utils/buttonStyles.js';
import { CURRENCIES, parseMoneyToMinor, parsePercentToBasisPoints } from '../utils/money.js';
import {
  DOCUMENT_TYPES,
  EMPTY_DRAFT,
  createDocument,
  parseNaturalRequest,
} from '../utils/documents.js';

const fieldClass =
  'w-full rounded-[9px] border border-[#cedbd2] bg-white px-3 py-3 outline-green aria-[invalid=true]:border-red-600';
const labelClass = 'mb-1.5 block text-xs font-bold text-[#3b5549]';

function FieldError({ id, message }) {
  return message ? <p className="mt-1 text-xs text-red-700" id={id}>{message}</p> : null;
}

export default function ComposerPage() {
  const { addDocument, documents, settings } = useApp();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialType = searchParams.get('type');
  const [draft, setDraft] = useState({
    ...EMPTY_DRAFT,
    type: DOCUMENT_TYPES.includes(initialType) ? initialType : 'Invoice',
    customer: searchParams.get('customer') || '',
  });
  const [naturalRequest, setNaturalRequest] = useState('');
  const [errors, setErrors] = useState({});
  const errorSummaryRef = useRef(null);
  const today = new Date().toISOString().slice(0, 10);

  const previewDocument = useMemo(
    () => ({
      ...draft,
      amountMinor: parseMoneyToMinor(draft.amount) || 0,
      taxBasisPoints: parsePercentToBasisPoints(draft.tax) || 0,
      depositBasisPoints: parsePercentToBasisPoints(draft.deposit) || 0,
    }),
    [draft],
  );

  function updateField(event) {
    const { name, value } = event.target;
    setDraft((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
  }

  function suggestDetails() {
    if (!naturalRequest.trim()) {
      showToast('Paste a short request first.');
      return;
    }
    const suggested = parseNaturalRequest(naturalRequest);
    setDraft((current) => ({ ...current, ...suggested }));
    showToast('Draft suggestions added. Review each field before saving.');
  }

  function saveDocument(event) {
    event.preventDefault();
    const result = createDocument(draft, settings, documents);
    if (!result.document) {
      setErrors(result.errors);
      window.requestAnimationFrame(() => errorSummaryRef.current?.focus());
      return;
    }
    addDocument(result.document);
    showToast('Document saved in this browser.');
    navigate(`/app/documents/${result.document.id}`);
  }

  return (
    <>
      <div className="print:hidden">
        <PageHeader action={<Link className={buttonStyles.secondary} to="/app/dashboard">← Dashboard</Link>} title="Create a document">
          Your customer can see a preview before you create an account.{' '}
          <span className="rounded-full bg-[#f2e8ca] px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[1px] text-ink">Prototype</span>
        </PageHeader>
        <ol className="mb-6 mt-3 flex gap-2" aria-label="Creation progress">
          <li className="rounded-full bg-green px-3 py-2 text-xs text-white">1 · Details</li>
          <li className="rounded-full bg-green px-3 py-2 text-xs text-white">2 · Live preview</li>
          <li className="rounded-full bg-[#e8eee7] px-3 py-2 text-xs text-[#587267]">3 · Save or share</li>
        </ol>
      </div>
      <div className="grid grid-cols-[minmax(0,1.1fr)_minmax(330px,.9fr)] gap-5 tablet:grid-cols-1">
        <form className="print:hidden" noValidate onSubmit={saveDocument}>
          <section className="rounded-[17px] border border-line bg-white p-6">
            <h2 className="mb-4 font-bold">Turn a request into a draft</h2>
            <p className="mb-4 text-xs leading-5 text-muted">
              Try: “Website design for Acme, ₦850,000, 60% deposit”. Suggested fields
              must be checked before sending.
            </p>
            <label className={labelClass} htmlFor="natural-request">Client request</label>
            <textarea className={fieldClass} id="natural-request" onChange={(event) => setNaturalRequest(event.target.value)} placeholder="Paste a short client request or type a service and price..." rows="2" value={naturalRequest} />
            <Button className="mt-2" onClick={suggestDetails} size="small" variant="secondary">Suggest details →</Button>
          </section>

          <section className="mt-4 rounded-[17px] border border-line bg-white p-6">
            <h2 className="mb-4 font-bold">Document details</h2>
            {Object.keys(errors).length > 0 && (
              <div ref={errorSummaryRef} className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800" role="alert" tabIndex={-1}>
                <b>Please correct the highlighted fields.</b>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4 phone:grid-cols-1">
              <div><label className={labelClass} htmlFor="document-type">Document</label><select aria-describedby={errors.type ? 'type-error' : undefined} aria-invalid={Boolean(errors.type)} className={fieldClass} id="document-type" name="type" onChange={updateField} value={draft.type}>{DOCUMENT_TYPES.map((type) => <option key={type}>{type}</option>)}</select><FieldError id="type-error" message={errors.type} /></div>
              <div><label className={labelClass} htmlFor="currency">Currency</label><select aria-describedby={errors.currency ? 'currency-error' : undefined} aria-invalid={Boolean(errors.currency)} className={fieldClass} id="currency" name="currency" onChange={updateField} value={draft.currency}>{Object.entries(CURRENCIES).map(([code, name]) => <option key={code} value={code}>{code} · {name}</option>)}</select><FieldError id="currency-error" message={errors.currency} /></div>
              <div><label className={labelClass} htmlFor="customer">Customer name *</label><input aria-describedby={errors.customer ? 'customer-error' : undefined} aria-invalid={Boolean(errors.customer)} className={fieldClass} id="customer" name="customer" onChange={updateField} placeholder="e.g. Acme Projects" value={draft.customer} /><FieldError id="customer-error" message={errors.customer} /></div>
              <div><label className={labelClass} htmlFor="customer-email">Customer email</label><input aria-describedby={errors.email ? 'email-error' : undefined} aria-invalid={Boolean(errors.email)} className={fieldClass} id="customer-email" name="email" onChange={updateField} placeholder="accounts@example.com" type="email" value={draft.email} /><FieldError id="email-error" message={errors.email} /></div>
              <div className="col-span-2 phone:col-auto"><label className={labelClass} htmlFor="item">Service or item *</label><input aria-describedby={errors.item ? 'item-error' : undefined} aria-invalid={Boolean(errors.item)} className={fieldClass} id="item" name="item" onChange={updateField} placeholder="e.g. Website design and setup" value={draft.item} /><FieldError id="item-error" message={errors.item} /></div>
              <div><label className={labelClass} htmlFor="amount">Amount *</label><input aria-describedby={errors.amount ? 'amount-error' : undefined} aria-invalid={Boolean(errors.amount)} className={fieldClass} id="amount" inputMode="decimal" name="amount" onChange={updateField} placeholder="850000" value={draft.amount} /><FieldError id="amount-error" message={errors.amount} /></div>
              <div><label className={labelClass} htmlFor="due">Due date</label><input aria-describedby={errors.due ? 'due-error' : undefined} aria-invalid={Boolean(errors.due)} className={fieldClass} id="due" min={today} name="due" onChange={updateField} type="date" value={draft.due} /><FieldError id="due-error" message={errors.due} /></div>
              <div><label className={labelClass} htmlFor="tax">Tax percentage (optional)</label><input aria-describedby={errors.tax ? 'tax-error' : undefined} aria-invalid={Boolean(errors.tax)} className={fieldClass} id="tax" inputMode="decimal" name="tax" onChange={updateField} value={draft.tax} /><FieldError id="tax-error" message={errors.tax} /></div>
              <div><label className={labelClass} htmlFor="deposit">Deposit percentage (optional)</label><input aria-describedby={errors.deposit ? 'deposit-error' : undefined} aria-invalid={Boolean(errors.deposit)} className={fieldClass} id="deposit" inputMode="decimal" name="deposit" onChange={updateField} value={draft.deposit} /><FieldError id="deposit-error" message={errors.deposit} /></div>
              <div className="col-span-2 phone:col-auto"><label className={labelClass} htmlFor="notes">Note to customer</label><textarea className={fieldClass} id="notes" name="notes" onChange={updateField} placeholder="Payment instructions or a thank-you note" rows="3" value={draft.notes} /></div>
            </div>
            <div className="my-7 flex flex-wrap gap-3"><Button type="submit">Save document →</Button><Button onClick={() => window.print()} variant="secondary">Print / save PDF</Button></div>
            <p className="text-xs leading-5 text-muted">A browser print dialog creates the PDF. Sending, cross-device tracking and payment processing require a live backend.</p>
          </section>
        </form>
        <DocumentPreview document={previewDocument} settings={settings} />
      </div>
    </>
  );
}
