import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { api } from "../api/client";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ phone: "", address: "", profile_picture: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const data = await api.getMyProfile();
    setProfile(data.profile);
    setForm({
      phone: data.profile.phone || "",
      address: data.profile.address || "",
      profile_picture: data.profile.profile_picture || "",
    });
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);
    try {
      await api.updateMyProfile(form);
      setSuccess("Profile updated.");
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (!profile) return <div className="loading-screen">Loading profile…</div>;

  return (
    <Layout title="My Profile" subtitle="View your details and update your contact information.">
      <div className="section">
        <div className="section-head"><h2>Personal &amp; job details</h2></div>
        <div className="card" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 18 }}>
          <div><div className="card-sub" style={{ marginBottom: 2 }}>Full name</div><div>{profile.full_name}</div></div>
          <div><div className="card-sub" style={{ marginBottom: 2 }}>Employee ID</div><div>{profile.employee_id}</div></div>
          <div><div className="card-sub" style={{ marginBottom: 2 }}>Email</div><div>{profile.email}</div></div>
          <div><div className="card-sub" style={{ marginBottom: 2 }}>Designation</div><div>{profile.job_details?.designation || "—"}</div></div>
          <div><div className="card-sub" style={{ marginBottom: 2 }}>Department</div><div>{profile.job_details?.department || "—"}</div></div>
          <div><div className="card-sub" style={{ marginBottom: 2 }}>Date of joining</div><div>{profile.job_details?.date_of_joining || "—"}</div></div>
          <div><div className="card-sub" style={{ marginBottom: 2 }}>Employment type</div><div>{profile.job_details?.employment_type || "—"}</div></div>
          <div><div className="card-sub" style={{ marginBottom: 2 }}>Manager</div><div>{profile.job_details?.manager_name || "—"}</div></div>
        </div>
      </div>

      <div className="section">
        <div className="section-head"><h2>Documents</h2></div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Name</th><th>Uploaded</th></tr></thead>
            <tbody>
              {profile.documents.length === 0 && <tr className="empty-row"><td colSpan={2}>No documents on file.</td></tr>}
              {profile.documents.map((d) => (
                <tr key={d.id}><td>{d.name}</td><td>{d.uploaded_at}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="section">
        <div className="section-head"><h2>Edit contact details</h2></div>
        <div className="card" style={{ maxWidth: 480 }}>
          {error && <div className="form-error">{error}</div>}
          {success && <div className="form-success">{success}</div>}
          <form onSubmit={handleSave}>
            <div className="field">
              <label>Phone</label>
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+91 98765 43210" />
            </div>
            <div className="field">
              <label>Address</label>
              <textarea rows={3} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Your current address" />
            </div>
            <div className="field">
              <label>Profile picture URL</label>
              <input value={form.profile_picture} onChange={(e) => setForm({ ...form, profile_picture: e.target.value })} placeholder="https://…" />
              <div className="hint">Only phone, address, and profile picture can be self-edited. Contact HR for other changes.</div>
            </div>
            <button className="btn btn-primary" type="submit" disabled={saving}>{saving ? "Saving…" : "Save changes"}</button>
          </form>
        </div>
      </div>
    </Layout>
  );
}
