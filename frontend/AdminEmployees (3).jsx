import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import StatusBadge from "../components/StatusBadge";
import { api } from "../api/client";

const STATUSES = ["PRESENT", "ABSENT", "HALF_DAY", "LEAVE"];

export default function AdminAttendance() {
  const [records, setRecords] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const d = await api.getAllAttendance(`?date=${date}`);
      setRecords(d.attendance);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => { load(); }, [date]);

  const handleStatusChange = async (id, status) => {
    try {
      await api.updateAttendanceStatus(id, status);
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Layout title="Attendance" subtitle="Review and adjust attendance records across the team.">
      {error && <div className="form-error">{error}</div>}

      <div className="field" style={{ maxWidth: 220, marginBottom: 18 }}>
        <label>Date</label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Employee</th><th>Check-in</th><th>Check-out</th><th>Status</th><th>Update</th></tr>
          </thead>
          <tbody>
            {records.length === 0 && <tr className="empty-row"><td colSpan={5}>No attendance records for this date.</td></tr>}
            {records.map((r) => (
              <tr key={r.id}>
                <td>{r.full_name} <span style={{ color: "var(--df-text-faint)" }}>({r.employee_id})</span></td>
                <td>{r.check_in ? new Date(r.check_in).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—"}</td>
                <td>{r.check_out ? new Date(r.check_out).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—"}</td>
                <td><StatusBadge status={r.status} /></td>
                <td>
                  <select value={r.status} onChange={(e) => handleStatusChange(r.id, e.target.value)} style={{ padding: "6px 8px", borderRadius: 6, border: "1px solid var(--df-border)" }}>
                    {STATUSES.map((s) => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
