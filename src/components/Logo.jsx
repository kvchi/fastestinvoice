import { Link } from 'react-router-dom';

export default function Logo({ inverse = false }) {
  return (
    <Link
      aria-label="FastestInvoice home"
      className={`font-display text-[23px] font-extrabold tracking-[-1.3px] ${inverse ? 'text-white' : 'text-ink'}`}
      to="/"
    >
      fastest<span className={inverse ? 'text-lime' : 'text-green'}>invoice.</span>
    </Link>
  );
}
