export function Footer() {
  return (
    <footer className="relative border-t border-subtle py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 text-center text-[0.78rem] text-muted sm:flex-row sm:px-8 sm:text-left">
        <div>
          <span className="font-medium text-secondary">Roshan AI LLC</span>{' '}
          · Arizona, USA
        </div>
        <div>
          © {new Date().getFullYear()} Roshan AI · Building the future, one
          problem at a time.
        </div>
      </div>
    </footer>
  );
}
