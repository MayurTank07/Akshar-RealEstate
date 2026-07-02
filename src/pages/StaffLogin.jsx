import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useStaffAuth } from "../contexts/useStaffAuth";
import BrandLogo from "../components/BrandLogo";

export default function StaffLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginStaff } = useStaffAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
    setError("");
  };

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const user = await loginStaff(form);
      const requested = location.state?.from?.pathname;
      const fallback = user.role === "admin" ? "/admin/dashboard" : "/supervisor/dashboard";
      navigate(requested && requested !== "/stafflogin" ? requested : fallback, { replace: true });
    } catch (err) {
      setError(err.message || "Unable to login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <button
        type="button"
        onClick={() => navigate("/")}
        className="wf-btn wf-btn-secondary fixed left-4 top-4 z-20"
      >
        <ArrowLeft size={16} />
        Website
      </button>

      <main className="mx-auto grid min-h-screen max-w-6xl grid-cols-1 lg:grid-cols-[1fr_460px]">
        <section className="hidden flex-col justify-center bg-blue-600 px-12 text-white lg:flex">
          <div className="w-fit rounded-2xl bg-white/15 p-4">
            <BrandLogo light large />
          </div>
          <h1 className="mt-8 max-w-lg text-5xl font-extrabold leading-tight tracking-tight">
            Staff workspace for Akshar Estate operations.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-blue-50">
            Manage properties, enquiries, owners, supervisors, reports, and website content from one protected dashboard.
          </p>
        </section>

        <section className="flex items-center justify-center px-5 py-20">
          <div className="wf-card w-full max-w-md p-7 shadow-2xl sm:p-9">
            <div className="mb-8">
              <div className="mb-5">
                <BrandLogo large />
              </div>
              <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-blue-600">Staff Login</p>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950">Welcome back</h2>
              <p className="mt-2 text-sm text-slate-500">Login with admin or supervisor credentials.</p>
            </div>

            {error && (
              <div className="mb-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-red-600">
                {error}
              </div>
            )}

            <form onSubmit={submit} className="space-y-5">
              <label className="block">
                <span className="wf-label">Email</span>
                <span className="relative block">
                  <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input className="wf-input pl-10" type="email" name="email" value={form.email} onChange={update} required />
                </span>
              </label>

              <label className="block">
                <span className="wf-label">Password</span>
                <span className="relative block">
                  <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input
                    className="wf-input pl-10 pr-12"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={update}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    className="absolute right-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center text-slate-400"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </span>
              </label>

              <button type="submit" disabled={loading} className="wf-btn wf-btn-primary w-full">
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}
