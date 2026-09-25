import { useState } from 'react';
import PageHeader from '../components/PageHeader.jsx';
import PlanOfferModal from '../components/PlanOfferModal.jsx';

export default function PlansPage() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <PageHeader title="Your plan">Explore the proposed launch plans.</PageHeader>
      <div className="grid grid-cols-3 gap-4 tablet:grid-cols-1">
        <article className="rounded-[17px] border border-line bg-white p-6"><h2 className="font-bold">Free</h2><strong className="my-4 block font-display text-[31px] font-extrabold">₦0</strong><p className="text-muted">Preview and PDF, up to 3 invoices monthly in the proposed live product.</p></article>
        <article className="rounded-[17px] border border-[#0d604d] bg-[#0d604d] p-6 text-white"><span className="text-[11px] font-extrabold uppercase tracking-[2px] text-lime cursor-pointer">First 1,000 businesses</span><h2 className="mt-4 font-bold text-white">Founding Business</h2><strong className="my-4 block font-display text-[31px] font-extrabold text-white">₦25,000 <small className="text-[13px] text-white">/ year</small></strong><p className="text-[#d8ece2]">For businesses that invoice every week.</p><ul className="my-4 list-disc pl-5 leading-8 text-[#d8ece2]"><li>Unlimited branded documents</li><li>Saved customers and items</li><li>Live links and status tracking</li><li>Payment requests and reminders</li></ul><button className="inline-flex items-center justify-center gap-2 rounded-xl border border-transparent bg-lime px-5 py-3 font-bold text-ink transition hover:brightness-105 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-lime" onClick={() => setOpen(true)} type="button">Explore founding offer →</button></article>
        <article className="rounded-[17px] border border-line bg-white p-6"><h2 className="font-bold">Business & Team</h2><strong className="my-4 block font-display text-[31px] font-extrabold">Later phase</strong><p className="text-muted">Team access, recurring work and deeper reports.</p></article>
      </div>
      <p className="mt-5 text-xs leading-5 text-muted">Plan limits are illustrated here; this local prototype does not enforce subscriptions.</p>
      <PlanOfferModal onClose={() => setOpen(false)} open={open} />
    </>
  );
}
