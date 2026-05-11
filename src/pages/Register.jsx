import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useAuth from "../contexts/useAuth";
import { User, Mail, Phone, ArrowLeft } from "lucide-react";

export default function Register() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const redirectTo = location.state?.redirectTo || "/";
  const redirectState = location.state?.redirectState;
  const fromCall = location.state?.fromCall || false;
  const property = location.state?.property || null;

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = (e) => {
    e.preventDefault();

    // Save user using AuthContext
    login(form);

    // Check if this registration is from a Call Now button click
    if (fromCall) {
      // Redirect back to property page with call intent
      const redirectState = property ? { 
        property: property,
        fromCall: true,
        triggerCall: true 
      } : { fromCall: true, triggerCall: true };
      
      navigate(redirectTo, { state: redirectState });
    } else {
      // Normal registration flow
      navigate(redirectTo, { state: redirectState || { enquiry: true } });
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
          Register to continue with Akshar Real Estate
        </p>

        <form onSubmit={handleRegister} className="space-y-6">
          
          {/* Name */}
          <div>
            <label className="wf-label">
              Full Name
            </label>

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

          {/* Email */}
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
                placeholder="Enter your email"
                className="wf-input bg-slate-50 pl-10 pr-4"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="wf-label">
              Phone Number
            </label>

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

          {/* Submit Button */}
          <button type="submit" className="wf-btn wf-btn-primary w-full">
            Create Account
          </button>
        </form>

        <p className="text-sm text-center text-slate-500 mt-8">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login", { state: { redirectTo, redirectState } })}
            className="font-medium text-blue-600 hover:text-blue-700 transition-colors cursor-pointer"
          >
            Sign In
          </span>
        </p>
      </div>
    </div>
  );
}
