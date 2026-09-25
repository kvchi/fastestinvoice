export default function StatusPill({ status }) {
  const color =
    status === 'Paid'
      ? 'bg-[#dcf6e8] text-[#1d7849]'
      : status === 'Overdue'
        ? 'bg-[#fff0e7] text-[#a2521b]'
        : 'bg-[#eef4ed] text-[#38644f]';
  return (
    <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-bold ${color}`}>
      {status}
    </span>
  );
}
