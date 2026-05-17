import useSiteContent from "../hooks/useSiteContent";

export default function BrandLogo({ compact = false, light = false, large = false }) {
  const { siteName } = useSiteContent();
  const words = siteName.split(" ");
  const primary = words.slice(0, 2).join(" ") || "Akshar Estate";
  const secondary = words.slice(2).join(" ") || "The Property HUB";

  return (
    <span className="inline-flex min-w-0 items-center gap-3">
      <img
        src="/akshar-logo-512.jpeg"
        alt="Akshar Estate The Property HUB logo"
        className={`shrink-0 object-cover shadow-md ring-1 ${
          large
            ? "h-11 w-11 rounded-2xl shadow-slate-950/15 ring-white/40"
            : "h-9 w-9 rounded-xl shadow-slate-950/10 ring-white/50"
        }`}
      />
      {!compact && (
        <span className="flex min-w-0 flex-col leading-none">
          <span
            className={`font-extrabold tracking-tight ${
              large ? "text-[18px]" : "text-[14px]"
            } ${light ? "text-white" : "text-slate-950"}`}
          >
            {primary}
          </span>
          <span
            className={`font-semibold tracking-wide ${
              large ? "mt-[5px] text-[12px]" : "mt-[3px] text-[10px]"
            } ${light ? "text-blue-200" : "text-slate-500"}`}
          >
            {secondary}
          </span>
        </span>
      )}
    </span>
  );
}
