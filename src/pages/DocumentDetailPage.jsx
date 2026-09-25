import { useCallback, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Button from '../components/Button/Button.jsx';
import DocumentPreview from '../components/DocumentPreview.jsx';
import Modal from '../components/Modal.jsx';
import PageHeader from '../components/PageHeader.jsx';
import StatusPill from '../components/StatusPill.jsx';
import useApp from '../hooks/useApp.js';
import useToast from '../hooks/useToast.js';
import { buttonStyles } from '../utils/buttonStyles.js';
import { createReminder, routeForType } from '../utils/documents.js';
import { calculateDocumentTotals, formatMoney } from '../utils/money.js';

export default function DocumentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { convertQuote, documents, settings, updateStatus } = useApp();
  const { showToast } = useToast();
  const [modal, setModal] = useState(null);
  const document = documents.find((item) => item.id === id);
  const closeModal = useCallback(() => setModal(null), []);

  if (!document) {
    return (
      <>
        <PageHeader title="Document not found">Return to your documents.</PageHeader>
        <Link className={buttonStyles.primary} to="/app/invoices">Back to invoices</Link>
      </>
    );
  }

  const recipientUrl = `${window.location.origin}/recipient/${encodeURIComponent(document.id)}`;
  const total = calculateDocumentTotals(document).totalMinor;
  const issuer = { ...settings, business: document.business, account: document.account };
  const shareMessage = `Hello ${document.customer}, here is ${document.type.toLowerCase()} ${document.number} for ${formatMoney(total, document.currency)}. You can view it here: ${recipientUrl}`;

  async function copyLink() {
    try {
      if (!navigator.clipboard) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(recipientUrl);
      showToast('Demo recipient link copied.');
    } catch {
      setModal('link');
    }
  }

  function changeStatus(status) {
    updateStatus(document.id, status);
    showToast(`Status set to ${status} in this demo.`);
  }

  return (
    <>
      <div className="print:hidden">
        <PageHeader
          action={<Link className={buttonStyles.secondary} to={routeForType(document.type)}>← All {document.type === 'Quote' ? 'quotations' : document.type.toLowerCase() + 's'}</Link>}
          title={`${document.type} ${document.number}`}
        >
          Created {document.date} · <span className="rounded-full bg-[#f2e8ca] px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[1px] text-ink">Demo record</span>
        </PageHeader>
      </div>
      <div className="grid grid-cols-[minmax(0,1.1fr)_minmax(330px,.9fr)] gap-5 tablet:grid-cols-1">
        <section className="h-max rounded-[17px] border border-line bg-white p-6 print:hidden">
          <div className="flex items-center justify-between gap-4 border-b border-line py-4 pt-0"><div><small className="text-muted">Customer</small><h2 className="mt-1 font-display text-2xl font-extrabold">{document.customer}</h2></div><StatusPill status={document.status} /></div>
          <div className="flex justify-between gap-4 border-b border-line py-4"><span>Amount</span><b>{formatMoney(total, document.currency)}</b></div>
          <div className="flex justify-between gap-4 py-4"><span>Due date</span><b>{document.due || 'On receipt'}</b></div>
          <div className="my-4 flex flex-wrap gap-3"><Button onClick={() => setModal('share')}>Share document →</Button><Button onClick={copyLink} variant="secondary">Copy recipient link</Button><Button onClick={() => window.print()} variant="secondary">Print / PDF</Button></div>
          <div className="my-6 h-px bg-line" />
          <h2 className="mb-4 font-bold">Activity and actions</h2>
          <p className="text-xs leading-5 text-muted">Statuses here are manually simulated. Live delivery, view tracking and payments are not connected.</p>
          <div className="mt-5 flex flex-wrap gap-3">
            {['Sent', 'Viewed', 'Paid'].map((status) => <Button key={status} onClick={() => changeStatus(status)} size="small" variant="secondary">Mark {status.toLowerCase()}</Button>)}
            <Button onClick={() => setModal('reminder')} size="small" variant="secondary">Draft reminder</Button>
            {document.type === 'Quote' && <Button onClick={() => { const converted = convertQuote(document.id); if (converted) { showToast('Quote converted to a draft invoice.'); navigate(`/app/documents/${converted.id}`); } }} size="small">Convert to invoice</Button>}
          </div>
        </section>
        <DocumentPreview displayNumber={document.number} document={document} settings={issuer} />
      </div>

      <Modal onClose={closeModal} open={modal === 'share'} title={`Share ${document.type.toLowerCase()}`}>
        <p className="text-muted">Choose a channel. This opens a prefilled message; it does not send automatically.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a className={buttonStyles.primary} href={`https://wa.me/?text=${encodeURIComponent(shareMessage)}`} rel="noopener noreferrer" target="_blank">Open WhatsApp</a>
          <a className={buttonStyles.secondary} href={`mailto:${encodeURIComponent(document.email)}?subject=${encodeURIComponent(`${document.type} ${document.number}`)}&body=${encodeURIComponent(shareMessage)}`}>Open email</a>
        </div>
        <p className="mt-5 text-xs leading-5 text-muted">Because storage is browser-local, this recipient link only resolves in this browser until a backend is connected.</p>
      </Modal>

      <Modal onClose={closeModal} open={modal === 'link'} title="Recipient link">
        <label className="mb-1.5 block text-xs font-bold text-[#3b5549]" htmlFor="recipient-link">Copy this link</label>
        <input className="w-full rounded-[9px] border border-[#cedbd2] bg-white px-3 py-3 outline-green" id="recipient-link" onFocus={(event) => event.target.select()} readOnly value={recipientUrl} />
      </Modal>

      <ReminderModal document={document} onClose={closeModal} open={modal === 'reminder'} settings={settings} />
    </>
  );
}

function ReminderModal({ document, onClose, open, settings }) {
  const { showToast } = useToast();
  const [text, setText] = useState(() => createReminder(document, settings.business));

  async function copyReminder() {
    try {
      await navigator.clipboard.writeText(text);
      showToast('Reminder copied.');
      onClose();
    } catch {
      showToast('Clipboard is unavailable. Select and copy the message manually.');
    }
  }

  return (
    <Modal onClose={onClose} open={open} title="Reminder draft">
      <p className="mb-4 text-xs leading-5 text-muted">Review the wording and the document before contacting the customer.</p>
      <label className="sr-only" htmlFor="reminder-message">Reminder message</label>
      <textarea className="w-full rounded-[9px] border border-[#cedbd2] bg-white px-3 py-3 outline-green" id="reminder-message" onChange={(event) => setText(event.target.value)} rows="5" value={text} />
      <div className="mt-5 flex gap-3"><Button onClick={copyReminder}>Copy message</Button><Button onClick={onClose} variant="secondary">Close</Button></div>
    </Modal>
  );
}
