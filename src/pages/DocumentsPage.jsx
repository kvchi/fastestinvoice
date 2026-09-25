import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import StatusPill from '../components/StatusPill.jsx';
import useApp from '../hooks/useApp.js';
import { buttonStyles } from '../utils/buttonStyles.js';
import { calculateDocumentTotals, formatMoney } from '../utils/money.js';

export default function DocumentsPage({ type }) {
  const { documents } = useApp();
  const [query, setQuery] = useState('');
  const title = type === 'Quote' ? 'Quotations' : `${type}s`;
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return documents.filter(
      (document) =>
        document.type === type &&
        (!needle || `${document.number} ${document.customer}`.toLowerCase().includes(needle)),
    );
  }, [documents, query, type]);

  return (
    <>
      <PageHeader
        action={<Link className={buttonStyles.primary} to={`/app/new?type=${type}`}>+ New {type.toLowerCase()}</Link>}
        title={title}
      >
        {filtered.length} demo and locally created records
      </PageHeader>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <label className="sr-only" htmlFor={`${type}-search`}>Search {title.toLowerCase()}</label>
        <input
          className="w-full max-w-xs rounded-[9px] border border-[#cedbd2] bg-white px-3 py-3 outline-green"
          id={`${type}-search`}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search customer or number"
          type="search"
          value={query}
        />
        <span className="text-sm text-muted">Open a document using its number</span>
      </div>
      <div className="overflow-x-auto rounded-[14px] border border-line bg-white">
        <table className="w-full min-w-170 border-collapse text-left text-sm">
          <caption className="sr-only">{title} stored in this browser</caption>
          <thead><tr>{['Number', 'Customer', 'Issued', 'Due', 'Amount', 'Status'].map((heading) => <th className="border-b border-line p-4 text-xs uppercase tracking-wide text-muted" key={heading} scope="col">{heading}</th>)}</tr></thead>
          <tbody>
            {filtered.map((document) => (
              <tr className="hover:bg-[#f7faf6]" key={document.id}>
                <td className="border-b border-line p-4"><Link className="font-bold text-green underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-green" to={`/app/documents/${document.id}`}>{document.number}</Link></td>
                <td className="border-b border-line p-4">{document.customer}</td>
                <td className="border-b border-line p-4">{document.date}</td>
                <td className="border-b border-line p-4">{document.due || 'On receipt'}</td>
                <td className="border-b border-line p-4 font-bold">{formatMoney(calculateDocumentTotals(document).totalMinor, document.currency)}</td>
                <td className="border-b border-line p-4"><StatusPill status={document.status} /></td>
              </tr>
            ))}
            {!filtered.length && <tr><td className="p-4 text-muted" colSpan="6">No records found. Create your first {type.toLowerCase()}.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
