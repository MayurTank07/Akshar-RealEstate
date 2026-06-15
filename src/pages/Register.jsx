import { useCallback, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useAuth from "../contexts/useAuth";
import { User, Mail, Phone, ArrowLeft, Lock } from "lucide-react";
import { userApi } from "../services/api";
import GoogleAuthButton from "../components/GoogleAuthButton";

export default function Register() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const redirectTo = location.state?.redirectTo || "/";
  const redirectState = location.state?.redirectState;
  const fromCall = location.state?.fromCall || false;
  const fromWhatsApp = location.state?.fromWhatsApp || false;
  const property = location.state?.property || null;

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const finishAuthRedirect = useCallback(() => {
    if (fromCall) {
      navigate(redirectTo, { state: property ? { property, triggerCall: true } : { triggerCall: true } });
    } else if (fromWhatsApp) {
      navigate(redirectTo, { state: property ? { property, triggerWhatsApp: true } : { triggerWhatsApp: true } });
    } else {
      navigate(redirectTo, { state: redirectState || { enquiry: true } });
    }
  }, [fromCall, fromWhatsApp, navigate, property, redirectState, redirectTo]);

  const handleGoogleCredential = useCallback(async (credential) => {
    setError("");
    const response = await userApi.google({ credential });
    login(response.user, response.token);
    finishAuthRedirect();
  }, [finishAuthRedirect, login]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await userApi.register(form);
      login(response.user, response.token);
      finishAuthRedirect();
    } catch (err) {
      setError(err.message || "Unable to create account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-24">
      <button
        onClick={() => navigate(-1)}
        className="wf-btn wf-btn-secondary fixed left-4 top-4 z-50"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-medium">Back</span>
      </button>

      <div className="wf-card w-full max-w-md p-6 shadow-2xl sm:p-8">

        <h2 className="mb-2 text-center text-3xl font-extrabold tracking-tight text-slate-950">
          Create Account
        </h2>
        <p className="mb-8 text-center text-sm text-slate-500">
          Register to continue with Akshar Estate The Property HUB
        </p>

        {error && (
          <div className="mb-6 rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
            {error}
          </div>
        )}

        {/* Primary: Google Sign-In */}
        <GoogleAuthButton onCredential={handleGoogleCredential} disabled={loading} label="Continue with Google" />

        <div className="my-6 flex items-center gap-3">
          <span className="h-px flex-1 bg-slate-200" />
          <span className="text-xs font-extrabold uppercase tracking-[0.18em] text-slate-400">or register with email</span>
          <span className="h-px flex-1 bg-slate-200" />
        </div>

        {/* Secondary: Email / Password form */}
        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="wf-label">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="Enter your full name"
                className="wf-input bg-slate-50 pl-10 pr-4"
              />
            </div>
          </div>

          <div>
            <label className="wf-label">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
                className="wf-input bg-slate-50 pl-10 pr-4"
              />
            </div>
          </div>

          <div>
            <label className="wf-label">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
                placeholder="Enter your phone number"
                className="wf-input bg-slate-50 pl-10 pr-4"
              />
            </div>
          </div>

          <div>
            <label className="wf-label">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                minLength={8}
                placeholder="Create a secure password (min. 8 chars)"
                className="wf-input bg-slate-50 pl-10 pr-4"
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="wf-btn wf-btn-primary w-full disabled:cursor-not-allowed disabled:opacity-70">
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login", {
              state: {
                redirectTo,
                redirectState: fromCall
                  ? { triggerCall: true }
                  : fromWhatsApp
                  ? { triggerWhatsApp: true }
                  : redirectState,
              },
            })}
            className="cursor-pointer font-bold text-blue-600 transition-colors hover:text-blue-700"
          >
            Sign In
          </span>
        </p>
      </div>
    </div>
  );
}
