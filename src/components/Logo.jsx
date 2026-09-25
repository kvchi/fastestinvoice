import { Link } from 'react-router-dom';

export default function Logo({ hoverable = false, inverse = false }) {
  return (
    <Link
      aria-label="FastestInvoice home"
      className={`font-display text-[23px] font-extrabold tracking-[-1.3px] ${inverse ? 'text-white' : 'text-ink'}`}
      to="/"
    >
      <span className={hoverable ? 'hover:text-green' : undefined}>fastest</span><span className={inverse ? 'text-lime' : 'text-green'}>invoice.</span>
    </Link>
  );
}
