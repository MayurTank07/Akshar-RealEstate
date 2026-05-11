export default function BrandLogo({ compact = false, light = false }) {
  return (
    <span className="inline-flex min-w-0 items-center gap-2.5">
      <img
        src="/akshar-logo-512.jpeg"
        alt="Akshar Real Estate logo"
        className="h-10 w-10 shrink-0 rounded-2xl object-cover shadow-lg shadow-slate-950/10 ring-1 ring-white/50"
      />
      {!compact && (
        <span className={`truncate text-left font-extrabold tracking-tight ${light ? "text-white" : "text-slate-950"}`}>
          Akshar Real Estate
        </span>
      )}
    </span>
  );
}
