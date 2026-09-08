import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../store/Usercontext";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const navigate = useNavigate();
  const { setUser,setToken } = useUser();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const data = { name, email, password };
      const res = await axios.post(
        "http://localhost:5000/api/v1/signup",
        data,
        { withCredentials: true },
      );
      setUser(res.data.user);
      setToken(res.data.AccessToken || res.data.Accesstoken || res.data.accessToken);

      setMessage({
        text: res.data.message || "Account created!",
        type: "success",
      });
      navigate("/home");
    } catch (error) {
      const errMsg = error.response?.data?.message || "Something went wrong!";
      setMessage({ text: errMsg, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-grid" />

      <div className="auth-card">
        <div className="auth-brand">
          <div className="auth-brand-icon">⚡</div>
          <span className="auth-brand-name">E-System</span>
        </div>

        <div className="auth-header">
          <h1 className="auth-title">Create account</h1>
          <p className="auth-subtitle">Join E-System today — it's free!</p>
        </div>

        {message.text && (
          <div
            className={`auth-alert ${message.type}`}
            style={{ marginBottom: "1rem" }}
          >
            {message.type === "success" ? "✅" : "⚠️"} {message.text}
          </div>
        )}

        <form className="auth-form" onSubmit={handleRegister}>
          <div className="form-group">
            <label className="form-label" htmlFor="reg-name">
              Full Name
            </label>
            <div className="form-input-wrapper">
              <span className="form-input-icon">👤</span>
              <input
                id="reg-name"
                type="text"
                className="form-input"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="name"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-email">
              Email
            </label>
            <div className="form-input-wrapper">
              <span className="form-input-icon">✉️</span>
              <input
                id="reg-email"
                type="email"
                className="form-input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-password">
              Password
            </label>
            <div className="form-input-wrapper">
              <span className="form-input-icon">🔒</span>
              <input
                id="reg-password"
                type="password"
                className="form-input"
                placeholder="Create a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
            </div>
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading && <span className="btn-spinner" />}
            {loading ? "Creating account..." : "Create Account →"}
          </button>
        </form>

        <div className="auth-divider">or</div>

        <p className="auth-redirect">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
