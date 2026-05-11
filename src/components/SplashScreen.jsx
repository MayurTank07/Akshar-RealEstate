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
      className={`fixed inset-0 z-[500] grid place-items-center bg-slate-950 px-6 transition duration-500 ${
        leaving ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.28),transparent_38%),linear-gradient(135deg,rgba(15,23,42,0.94),rgba(3,7,18,1))]" />
      <div className="relative w-full max-w-md rounded-[2rem] border border-white/10 bg-white/[0.06] p-8 text-center shadow-2xl shadow-blue-950/40 backdrop-blur-xl">
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-[2rem] bg-white p-2 shadow-2xl shadow-blue-950/30">
          <img src="/akshar-logo-512.jpeg" alt="Akshar Real Estate logo" className="h-full w-full rounded-[1.5rem] object-cover" />
        </div>
        <div className="flex justify-center text-2xl">
          <BrandLogo light />
        </div>
        <p className="mt-3 text-sm font-semibold uppercase tracking-[0.24em] text-blue-100">
          The Property Hub Since 2006
        </p>
        <div className="mx-auto mt-7 h-1.5 w-48 overflow-hidden rounded-full bg-white/10">
          <div className="h-full w-2/3 animate-[akshar-loader_1.15s_ease-in-out_infinite] rounded-full bg-blue-500" />
        </div>
      </div>
    </div>
  );
}
