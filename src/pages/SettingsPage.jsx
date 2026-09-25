import { useState } from 'react';
import Button from '../components/Button/Button.jsx';
import PageHeader from '../components/PageHeader.jsx';
import useApp from '../hooks/useApp.js';
import useToast from '../hooks/useToast.js';

const fieldClass = 'w-full rounded-[9px] border border-[#cedbd2] bg-white px-3 py-3 outline-green';
const labelClass = 'mb-1.5 block text-xs font-bold text-[#3b5549]';
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SettingsPage() {
  const { saveSettings, settings } = useApp();
  const { showToast } = useToast();
  const [form, setForm] = useState(settings);
  const [error, setError] = useState('');

  function update(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
    setError('');
  }

  function submit(event) {
    event.preventDefault();
    if (!form.business.trim() || !form.account.trim()) {
      setError('Business name and payment instructions are required.');
      return;
    }
    if (!EMAIL_PATTERN.test(form.email.trim())) {
      setError('Enter a valid business email address.');
      return;
    }
    saveSettings(form);
    showToast('Business details saved in this browser.');
  }

  return (
    <>
      <PageHeader title="Business settings">These details appear on the invoice preview.</PageHeader>
      <form className="max-w-175 rounded-[17px] border border-line bg-white p-6" noValidate onSubmit={submit}>
        {error && <p className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800" role="alert">{error}</p>}
        <div className="grid grid-cols-2 gap-4 phone:grid-cols-1">
          <div className="col-span-2 phone:col-auto"><label className={labelClass} htmlFor="business-name">Business name</label><input className={fieldClass} id="business-name" name="business" onChange={update} value={form.business} /></div>
          <div><label className={labelClass} htmlFor="business-email">Business email</label><input className={fieldClass} id="business-email" name="email" onChange={update} type="email" value={form.email} /></div>
          <div><label className={labelClass} htmlFor="business-phone">Phone</label><input className={fieldClass} id="business-phone" name="phone" onChange={update} value={form.phone} /></div>
          <div className="col-span-2 phone:col-auto"><label className={labelClass} htmlFor="payment-instructions">Payment instructions (demo)</label><textarea className={fieldClass} id="payment-instructions" name="account" onChange={update} rows="3" value={form.account} /></div>
        </div>
        <Button className="my-6" type="submit">Save business details</Button>
        <p className="text-xs leading-5 text-muted">In a live product, merchant verification and payment onboarding would be separate secure steps.</p>
      </form>
    </>
  );
}
