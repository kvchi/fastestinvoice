import { Link } from 'react-router-dom';
import CurrencyTotals from '../components/CurrencyTotals.jsx';
import PageHeader from '../components/PageHeader.jsx';
import useApp from '../hooks/useApp.js';
import { buttonStyles } from '../utils/buttonStyles.js';
import { calculateDocumentTotals, formatMoney, groupTotalsByCurrency } from '../utils/money.js';

function Metric({ children, label, value }) {
  return (
    <article className="rounded-[14px] border border-line bg-white p-5">
      <small className="text-muted">{label}</small>
      <strong className="my-2.5 block font-display text-[26px] font-extrabold phone:text-xl">
        {value}
      </strong>
      <small className="text-muted">{children}</small>
    </article>
  );
}

export default function DashboardPage() {
  const { documents } = useApp();
  const invoices = documents.filter((document) => document.type === 'Invoice');
  const unpaid = invoices.filter((document) => !['Paid', 'Void'].includes(document.status));
  const received = invoices.filter((document) => document.status === 'Paid');
  const totalSelector = (document) => calculateDocumentTotals(document).totalMinor;
  const outstanding = groupTotalsByCurrency(unpaid, totalSelector);
  const collected = groupTotalsByCurrency(received, totalSelector);
  const customerCount = new Set(documents.map((document) => document.customer)).size;

  return (
    <>
      <PageHeader
        action={<Link className={buttonStyles.primary} to="/app/new?type=Invoice">+ New invoice</Link>}
        title="Good morning, Ajah"
      >
        A clear view of what is coming in.{' '}
        <span className="rounded-full bg-[#f2e8ca] px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[1px] text-ink">Demo data</span>
      </PageHeader>
      <section className="grid grid-cols-4 gap-3 tablet:grid-cols-2">
        <Metric label="Outstanding" value={<CurrencyTotals totals={outstanding} />}>
          {unpaid.length} open invoices
        </Metric>
        <Metric label="Collected" value={<CurrencyTotals totals={collected} />}>
          Recorded in this demo
        </Metric>
        <Metric label="Invoices sent" value={invoices.filter((item) => item.status !== 'Draft').length}>
          Across sample records
        </Metric>
        <Metric label="Customers" value={customerCount}>Unique names</Metric>
      </section>
      <section className="mt-4.5 grid grid-cols-[1.5fr_1fr] gap-4 tablet:grid-cols-1">
        <article className="rounded-[17px] border border-line bg-white p-6">
          <div className="flex items-center justify-between gap-4 border-b border-line pb-4">
            <h2 className="font-bold">Recent activity</h2>
            <Link className="text-sm text-muted hover:text-green" to="/app/invoices">View all →</Link>
          </div>
          {documents.slice(0, 5).map((document) => (
            <div className="flex items-center justify-between gap-4 border-b border-line py-4 last:border-0" key={document.id}>
              <div><Link className="font-bold hover:text-green" to={`/app/documents/${document.id}`}>{document.customer}</Link><small className="mt-1 block text-muted">{document.number} · {document.type}</small></div>
              <div className="text-right"><b>{formatMoney(calculateDocumentTotals(document).totalMinor, document.currency)}</b><small className="mt-1 block text-muted">{document.status}</small></div>
            </div>
          ))}
        </article>
        <article className="rounded-[17px] border border-line bg-white p-6">
          <h2 className="mb-4 font-bold">Keep money moving</h2>
          <p className="text-muted">Create a request, share it with a customer, then follow up from the document page.</p>
          <Link className={`${buttonStyles.primary} my-5`} to="/app/new?type=Invoice">Create invoice →</Link>
          <div className="my-6 h-px bg-line" />
          <h2 className="mb-4 font-bold">Fastest tip</h2>
          <p className="text-muted">A clear due date and deposit request can help set expectations before work begins.</p>
        </article>
      </section>
    </>
  );
}
