export default function PageHeader({ action, children, title }) {
  return (
    <header className="mb-7 flex items-center justify-between gap-4 phone:flex-col phone:items-start">
      <div>
        <h1 className="font-display text-[29px] font-extrabold tracking-[-1.4px] text-ink">
          {title}
        </h1>
        <div className="mt-1 text-sm text-muted">{children}</div>
      </div>
      {action}
    </header>
  );
}
