import { Link, useParams } from 'react-router-dom';
import Button from '../components/Button/Button.jsx';
import DocumentPreview from '../components/DocumentPreview.jsx';
import Logo from '../components/Logo.jsx';
import useApp from '../hooks/useApp.js';
import useToast from '../hooks/useToast.js';

export default function RecipientPage() {
  const { id } = useParams();
  const { documents, settings } = useApp();
  const { showToast } = useToast();
  const document = documents.find((item) => item.id === id);

  if (!document) {
    return (
      <main className="mx-auto max-w-2xl px-5 py-16 text-center">
        <h1 className="font-display text-4xl font-extrabold">Link unavailable</h1>
        <p className="my-5 text-muted">The demo document was not found in this browser. Server-side sharing is not connected yet.</p>
        <Link className="font-bold text-green underline" to="/">Return home</Link>
      </main>
    );
  }

  const issuer = { ...settings, business: document.business, account: document.account };
  return (
    <main className="mx-auto my-9 max-w-175 rounded-[17px] border border-line bg-white p-8 phone:m-4 phone:p-5">
      <div className="flex items-center justify-between gap-4 border-b border-line pb-4 print:hidden">
        <Logo />
        <span className="rounded-full bg-[#f2e8ca] px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[1px]">Demo recipient view</span>
      </div>
      <p className="my-5 text-muted print:hidden">{document.business} shared a {document.type.toLowerCase()} with {document.customer}.</p>
      <DocumentPreview displayNumber={document.number} document={document} settings={issuer} />
      <div className="my-7 flex flex-wrap gap-3 print:hidden">
        <Button onClick={() => showToast('Payment processing is not connected in this prototype.')}>Pay now (demo)</Button>
        <Button onClick={() => window.print()} variant="secondary">Download PDF</Button>
        <Button onClick={() => showToast('A customer query would be sent to the issuer in the live product.')} variant="ghost">Ask a question</Button>
      </div>
      <p className="text-xs leading-5 text-muted print:hidden">Before paying a real invoice, verify the sender and payment details independently. This screen is an interactive product sample.</p>
      <Link className="mt-5 inline-block text-sm text-muted hover:text-green print:hidden" to="/app/new">Create your own invoice →</Link>
    </main>
  );
}
