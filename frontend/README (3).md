import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api/client";

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ full_name: "", employee_id: "", email: "", password: "", role: "EMPLOYEE" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [verifyToken, setVerifyToken] = useState("");

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const data = await api.signup(form);
      setSuccess("Account created! Verify your email to continue.");
      setVerifyToken(data.verification_token);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    setError("");
    try {
      await api.verifyEmail(verifyToken);
      navigate("/login");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-visual">
        <div className="brand">
          <div className="mark" />
          Dayflow
        </div>
        <div>
          <div className="headline">One place for onboarding, attendance, leave, and payroll.</div>
          <div className="tagline">Set up your account in under a minute.</div>
        </div>
      </div>

      <div className="auth-form-side">
        <div className="auth-card">
          <h1>Create your account</h1>
          <div className="lead">Register as an employee or HR admin.</div>

          {error && <div className="form-error">{error}</div>}
          {success && <div className="form-success">{success}</div>}

          {!success ? (
            <form onSubmit={handleSubmit}>
              <div className="field">
                <label>Full name</label>
                <input required value={form.full_name} onChange={update("full_name")} placeholder="Jordan Lee" />
              </div>
              <div className="field-row">
                <div className="field">
                  <label>Employee ID</label>
                  <input required value={form.employee_id} onChange={update("employee_id")} placeholder="EMP010" />
                </div>
                <div className="field">
                  <label>Role</label>
                  <select value={form.role} onChange={update("role")}>
                    <option value="EMPLOYEE">Employee</option>
                    <option value="ADMIN">HR Admin</option>
                  </select>
                </div>
              </div>
              <div className="field">
                <label>Email</label>
                <input type="email" required value={form.email} onChange={update("email")} placeholder="you@company.com" />
              </div>
              <div className="field">
                <label>Password</label>
                <input type="password" required value={form.password} onChange={update("password")} placeholder="••••••••" />
                <div className="hint">At least 8 characters, with a letter and a number.</div>
              </div>
              <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
                {loading ? "Creating account…" : "Create account"}
              </button>
            </form>
          ) : (
            <div>
              <p style={{ fontSize: 13.5, color: "var(--df-text-muted)", marginBottom: 14 }}>
                In production this link would be emailed to you. For this demo, confirm verification below:
              </p>
              <button className="btn btn-primary btn-block" onClick={handleVerify}>
                Verify email &amp; continue to sign in
              </button>
            </div>
          )}

          <div className="auth-switch">
            Already have an account? <Link to="/login">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
