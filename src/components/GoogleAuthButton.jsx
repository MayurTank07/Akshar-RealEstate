import { useEffect, useRef, useState } from "react";

const googleScriptId = "akshar-google-identity";

function loadGoogleIdentityScript() {
  if (window.google?.accounts?.id) return Promise.resolve(window.google);
  if (window.__aksharGoogleIdentityPromise) return window.__aksharGoogleIdentityPromise;

  window.__aksharGoogleIdentityPromise = new Promise((resolve, reject) => {
    const existing = document.getElementById(googleScriptId);
    if (existing) {
      existing.addEventListener("load", () => resolve(window.google));
      existing.addEventListener("error", reject);
      return;
    }

    const script = document.createElement("script");
    script.id = googleScriptId;
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(window.google);
    script.onerror = reject;
    document.head.appendChild(script);
  });

  return window.__aksharGoogleIdentityPromise;
}

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06L5.84 9.9C6.71 7.3 9.14 5.38 12 5.38z" />
    </svg>
  );
}

export default function GoogleAuthButton({ onCredential, disabled = false, label = "Continue with Google" }) {
  const buttonRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  useEffect(() => {
    if (!clientId || !buttonRef.current) return undefined;
    let active = true;

    loadGoogleIdentityScript()
      .then((google) => {
        if (!active || !buttonRef.current) return;
        google.accounts.id.initialize({
          client_id: clientId,
          callback: async (response) => {
            if (!response?.credential) {
              setError("Google did not return a valid sign-in credential.");
              return;
            }
            setBusy(true);
            setError("");
            try {
              await onCredential(response.credential);
            } catch (err) {
              setError(err.message || "Google sign-in failed.");
            } finally {
              setBusy(false);
            }
          },
        });
        buttonRef.current.innerHTML = "";
        google.accounts.id.renderButton(buttonRef.current, {
          theme: "outline",
          size: "large",
          text: "continue_with",
          shape: "pill",
          logo_alignment: "left",
          width: Math.min(380, Math.max(260, buttonRef.current.offsetWidth || 320)),
        });
        setReady(true);
      })
      .catch(() => {
        if (active) setError("Google sign-in is unavailable right now.");
      });

    return () => {
      active = false;
    };
  }, [clientId, onCredential]);

  if (!clientId) {
    return (
      <button
        type="button"
        disabled
        className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-4 text-sm font-extrabold text-slate-400"
        title="Add VITE_GOOGLE_CLIENT_ID to enable Google sign-in"
      >
        <GoogleMark />
        {label}
      </button>
    );
  }

  return (
    <div className="space-y-2">
      <div className={`relative flex min-h-12 w-full items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm transition ${disabled || busy ? "pointer-events-none opacity-70" : "hover:border-slate-300"}`}>
        <div ref={buttonRef} className="flex w-full justify-center overflow-hidden rounded-xl" aria-label={label} />
        {(!ready || busy || disabled) && (
          <div className="absolute inset-0 flex items-center justify-center gap-3 rounded-xl bg-white/90 text-sm font-extrabold text-slate-600">
            <GoogleMark />
            {busy ? "Signing in..." : "Loading Google..."}
          </div>
        )}
      </div>
      {error && <p className="text-center text-xs font-semibold text-rose-600">{error}</p>}
    </div>
  );
}
