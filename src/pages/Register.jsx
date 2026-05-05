import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const location = useLocation();

  const redirectTo = location.state?.redirectTo || "/";

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

    // Save user (dummy auth)
    localStorage.setItem("user", JSON.stringify(form));

    // Redirect back
    navigate(redirectTo, { state: { enquiry: true } });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form 
        onSubmit={handleRegister}
        className="bg-white p-8 rounded-xl shadow-md w-[350px]"
      >
        <h2 className="text-xl font-bold mb-6 text-center">Register</h2>

        <input
          name="name"
          placeholder="Name"
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
          required
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
          required
        />

        <input
          name="phone"
          placeholder="Phone"
          onChange={handleChange}
          className="w-full mb-5 p-2 border rounded"
          required
        />

        <button className="w-full bg-blue-600 text-white py-2 rounded font-bold">
          Register
        </button>
      </form>
    </div>
  );
}