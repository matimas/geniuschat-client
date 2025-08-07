// src/pages/AuthPage.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const API = process.env.REACT_APP_API_BASE || "http://localhost:5000";

export default function AuthPage({ mode = "login" }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");

    try {
      const { data } = await axios.post(`${API}/api/auth/${mode}`, { email, password });
      localStorage.setItem("token", data.token);
      navigate("/");                // עובר לצ'אט
    } catch (e) {
      setErr(e.response?.data?.msg || "שגיאה");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow w-full max-w-sm space-y-4 text-right">
        <h2 className="text-2xl font-bold text-center">
          {mode === "login" ? "התחברות" : "הרשמה"}
        </h2>

        {err && <p className="text-red-600 text-sm">{err}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded focus:outline-none"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded focus:outline-none"
          required
        />

        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          {mode === "login" ? "התחבר" : "צור חשבון"}
        </button>

        <p className="text-sm text-center">
          {mode === "login" ? "אין חשבון? " : "יש חשבון? "}
          <Link
            to={mode === "login" ? "/register" : "/login"}
            className="text-blue-600 underline"
          >
            {mode === "login" ? "הרשמה" : "התחברות"}
          </Link>
        </p>
      </form>
    </div>
  );
}
