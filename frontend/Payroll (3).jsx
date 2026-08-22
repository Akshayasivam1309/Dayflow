import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import { api } from "../api/client";

function money(n) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n || 0);
}

export default function AdminPayroll() {
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    api.getAllPayroll().then((d) => setRows(d.payroll)).catch((e) => setError(e.message));
  }, []);

  const filtered = rows.filter((r) =>
    (r.full_name + r.employee_id).toLowerCase().includes(search.toLowerCase())
  );
  const totalMonthly = filtered.reduce((sum, r) => sum + (r.net_monthly || 0), 0);

  return (
    <Layout title="Payroll" subtitle="Salary structures across the organization.">
      {error && <div className="form-error">{error}</div>}

      <div className="stat-grid">
        <div className="stat-card"><div className="label">Employees on payroll</div><div className="value">{rows.length}</div></div>
        <div className="stat-card"><div className="label">Total net monthly outlay</div><div className="value accent">{money(totalMonthly)}</div></div>
      </div>

      <div className="field" style={{ maxWidth: 320, marginBottom: 18 }}>
        <input placeholder="Search by name or employee ID…" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Employee</th><th>Basic</th><th>HRA</th><th>Allowances</th><th>Deductions</th><th>Net monthly</th><th></th></tr>
          </thead>
          <tbody>
            {filtered.length === 0 && <tr className="empty-row"><td colSpan={7}>No payroll records found.</td></tr>}
            {filtered.map((r) => (
              <tr key={r.user_id}>
                <td>{r.full_name} <span style={{ color: "var(--df-text-faint)" }}>({r.employee_id})</span></td>
                <td>{money(r.basic)}</td>
                <td>{money(r.hra)}</td>
                <td>{money(r.allowances)}</td>
                <td>−{money(r.deductions)}</td>
                <td style={{ fontWeight: 700 }}>{money(r.net_monthly)}</td>
                <td><Link className="btn btn-secondary btn-sm" to={`/admin/employees/${r.user_id}`}>Edit</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
