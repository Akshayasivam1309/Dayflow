import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import StatusBadge from "../components/StatusBadge";
import { api } from "../api/client";

export default function Attendance() {
  const [records, setRecords] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api.getMyAttendance().then((d) => setRecords(d.attendance)).catch((e) => setError(e.message));
  }, []);

  const presentCount = records.filter((r) => r.status === "PRESENT").length;
  const leaveCount = records.filter((r) => r.status === "LEAVE").length;

  return (
    <Layout title="My Attendance" subtitle="Your daily check-in and check-out history.">
      {error && <div className="form-error">{error}</div>}

      <div className="stat-grid">
        <div className="stat-card"><div className="label">Total records</div><div className="value">{records.length}</div></div>
        <div className="stat-card"><div className="label">Present days</div><div className="value accent">{presentCount}</div></div>
        <div className="stat-card"><div className="label">Leave days</div><div className="value">{leaveCount}</div></div>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Date</th><th>Check-in</th><th>Check-out</th><th>Status</th></tr>
          </thead>
          <tbody>
            {records.length === 0 && <tr className="empty-row"><td colSpan={4}>No attendance records yet.</td></tr>}
            {records.map((r) => (
              <tr key={r.id}>
                <td>{r.date}</td>
                <td>{r.check_in ? new Date(r.check_in).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—"}</td>
                <td>{r.check_out ? new Date(r.check_out).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—"}</td>
                <td><StatusBadge status={r.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
