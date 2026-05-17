import { useEffect, useState } from "react";
import BrandLogo from "./BrandLogo";

export default function SplashScreen() {
  const [visible, setVisible] = useState(() => !sessionStorage.getItem("aksharSplashSeen"));
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (!visible) return undefined;

    const leaveTimer = setTimeout(() => setLeaving(true), 1150);
    const hideTimer = setTimeout(() => {
      sessionStorage.setItem("aksharSplashSeen", "true");
      setVisible(false);
    }, 1550);

    return () => {
      clearTimeout(leaveTimer);
      clearTimeout(hideTimer);
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[500] grid place-items-center overflow-hidden bg-[#f8fafc] px-6 transition duration-700 ${
        leaving ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(37,99,235,0.16),transparent_34%),linear-gradient(180deg,#ffffff_0%,#f8fafc_55%,#eff6ff_100%)]" />
      <div className="absolute left-1/2 top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue-100/80 animate-[akshar-orbit_3s_ease-in-out_infinite]" />
      <div className="absolute left-1/2 top-1/2 h-[24rem] w-[24rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-slate-200/80 animate-[akshar-orbit_2.4s_ease-in-out_infinite_reverse]" />

      <div className="relative w-full max-w-md text-center">
        <div className="mx-auto mb-7 flex h-24 w-24 items-center justify-center rounded-[2rem] bg-white p-2 shadow-[0_24px_70px_rgba(37,99,235,0.2)] ring-1 ring-slate-200 animate-[akshar-logo-rise_900ms_cubic-bezier(.2,.8,.2,1)_both]">
          <img src="/akshar-logo-512.jpeg" alt="Akshar Estate The Property HUB logo" className="h-full w-full rounded-[1.45rem] object-cover" />
        </div>
        <div className="flex justify-center text-2xl animate-[akshar-fade-up_900ms_180ms_cubic-bezier(.2,.8,.2,1)_both]">
          <BrandLogo />
        </div>
        <p className="mt-4 text-xs font-extrabold uppercase tracking-[0.28em] text-blue-600 animate-[akshar-fade-up_900ms_300ms_cubic-bezier(.2,.8,.2,1)_both]">
          Premium Gujarat Real Estate
        </p>
        <div className="mx-auto mt-8 h-1.5 w-56 overflow-hidden rounded-full bg-slate-200/80 shadow-inner animate-[akshar-fade-up_900ms_420ms_cubic-bezier(.2,.8,.2,1)_both]">
          <div className="h-full w-2/3 animate-[akshar-loader_1.15s_ease-in-out_infinite] rounded-full bg-gradient-to-r from-blue-600 via-sky-500 to-teal-500" />
        </div>
      </div>
    </div>
  );
}
