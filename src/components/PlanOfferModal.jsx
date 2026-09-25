import Button from './Button/Button.jsx';
import Modal from './Modal.jsx';
import useToast from '../hooks/useToast.js';

export default function PlanOfferModal({ onClose, open }) {
  const { showToast } = useToast();
  return (
    <Modal onClose={onClose} open={open} title="Stop rebuilding invoices. Start getting paid.">
      <span className="text-[11px] font-extrabold uppercase tracking-[2px] text-green">
        Founding Business
      </span>
      <p className="mt-4 text-muted">
        ₦25,000 per year for the first 1,000 businesses. Unlimited branded documents,
        saved customers, tracking and follow-up.
      </p>
      <p className="mt-4 text-xs leading-5 text-muted">
        The proposal includes a 14-day time-saving refund promise. This prototype does
        not accept payment or reserve a slot.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Button
          className="cursor-pointer"
          onClick={() => {
            showToast('Checkout is not connected in this prototype.');
            onClose();
          }}
        >
          Continue to checkout (demo)
        </Button>
        <Button className="cursor-pointer" onClick={onClose} variant="ghost">Close</Button>
      </div>
    </Modal>
  );
}
