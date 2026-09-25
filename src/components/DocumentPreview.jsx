import { basisPointsToInput, calculateDocumentTotals, formatMoney } from '../utils/money.js';

export default function DocumentPreview({ document, settings, displayNumber = 'PREVIEW' }) {
  const { subtotalMinor, taxMinor, totalMinor, depositMinor } =
    calculateDocumentTotals(document);
  const tax = basisPointsToInput(document.taxBasisPoints || 0);

  return (
    <article className="sticky top-6 self-start rounded-[14px] border border-line bg-white p-9 shadow-[0_15px_45px_#223a2810] tablet:static phone:p-5 print:border-0 print:p-0 print:shadow-none">
      <div className="flex items-start justify-between gap-6">
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-[2px] text-green">
            {settings.business}
          </span>
          <h2 className="mt-2 font-display text-3xl font-extrabold">
            {document.type.toUpperCase()}
          </h2>
        </div>
        <div className="text-right">
          <b>{displayNumber}</b>
          <br />
          <small className="text-muted">{new Date().toLocaleDateString('en-GB')}</small>
        </div>
      </div>
      <div className="my-6 h-px bg-line" />
      <div className="flex items-start justify-between gap-6">
        <div>
          <small className="text-muted">FROM</small>
          <br />
          <b>{settings.business}</b>
          <br />
          <small>{settings.email}</small>
        </div>
        <div className="text-right">
          <small className="text-muted">BILL TO</small>
          <br />
          <b>{document.customer || 'Customer name'}</b>
          <br />
          <small>{document.email}</small>
        </div>
      </div>
      <div className="my-6 h-px bg-line" />
      <table className="w-full border-collapse text-left">
        <thead>
          <tr>
            <th className="border-b border-line px-1 py-3 text-xs uppercase tracking-wide text-muted">
              Description
            </th>
            <th className="border-b border-line px-1 py-3 text-right text-xs uppercase tracking-wide text-muted">
              Amount
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border-b border-line px-1 py-3">
              {document.item || 'Your service or item'}
            </td>
            <td className="border-b border-line px-1 py-3 text-right">
              {formatMoney(subtotalMinor, document.currency)}
            </td>
          </tr>
        </tbody>
      </table>
      {taxMinor > 0 && (
        <p className="mt-4 text-right">
          Tax ({tax}%): {formatMoney(taxMinor, document.currency)}
        </p>
      )}
      <div className="mt-5 text-right font-display text-[29px] font-extrabold">
        {formatMoney(totalMinor, document.currency)}
      </div>
      {depositMinor > 0 && (
        <p className="text-right text-muted">
          Deposit requested: {formatMoney(depositMinor, document.currency)}
        </p>
      )}
      <div className="my-6 h-px bg-line" />
      <p><b>Due:</b> {document.due || 'On receipt'}</p>
      <p className="mt-3"><b>Payment details:</b> {settings.account}</p>
      <p className="mt-3 text-muted">{document.notes || 'Thank you for your business.'}</p>
      <div className="my-6 h-px bg-line" />
      <small className="text-xs leading-6 text-muted">
        Created with FastestInvoice · Demo preview
      </small>
    </article>
  );
}
