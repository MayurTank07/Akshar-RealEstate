import { useLocation } from "react-router-dom";
import { FaWhatsapp } from "react-icons/fa";
import useSiteContent from "../hooks/useSiteContent";
import { defaultContactContent } from "../config/navigationContent";
import { DEFAULT_WHATSAPP_MESSAGE, generateWhatsAppLink } from "../utils/whatsapp";

const hiddenPrefixes = ["/admin", "/supervisor", "/stafflogin"];

export default function FloatingWhatsAppButton() {
  const location = useLocation();
  const siteContent = useSiteContent();
  const contact = { ...defaultContactContent, ...(siteContent.contactContent || {}) };
  const settings = { ...(defaultContactContent.whatsappSettings || {}), ...(contact.whatsappSettings || {}) };
  const phone = settings.phone || contact.whatsapp || import.meta.env.VITE_WHATSAPP_NUMBER || "";
  const link = generateWhatsAppLink(phone, settings.message || DEFAULT_WHATSAPP_MESSAGE);
  const hidden = hiddenPrefixes.some((prefix) => location.pathname.startsWith(prefix));
  const isPropertyPage = location.pathname.startsWith("/property") || location.pathname.startsWith("/pricing") || location.pathname.startsWith("/purchase") || location.pathname.startsWith("/properties");
  const isHomepage = location.pathname === "/" || location.pathname === "/home";
  const displayOn = settings.displayOn || "all";
  const pageHidden =
    (displayOn === "property-pages" && !isPropertyPage) ||
    (displayOn === "homepage" && !isHomepage);
  const positionClass = settings.position === "bottom-left" ? "left-4 sm:left-6" : "right-4 sm:right-6";

  if (hidden || pageHidden || settings.enabled === false || !link) return null;

  return (
    <a
      href={link}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with us on WhatsApp"
      className={`group fixed bottom-5 z-[70] grid h-14 w-14 place-items-center rounded-2xl bg-[#25D366] text-white shadow-[0_18px_45px_rgba(37,211,102,0.35)] ring-1 ring-white/60 transition duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-[0_24px_60px_rgba(37,211,102,0.45)] focus:outline-none focus:ring-4 focus:ring-emerald-200 sm:bottom-6 sm:h-16 sm:w-16 ${positionClass}`}
    >
      <FaWhatsapp className="h-7 w-7 sm:h-8 sm:w-8" />
      <span className={`pointer-events-none absolute bottom-full mb-3 hidden w-max max-w-[220px] rounded-xl bg-slate-950 px-3 py-2 text-xs font-bold text-white opacity-0 shadow-xl transition group-hover:block group-hover:opacity-100 sm:block sm:translate-y-1 sm:group-hover:translate-y-0 ${settings.position === "bottom-left" ? "left-0" : "right-0"}`}>
        Chat with us on WhatsApp
      </span>
    </a>
  );
}
