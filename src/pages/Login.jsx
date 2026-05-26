import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
import useAuth from "../contexts/useAuth";
import { findCredential } from "../data/authUsers";
import { userApi } from "../services/api";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const redirectTo = location.state?.redirectTo || "/";
  const redirectState = location.state?.redirectState;
  const message = location.state?.message;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const matchedCredential = findCredential(form.email, form.password);
      if (matchedCredential) {
        const nextPath = redirectTo === "/" ? matchedCredential.dashboardPath : redirectTo;
        login({
          email: matchedCredential.email,
          name: matchedCredential.name,
          role: matchedCredential.role,
        });
        navigate(nextPath, { replace: true, state: redirectState });
        return;
      }

      const response = await userApi.login(form);
      login(response.user, response.token);
      navigate(redirectTo, { replace: true, state: redirectState });
    } catch (err) {
      setError(err.message || "Unable to sign in. Please check your details.");
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
          Login to Akshar Estate The Property HUB
        </h2>
        <p className="mb-8 text-center text-sm text-slate-500">
          Enter your credentials to access your account
        </p>

        {message && (
          <div className="mb-6 rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700">
            {message}
          </div>
        )}
        {error && (
          <div className="mb-6 rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="wf-label">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="wf-input bg-slate-50 pl-10 pr-4"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div>
            <label className="wf-label">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                className="wf-input bg-slate-50 pl-10 pr-12"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2 text-sm text-slate-600">
              <input
                type="checkbox"
                className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
              />
              <span>Remember me</span>
            </label>
            <a
              href="#"
              className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
            >
              Forgot Password?
            </a>
          </div>

          <button type="submit" disabled={loading} className="wf-btn wf-btn-primary w-full disabled:cursor-not-allowed disabled:opacity-70">
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-sm text-center text-slate-500 mt-8">
          Don't have an account?{" "}
          <button type="button" onClick={() => navigate("/register", { state: { redirectTo, redirectState } })} className="font-bold text-blue-600 transition-colors hover:text-blue-700">
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
}
