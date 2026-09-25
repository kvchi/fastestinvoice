import { Link } from 'react-router-dom';
import CurrencyTotals from '../components/CurrencyTotals.jsx';
import PageHeader from '../components/PageHeader.jsx';
import useApp from '../hooks/useApp.js';
import { buttonStyles } from '../utils/buttonStyles.js';
import { calculateDocumentTotals, groupTotalsByCurrency } from '../utils/money.js';

export default function CustomersPage() {
  const { documents } = useApp();
  const customers = [...new Set(documents.map((document) => document.customer))];
  return (
    <>
      <PageHeader action={<Link className={buttonStyles.primary} to="/app/new?type=Invoice">+ New document</Link>} title="Customers">
        A simple view of the people and businesses you bill.
      </PageHeader>
      <div className="grid grid-cols-3 gap-4 tablet:grid-cols-1">
        {customers.map((customer) => {
          const records = documents.filter((document) => document.customer === customer);
          const totals = groupTotalsByCurrency(records, (document) => calculateDocumentTotals(document).totalMinor);
          return (
            <article className="rounded-[17px] border border-line bg-white p-6" key={customer}>
              <span className="text-[11px] font-extrabold uppercase tracking-[2px] text-green">Customer</span>
              <h2 className="my-4 text-[19px] font-bold">{customer}</h2>
              <div className="mb-5 text-muted"><span>{records.length} document{records.length === 1 ? '' : 's'} · </span><CurrencyTotals totals={totals} /></div>
              <Link className={`${buttonStyles.secondary} px-3! py-2! text-[13px]`} to={`/app/new?type=Invoice&customer=${encodeURIComponent(customer)}`}>Invoice this customer</Link>
            </article>
          );
        })}
      </div>
    </>
  );
}
