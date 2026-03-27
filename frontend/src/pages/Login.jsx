import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("username", email);
      params.append("password", password);
      const { data } = await api.post("/login", params);
      localStorage.setItem("token", data.access_token);
      // Check if user has set preferences; if not, redirect to onboarding
      try {
        const prefRes = await api.get("/preferences/has-preferences");
        if (!prefRes.data.has_preferences) {
          navigate("/onboarding");
          return;
        }
      } catch {
        // If check fails, just go to dashboard
      }
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.detail || "Login failed");
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
            <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
            <p className="text-muted mt-2">Sign in to order your food</p>
          </div>
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-input-bg rounded-xl outline-none focus:ring-2 focus:ring-primary/30 text-sm border border-card-border"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 bg-input-bg rounded-xl outline-none focus:ring-2 focus:ring-primary/30 text-sm border border-card-border"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary text-white font-medium rounded-xl hover:bg-primary-hover shadow-lg shadow-primary/30 transition-all disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
          <p className="text-center text-sm text-muted mt-6">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
