import { Link } from 'react-router-dom';
import { buttonStyles } from '../utils/buttonStyles.js';

export default function NotFoundPage() {
  return (
    <main className="mx-auto max-w-2xl px-5 py-24 text-center">
      <span className="text-[11px] font-extrabold uppercase tracking-[2px] text-green">404</span>
      <h1 className="my-4 font-display text-5xl font-extrabold tracking-[-2px]">This page is not on the books.</h1>
      <p className="mb-7 text-lg text-muted">The page may have moved, or the address may be incorrect.</p>
      <Link className={buttonStyles.primary} to="/">Return to FastestInvoice</Link>
    </main>
  );
}
