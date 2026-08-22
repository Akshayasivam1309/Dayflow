import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import StatusBadge from "../components/StatusBadge";
import { api } from "../api/client";

const FILTERS = ["PENDING", "APPROVED", "REJECTED", "ALL"];

export default function AdminLeaves() {
  const [leaves, setLeaves] = useState([]);
  const [filter, setFilter] = useState("PENDING");
  const [error, setError] = useState("");
  const [commentDrafts, setCommentDrafts] = useState({});

  const load = async () => {
    try {
      const query = filter === "ALL" ? "" : `?status=${filter}`;
      const d = await api.getAllLeaves(query);
      setLeaves(d.leave_requests);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => { load(); }, [filter]);

  const handleReview = async (id, status) => {
    setError("");
    try {
      await api.reviewLeave(id, { status, admin_comment: commentDrafts[id] || "" });
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Layout title="Leave Approvals" subtitle="Review pending requests and record your decision.">
      {error && <div className="form-error">{error}</div>}

      <div className="pill-group" style={{ marginBottom: 18 }}>
        {FILTERS.map((f) => (
          <button key={f} className={"filter-pill" + (filter === f ? " active" : "")} onClick={() => setFilter(f)}>
            {f.charAt(0) + f.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Employee</th><th>Type</th><th>Dates</th><th>Remarks</th><th>Status</th><th>Decision</th></tr>
          </thead>
          <tbody>
            {leaves.length === 0 && <tr className="empty-row"><td colSpan={6}>No leave requests found.</td></tr>}
            {leaves.map((l) => (
              <tr key={l.id}>
                <td>{l.full_name} <span style={{ color: "var(--df-text-faint)" }}>({l.employee_id})</span></td>
                <td>{l.leave_type}</td>
                <td>{l.start_date} → {l.end_date}</td>
                <td>{l.remarks || "—"}</td>
                <td><StatusBadge status={l.status} /></td>
                <td>
                  {l.status === "PENDING" ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 200 }}>
                      <input
                        placeholder="Comment (optional)"
                        value={commentDrafts[l.id] || ""}
                        onChange={(e) => setCommentDrafts({ ...commentDrafts, [l.id]: e.target.value })}
                        style={{ padding: "6px 8px", borderRadius: 6, border: "1px solid var(--df-border)", fontSize: 12.5 }}
                      />
                      <div style={{ display: "flex", gap: 6 }}>
                        <button className="btn btn-success btn-sm" onClick={() => handleReview(l.id, "APPROVED")}>Approve</button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleReview(l.id, "REJECTED")}>Reject</button>
                      </div>
                    </div>
                  ) : (
                    <span style={{ fontSize: 12.5, color: "var(--df-text-muted)" }}>{l.admin_comment || "—"}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
