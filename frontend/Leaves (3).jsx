import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "../components/Layout";
import { api } from "../api/client";

export default function AdminEmployeeDetail() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState(null);
  const [salaryForm, setSalaryForm] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const d = await api.getEmployee(id);
    setProfile(d.profile);
    setForm({
      full_name: d.profile.full_name,
      phone: d.profile.phone || "",
      address: d.profile.address || "",
      designation: d.profile.job_details?.designation || "",
      department: d.profile.job_details?.department || "",
      date_of_joining: d.profile.job_details?.date_of_joining || "",
      employment_type: d.profile.job_details?.employment_type || "Full-Time",
      manager_name: d.profile.job_details?.manager_name || "",
    });
    const payroll = await api.getPayrollByUser(id).catch(() => null);
    if (payroll) {
      setSalaryForm({
        basic: payroll.payroll.basic,
        hra: payroll.payroll.hra,
        allowances: payroll.payroll.allowances,
        deductions: payroll.payroll.deductions,
        ctc_annual: payroll.payroll.ctc_annual,
      });
    }
  };

  useEffect(() => { load(); }, [id]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setError(""); setSuccess(""); setSaving(true);
    try {
      await api.updateEmployee(id, {
        full_name: form.full_name,
        phone: form.phone,
        address: form.address,
        job_details: {
          designation: form.designation,
          department: form.department,
          date_of_joining: form.date_of_joining,
          employment_type: form.employment_type,
          manager_name: form.manager_name,
        },
      });
      setSuccess("Employee details updated.");
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSalary = async (e) => {
    e.preventDefault();
    setError(""); setSuccess(""); setSaving(true);
    try {
      await api.updatePayroll(id, salaryForm);
      setSuccess("Salary structure updated.");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (!profile || !form) return <div className="loading-screen">Loading employee…</div>;

  return (
    <Layout title={profile.full_name} subtitle={`${profile.employee_id} · ${profile.email}`}>
      <Link to="/admin/employees" style={{ fontSize: 13, color: "var(--df-primary)", fontWeight: 600 }}>&larr; Back to employees</Link>

      {error && <div className="form-error" style={{ marginTop: 16 }}>{error}</div>}
      {success && <div className="form-success" style={{ marginTop: 16 }}>{success}</div>}

      <div className="section" style={{ marginTop: 20 }}>
        <div className="section-head"><h2>Profile &amp; job details</h2></div>
        <div className="card" style={{ maxWidth: 560 }}>
          <form onSubmit={handleSaveProfile}>
            <div className="field"><label>Full name</label><input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} /></div>
            <div className="field-row">
              <div className="field"><label>Phone</label><input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
              <div className="field"><label>Designation</label><input value={form.designation} onChange={(e) => setForm({ ...form, designation: e.target.value })} /></div>
            </div>
            <div className="field"><label>Address</label><textarea rows={2} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></div>
            <div className="field-row">
              <div className="field"><label>Department</label><input value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} /></div>
              <div className="field"><label>Employment type</label>
                <select value={form.employment_type} onChange={(e) => setForm({ ...form, employment_type: e.target.value })}>
                  <option>Full-Time</option><option>Part-Time</option><option>Contract</option><option>Intern</option>
                </select>
              </div>
            </div>
            <div className="field-row">
              <div className="field"><label>Date of joining</label><input type="date" value={form.date_of_joining} onChange={(e) => setForm({ ...form, date_of_joining: e.target.value })} /></div>
              <div className="field"><label>Manager</label><input value={form.manager_name} onChange={(e) => setForm({ ...form, manager_name: e.target.value })} /></div>
            </div>
            <button className="btn btn-primary" type="submit" disabled={saving}>{saving ? "Saving…" : "Save profile"}</button>
          </form>
        </div>
      </div>

      {salaryForm && (
        <div className="section">
          <div className="section-head"><h2>Salary structure</h2></div>
          <div className="card" style={{ maxWidth: 560 }}>
            <form onSubmit={handleSaveSalary}>
              <div className="field-row">
                <div className="field"><label>Basic (monthly)</label><input type="number" min="0" value={salaryForm.basic} onChange={(e) => setSalaryForm({ ...salaryForm, basic: e.target.value })} /></div>
                <div className="field"><label>HRA (monthly)</label><input type="number" min="0" value={salaryForm.hra} onChange={(e) => setSalaryForm({ ...salaryForm, hra: e.target.value })} /></div>
              </div>
              <div className="field-row">
                <div className="field"><label>Allowances (monthly)</label><input type="number" min="0" value={salaryForm.allowances} onChange={(e) => setSalaryForm({ ...salaryForm, allowances: e.target.value })} /></div>
                <div className="field"><label>Deductions (monthly)</label><input type="number" min="0" value={salaryForm.deductions} onChange={(e) => setSalaryForm({ ...salaryForm, deductions: e.target.value })} /></div>
              </div>
              <div className="field"><label>Annual CTC</label><input type="number" min="0" value={salaryForm.ctc_annual} onChange={(e) => setSalaryForm({ ...salaryForm, ctc_annual: e.target.value })} /></div>
              <button className="btn btn-primary" type="submit" disabled={saving}>{saving ? "Saving…" : "Save salary structure"}</button>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}
