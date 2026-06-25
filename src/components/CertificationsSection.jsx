import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { publicApi } from "../services/api";

function CertModal({ cert, onClose }) {
  const overlayRef = useRef(null);

  useEffect(() => {
    const handleKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return createPortal(
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div className="relative max-h-[90vh] max-w-3xl w-full rounded-2xl overflow-hidden shadow-2xl bg-white">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 flex items-center justify-center w-9 h-9 rounded-full bg-white/90 shadow hover:bg-white transition"
          aria-label="Close preview"
        >
          <X size={18} className="text-slate-700" />
        </button>
        <img
          src={cert.image}
          alt={cert.title || "Certification"}
          className="w-full max-h-[80vh] object-contain"
          loading="lazy"
        />
        {(cert.title || cert.description) && (
          <div className="px-6 py-4 border-t border-slate-100">
            {cert.title && <p className="font-bold text-slate-900 text-lg">{cert.title}</p>}
            {cert.description && <p className="text-slate-500 text-sm mt-1">{cert.description}</p>}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}

export default function CertificationsSection() {
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    let cancelled = false;
    publicApi
      .certifications()
      .then((res) => { if (!cancelled) setCerts(res.data || []); })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  if (loading || !certs.length) return null;

  return (
    <>
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="mb-14 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-blue-600 mb-3">Recognition &amp; Trust</p>
            <h2 className="text-4xl md:text-5xl font-light tracking-tight text-slate-900">
              Achievements &amp; <span className="font-semibold text-blue-600">Certifications</span>
            </h2>
            <div className="mx-auto mt-5 h-px w-24 bg-blue-600 opacity-40" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {certs.map((cert) => (
              <button
                key={cert._id}
                onClick={() => setSelected(cert)}
                className="group flex flex-col items-center rounded-2xl border border-slate-100 bg-white p-5 shadow-sm hover:shadow-2xl hover:border-blue-100 hover:-translate-y-1 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 w-full text-left"
                aria-label={`Preview ${cert.title || "certification"}`}
              >
                <div className="relative w-full aspect-[4/3] overflow-hidden rounded-xl bg-slate-50 flex items-center justify-center">
                  <img
                    src={cert.image}
                    alt={cert.title || "Certification"}
                    loading="lazy"
                    className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/5 transition-colors duration-300 rounded-xl pointer-events-none" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="rounded-full bg-white/95 px-4 py-1.5 text-xs font-bold text-blue-700 shadow-md">View</span>
                  </div>
                </div>
                {cert.title && (
                  <p className="mt-4 text-center text-sm font-semibold text-slate-700 leading-snug line-clamp-2 w-full">{cert.title}</p>
                )}
                {cert.description && (
                  <p className="mt-1 text-center text-xs text-slate-400 leading-relaxed line-clamp-2 w-full">{cert.description}</p>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {selected && <CertModal cert={selected} onClose={() => setSelected(null)} />}
    </>
  );
}
