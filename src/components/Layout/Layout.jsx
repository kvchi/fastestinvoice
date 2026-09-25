import { NavLink, Outlet } from 'react-router-dom';
import Logo from '../Logo.jsx';

const navigation = [
  { label: 'Overview', path: '/app/dashboard', icon: '▦' },
  { label: 'Invoices', path: '/app/invoices', icon: '▤' },
  { label: 'Quotations', path: '/app/quotes', icon: '◇' },
  { label: 'Receipts', path: '/app/receipts', icon: '▣' },
  { label: 'Customers', path: '/app/customers', icon: '♙' },
  { label: 'Business settings', path: '/app/settings', icon: '⚙' },
  { label: 'Plans', path: '/app/plans', icon: '✦' },
];

const navClass = ({ isActive }) =>
  `rounded-[9px] px-3.5 py-3 text-sm transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-lime ${
    isActive ? 'bg-[#245242] text-white' : 'text-[#bed4c9]'
  }`;

function Layout() {
  return (
    <div className="min-h-screen">
      <nav
        aria-label="Application navigation"
        className="hidden gap-1 overflow-x-auto bg-[#102c26] p-2 text-white tablet:flex print:hidden"
      >
        <NavLink className="whitespace-nowrap px-3 py-2.5 text-xs" to="/">
          Home
        </NavLink>
        {navigation.map((item) => (
          <NavLink
            key={item.path}
            className={({ isActive }) =>
              `whitespace-nowrap rounded-lg px-3 py-2.5 text-xs ${isActive ? 'bg-[#245242]' : ''}`
            }
            to={item.path}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="grid min-h-screen grid-cols-[240px_1fr] tablet:grid-cols-1">
        <aside className="flex flex-col gap-1.5 bg-[#102c26] px-5 py-7 text-white tablet:hidden print:hidden">
          <div className="mx-3 mb-7 mt-1">
            <Logo inverse />
          </div>
          <nav aria-label="Primary navigation" className="flex flex-col gap-2">
            {navigation.map((item) => (
              <NavLink key={item.path} className={navClass} to={item.path}>
                <span aria-hidden="true">{item.icon}</span>&nbsp;&nbsp;{item.label}
              </NavLink>
            ))}
          </nav>
          <p className="mt-auto p-3.5 text-xs leading-5 text-[#a8c7ba]">
            INTERACTIVE PROTOTYPE
            <br />
            Sample records are stored in this browser.
          </p>
        </aside>
        <main className="mx-auto flex min-h-screen w-full max-w-337.5 flex-col justify-center px-[clamp(20px,4vw,58px)] py-8 phone:px-4 phone:py-5">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;
