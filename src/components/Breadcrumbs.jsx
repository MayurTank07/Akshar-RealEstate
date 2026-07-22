import { Link } from "react-router-dom";

export default function Breadcrumbs({ items = [], className = "" }) {
  const crumbs = items.filter(Boolean);
  if (!crumbs.length) return null;

  return (
    <nav aria-label="Breadcrumb" className={`text-sm font-semibold text-slate-500 ${className}`}>
      <ol className="flex flex-wrap items-center gap-2">
        {crumbs.map((item, index) => (
          <li key={`${item.href || item.label}-${index}`} className="flex items-center gap-2">
            {index > 0 && <span className="text-slate-300">/</span>}
            {item.href && index < crumbs.length - 1 ? (
              <Link to={item.href} className="text-slate-600 transition hover:text-blue-700">
                {item.label}
              </Link>
            ) : (
              <span className="text-slate-900">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
