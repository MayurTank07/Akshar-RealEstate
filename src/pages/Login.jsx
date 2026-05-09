import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login Data:", form);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-gray-50">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="fixed top-4 left-4 z-50 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-300 flex items-center gap-2 hover:scale-105"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-medium">Back</span>
      </button>

      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md border border-gray-100">
        <h2 className="text-3xl font-bold text-center text-slate-900 mb-2">
          Login to Westfield
        </h2>
        <p className="text-center text-slate-500 mb-8">
          Enter your credentials to access your account
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
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
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300 text-slate-900 placeholder-slate-400"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
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
                className="w-full pl-10 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300 text-slate-900 placeholder-slate-400"
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

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
          >
            Sign In
          </button>
        </form>

        <p className="text-sm text-center text-slate-500 mt-8">
          Don't have an account?{" "}
          <a href="#" className="font-medium text-blue-600 hover:text-blue-700 transition-colors">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
