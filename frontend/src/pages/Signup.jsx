import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/signup", form);
      const params = new URLSearchParams();
      params.append("username", form.email);
      params.append("password", form.password);
      const { data } = await api.post("/login", params);
      localStorage.setItem("token", data.access_token);
      navigate("/onboarding");
    } catch (err) {
      setError(err.response?.data?.detail || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-sidebar relative overflow-hidden">
      <div className="absolute top-10 left-5 md:top-20 md:left-20 w-48 md:w-72 h-48 md:h-72 bg-primary/15 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-5 md:bottom-20 md:right-20 w-64 md:w-96 h-64 md:h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-surface rounded-3xl shadow-2xl p-6 sm:p-8 border border-card-border">
          <div className="text-center mb-8">
            <div className="text-4xl mb-3">🍔</div>
            <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
            <p className="text-muted mt-2">Sign up to start ordering</p>
          </div>
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-input-bg rounded-xl outline-none focus:ring-2 focus:ring-primary/30 text-sm border border-card-border"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-input-bg rounded-xl outline-none focus:ring-2 focus:ring-primary/30 text-sm border border-card-border"
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-input-bg rounded-xl outline-none focus:ring-2 focus:ring-primary/30 text-sm border border-card-border"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-input-bg rounded-xl outline-none focus:ring-2 focus:ring-primary/30 text-sm border border-card-border"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary text-white font-medium rounded-xl hover:bg-primary-hover shadow-lg shadow-primary/30 transition-all disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Sign Up"}
            </button>
          </form>
          <p className="text-center text-sm text-muted mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
