import { formatMoney } from '../utils/money.js';

export default function CurrencyTotals({ emptyLabel = 'No amount yet', totals }) {
  const entries = Object.entries(totals);
  if (!entries.length) return <span className="text-muted">{emptyLabel}</span>;
  return (
    <span className="flex flex-wrap gap-x-3 gap-y-1">
      {entries.map(([currency, amount]) => (
        <span key={currency}>{formatMoney(amount, currency)}</span>
      ))}
    </span>
  );
}
