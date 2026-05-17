export default function SavedBadge({ count }) {
  if (!count) return null;

  return (
    <span className="ml-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-rose-500 px-1.5 text-[11px] font-extrabold leading-none text-white shadow-[0_8px_18px_rgba(244,63,94,0.28)] ring-2 ring-white">
      {count > 99 ? "99+" : count}
    </span>
  );
}
