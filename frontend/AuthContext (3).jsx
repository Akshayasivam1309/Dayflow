import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import StatusBadge from "../components/StatusBadge";
import { api } from "../api/client";

export default function Leaves() {
  const [leaves, setLeaves] = useState([]);
  const [form, setForm] = useState({ leave_type: "PAID", start_date: "", end_date: "", remarks: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    const d = await api.getMyLeaves();
    setLeaves(d.leave_requests);
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);
    try {
      await api.applyLeave(form);
      setSuccess("Leave request submitted.");
      setForm({ leave_type: "PAID", start_date: "", end_date: "", remarks: "" });
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout title="Leave Requests" subtitle="Apply for time off and track approval status.">
      <div className="section">
        <div className="section-head"><h2>Apply for leave</h2></div>
        <div className="card" style={{ maxWidth: 520 }}>
          {error && <div className="form-error">{error}</div>}
          {success && <div className="form-success">{success}</div>}
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label>Leave type</label>
              <select value={form.leave_type} onChange={(e) => setForm({ ...form, leave_type: e.target.value })}>
                <option value="PAID">Paid</option>
                <option value="SICK">Sick</option>
                <option value="UNPAID">Unpaid</option>
              </select>
            </div>
            <div className="field-row">
              <div className="field">
                <label>Start date</label>
                <input type="date" required value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} />
              </div>
              <div className="field">
                <label>End date</label>
                <input type="date" required value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} />
              </div>
            </div>
            <div className="field">
              <label>Remarks (optional)</label>
              <textarea rows={3} value={form.remarks} onChange={(e) => setForm({ ...form, remarks: e.target.value })} placeholder="Reason for leave" />
            </div>
            <button className="btn btn-primary" type="submit" disabled={submitting}>
              {submitting ? "Submitting…" : "Submit request"}
            </button>
          </form>
        </div>
      </div>

      <div className="section">
        <div className="section-head"><h2>My leave history</h2></div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Type</th><th>Dates</th><th>Remarks</th><th>Status</th><th>HR comment</th></tr></thead>
            <tbody>
              {leaves.length === 0 && <tr className="empty-row"><td colSpan={5}>No leave requests yet.</td></tr>}
              {leaves.map((l) => (
                <tr key={l.id}>
                  <td>{l.leave_type}</td>
                  <td>{l.start_date} → {l.end_date}</td>
                  <td>{l.remarks || "—"}</td>
                  <td><StatusBadge status={l.status} /></td>
                  <td>{l.admin_comment || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
