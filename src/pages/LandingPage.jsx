import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Button from '../components/Button/Button.jsx';
import Logo from '../components/Logo.jsx';
import PlanOfferModal from '../components/PlanOfferModal.jsx';
import useToast from '../hooks/useToast.js';
import { buttonStyles } from '../utils/buttonStyles.js';

const eyebrow = 'text-[11px] font-extrabold uppercase tracking-[2px] text-green';
const card = 'rounded-[17px] border border-line bg-white p-6';

export default function LandingPage() {
  const [planOpen, setPlanOpen] = useState(false);
  const { showToast } = useToast();
  const location = useLocation();

  useEffect(() => {
    if (!['#how', '#pricing'].includes(location.hash)) return undefined;
    const frame = window.requestAnimationFrame(() => {
      document.querySelector(location.hash)?.scrollIntoView();
    });
    return () => window.cancelAnimationFrame(frame);
  }, [location.hash]);

  return (
    <div className="mx-auto max-w-310 phone:px-4">
      <header className="flex h-18 items-center justify-between">
        <Logo />
        <nav aria-label="Public navigation" className="flex items-center gap-7 text-sm font-bold">
          <a className="hover:text-[#26876c] tablet:hidden" href="#how">How it works</a>
          <a className="hover:text-[#26876c] tablet:hidden" href="#pricing">Pricing</a>
          <Link className="hover:text-[#26876c] tablet:hidden" to="/app/dashboard">Dashboard</Link>
          <Link className={`${buttonStyles.primary} px-3! py-2! text-[13px]`} to="/app/new">
            Create an invoice →
          </Link>
        </nav>
      </header>

      <main>
        <section className="grid grid-cols-[1.02fr_.98fr] items-center gap-13.5 py-18 pb-23 tablet:grid-cols-1 tablet:py-9">
          <div>
            <span className={eyebrow}>Made for the way you do business</span>
            <h1 className="my-4.5 font-display text-[clamp(48px,6vw,84px)] font-extrabold leading-[1.06] tracking-[-5px] phone:tracking-[-3px]">
              Get paid<br /><span className="text-green">faster.</span>
            </h1>
            <p className="max-w-142.5 text-lg leading-[1.65] text-muted">
              Create, send and track a professional invoice in under 30 seconds—built
              for African businesses serving customers anywhere in the world.
            </p>
            <div className="my-7 flex flex-wrap gap-3">
              <Link className={buttonStyles.primary} to="/app/new">Create your first invoice →</Link>
              <a className={buttonStyles.secondary} href="#how">See how it works</a>
            </div>
            <span className="text-[13px] text-muted">Preview before signing up · Free PDF available</span>
          </div>

          <div className="relative min-h-120 rounded-[30px] border border-[#c9ddce] bg-[#dceadd] p-9 tablet:min-h-90">
            <div className="mx-auto mt-5 max-w-96.25 -rotate-3 rounded-2xl bg-white p-6 shadow-[0_24px_70px_#173f2a25]">
              <div className="flex justify-between py-4"><strong className="text-[19px]">INVOICE</strong><span className="rounded-full bg-[#eef4ed] px-2.5 py-1 text-xs font-bold text-[#38644f]">#FI-2026-001</span></div>
              <div className="flex justify-between border-b border-line py-4"><div><small>FROM</small><br /><b>Northstar Studio</b></div><div className="text-right"><small>BILL TO</small><br /><b>Acme Projects</b></div></div>
              <div className="flex justify-between border-b border-line py-4"><span>Brand identity design</span><b>₦450,000</b></div>
              <div className="flex justify-between border-b border-line py-4"><span>Website design</span><b>₦400,000</b></div>
              <div className="flex justify-between py-4"><b>Total due</b><strong className="text-[25px]">₦850,000</strong></div>
            </div>
            <div className="absolute bottom-5 right-4.5 rotate-[4deg] rounded-[14px] bg-ink px-6 py-4 text-sm text-white">
              ✓ Payment recorded <b>₦850,000</b>
            </div>
          </div>
        </section>

        <section className="py-17.5" id="how">
          <span className={eyebrow}>A simpler way to invoice</span>
          <h2 className="my-3 font-display text-[clamp(31px,4vw,48px)] font-extrabold leading-[1.15] tracking-[-2px]">
            From “please send an invoice”<br />to sent in moments.
          </h2>
          <div className="grid grid-cols-3 gap-4 tablet:grid-cols-1">
            {[
              ['01 / Create', 'Type it naturally', 'Add your customer and items or paste a client request. Check every detail before sending.'],
              ['02 / Send', 'Share where they are', 'Send a link through WhatsApp or email, or download a polished PDF.'],
              ['03 / Collect', 'Know what is owed', 'See document status, follow up with a considerate reminder and record payment.'],
            ].map(([step, title, description]) => (
              <article className={card} key={step}>
                <span className={eyebrow}>{step}</span>
                <h3 className="my-4 text-[19px] font-bold">{title}</h3>
                <p className="leading-[1.55] text-muted">{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="flex items-center justify-between gap-5 rounded-[25px] bg-ink p-11.25 text-white phone:block phone:p-7">
          <div><h2 className="font-display text-[32px] font-extrabold">Your next invoice is waiting.</h2><p className="mt-2 text-[#c5d4ce]">Create a preview without an account.</p></div>
          <Link className={`${buttonStyles.accent} phone:mt-5`} to="/app/new">Try the invoice builder →</Link>
        </section>

        <section className="py-17" id="pricing">
          <span className={eyebrow}>Simple plans for growing businesses</span>
          <h2 className="my-3 font-display text-[clamp(31px,4vw,48px)] font-extrabold leading-[1.15] tracking-[-2px]">Start free. Grow into more.</h2>
          <div className="grid grid-cols-3 gap-4 tablet:grid-cols-1">
            <article className="rounded-[17px] border border-line bg-white p-6 text-ink"><h3 className="text-lg font-bold">Free</h3><strong className="my-4 block font-display text-[31px] font-extrabold">₦0</strong><p className="text-muted">Make a great first impression.</p><ul className="my-4 list-disc pl-5 leading-8"><li>Up to 3 invoices per month</li><li>Instant preview and PDF</li><li>FastestInvoice branding</li></ul><Link className={buttonStyles.secondary} to="/app/new">Create free invoice</Link></article>
            <article className="rounded-[17px] border border-[#0d604d] bg-[#0d604d] p-6 text-white"><span className="text-[11px] font-extrabold uppercase tracking-[2px] text-lime">First 1,000 businesses</span><h3 className="mt-4 text-lg font-bold text-white">Founding Business</h3><strong className="my-4 block font-display text-[31px] font-extrabold text-white">₦25,000 <small className="text-[13px] text-white">/ year</small></strong><p className="text-[#d8ece2]">For businesses that invoice every week.</p><ul className="my-4 list-disc pl-5 leading-8 text-[#d8ece2]"><li>Unlimited branded documents</li><li>Saved customers and items</li><li>Live links and status tracking</li><li>Payment requests and reminders</li></ul><button className="inline-flex items-center justify-center gap-2 rounded-xl border border-transparent bg-lime px-5 py-3 font-bold text-ink transition hover:brightness-105 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-lime cursor-pointer" onClick={() => setPlanOpen(true)} type="button">Explore founding offer →</button></article>
            <article className="rounded-[17px] border border-line bg-white p-6 text-ink"><h3 className="text-lg font-bold">Business & Team</h3><strong className="my-4 block font-display text-[31px] font-extrabold">Coming later</strong><p className="text-muted">For teams with a shared workflow.</p><ul className="my-4 list-disc pl-5 leading-8"><li>Team access and roles</li><li>Recurring invoices</li><li>Advanced reporting</li></ul><Button className='cursor-pointer' onClick={() => showToast('This tier is part of a later roadmap phase.')} variant="secondary">View roadmap status</Button></article>
          </div>
          <p className="mt-5 text-xs leading-5 text-muted">Prototype pricing from the July 2026 proposal. No checkout or payment is connected in this demo.</p>
        </section>
      </main>

      <footer className="border-t border-line py-9 text-[13px] text-muted">
        © FastestInvoice by Fastest · Interactive product concept · <Link to="/app/dashboard">Explore dashboard</Link>
      </footer>
      <PlanOfferModal onClose={() => setPlanOpen(false)} open={planOpen} />
    </div>
  );
}
