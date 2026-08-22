/* ---------- Layout ---------- */
.app-shell {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: 240px;
  flex-shrink: 0;
  background: var(--df-surface);
  border-right: 1px solid var(--df-border);
  display: flex;
  flex-direction: column;
  padding: 24px 16px;
  position: sticky;
  top: 0;
  height: 100vh;
}

.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 4px 8px 28px;
}

.sidebar-brand .mark {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: linear-gradient(135deg, var(--df-primary), #6B7BF2);
  position: relative;
  flex-shrink: 0;
}
.sidebar-brand .mark::after {
  content: "";
  position: absolute;
  left: 6px; right: 6px; top: 13px;
  height: 2px;
  background: rgba(255,255,255,0.9);
  border-radius: 2px;
  box-shadow: 0 -5px 0 rgba(255,255,255,0.55), 0 5px 0 rgba(255,255,255,0.55);
}
.sidebar-brand span {
  font-family: var(--df-font-display);
  font-weight: 700;
  font-size: 17px;
}

.nav-group { display: flex; flex-direction: column; gap: 2px; margin-bottom: 20px; }
.nav-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.06em; color: var(--df-text-faint); padding: 8px 12px 6px; font-weight: 600; }

.nav-link {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 12px;
  border-radius: var(--df-radius-sm);
  color: var(--df-text-muted);
  font-size: 14px;
  font-weight: 500;
  transition: background 0.12s ease, color 0.12s ease;
}
.nav-link:hover { background: var(--df-surface-sunken); color: var(--df-text); }
.nav-link.active { background: var(--df-primary-soft); color: var(--df-primary-dark); }
.nav-link .dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; opacity: 0.5; }

.sidebar-footer {
  margin-top: auto;
  border-top: 1px solid var(--df-border);
  padding-top: 14px;
}
.sidebar-user { display: flex; align-items: center; gap: 10px; padding: 6px 8px; }
.avatar {
  width: 34px; height: 34px; border-radius: 50%;
  background: var(--df-primary-soft); color: var(--df-primary-dark);
  display: flex; align-items: center; justify-content: center;
  font-weight: 700; font-size: 13px; flex-shrink: 0;
}
.sidebar-user .who { min-width: 0; }
.sidebar-user .name { font-size: 13px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.sidebar-user .role { font-size: 11px; color: var(--df-text-faint); }

.signout-btn {
  width: 100%; margin-top: 10px; padding: 8px 12px;
  background: none; border: 1px solid var(--df-border); border-radius: var(--df-radius-sm);
  color: var(--df-text-muted); font-size: 13px; font-weight: 500; cursor: pointer;
}
.signout-btn:hover { background: var(--df-red-soft); color: var(--df-red); border-color: transparent; }

.main-area { flex: 1; min-width: 0; }
.topbar {
  padding: 20px 32px;
  border-bottom: 1px solid var(--df-border);
  background: var(--df-surface);
  display: flex; align-items: center; justify-content: space-between;
}
.topbar h1 { font-size: 20px; }
.topbar .subtitle { color: var(--df-text-muted); font-size: 13px; margin-top: 2px; }

.page-content { padding: 28px 32px 64px; max-width: 1200px; }

/* ---------- Cards ---------- */
.card {
  background: var(--df-surface);
  border: 1px solid var(--df-border);
  border-radius: var(--df-radius);
  padding: 20px;
  box-shadow: var(--df-shadow-sm);
}
.card-title { font-size: 14px; font-weight: 600; margin-bottom: 4px; }
.card-sub { font-size: 12.5px; color: var(--df-text-muted); margin-bottom: 16px; }

.stat-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
  gap: 14px;
  margin-bottom: 24px;
}
.stat-card {
  background: var(--df-surface);
  border: 1px solid var(--df-border);
  border-radius: var(--df-radius);
  padding: 18px 20px;
}
.stat-card .label { font-size: 12.5px; color: var(--df-text-muted); font-weight: 500; }
.stat-card .value { font-family: var(--df-font-display); font-size: 28px; font-weight: 700; margin-top: 6px; }
.stat-card .value.accent { color: var(--df-primary); }

.section { margin-bottom: 24px; }
.section-head { display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 12px; }
.section-head h2 { font-size: 16px; }

/* ---------- Buttons ---------- */
.btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 6px;
  padding: 9px 16px; border-radius: var(--df-radius-sm);
  font-size: 13.5px; font-weight: 600; cursor: pointer;
  border: 1px solid transparent;
  transition: transform 0.05s ease, background 0.12s ease, box-shadow 0.12s ease;
}
.btn:active { transform: translateY(1px); }
.btn:disabled { opacity: 0.55; cursor: not-allowed; }

.btn-primary { background: var(--df-primary); color: #fff; }
.btn-primary:hover:not(:disabled) { background: var(--df-primary-dark); }

.btn-secondary { background: var(--df-surface); border-color: var(--df-border); color: var(--df-text); }
.btn-secondary:hover:not(:disabled) { background: var(--df-surface-sunken); }

.btn-success { background: var(--df-green); color: #fff; }
.btn-success:hover:not(:disabled) { filter: brightness(0.94); }

.btn-danger { background: var(--df-red); color: #fff; }
.btn-danger:hover:not(:disabled) { filter: brightness(0.94); }

.btn-sm { padding: 6px 11px; font-size: 12.5px; }
.btn-block { width: 100%; }

/* ---------- Forms ---------- */
.field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px; }
.field label { font-size: 13px; font-weight: 600; color: var(--df-text); }
.field .hint { font-size: 11.5px; color: var(--df-text-faint); }
.field input, .field select, .field textarea {
  padding: 10px 12px;
  border: 1px solid var(--df-border);
  border-radius: var(--df-radius-sm);
  background: var(--df-surface);
  color: var(--df-text);
}
.field input:focus, .field select:focus, .field textarea:focus {
  border-color: var(--df-primary);
}
.field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }

.form-error {
  background: var(--df-red-soft); color: var(--df-red);
  padding: 10px 14px; border-radius: var(--df-radius-sm);
  font-size: 13px; margin-bottom: 16px;
}
.form-success {
  background: var(--df-green-soft); color: var(--df-green);
  padding: 10px 14px; border-radius: var(--df-radius-sm);
  font-size: 13px; margin-bottom: 16px;
}

/* ---------- Badges ---------- */
.badge {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 3px 9px; border-radius: 999px;
  font-size: 11.5px; font-weight: 600;
}
.badge-pending, .badge-half_day { background: var(--df-amber-soft); color: var(--df-amber); }
.badge-approved, .badge-present { background: var(--df-green-soft); color: var(--df-green); }
.badge-rejected, .badge-absent { background: var(--df-red-soft); color: var(--df-red); }
.badge-leave, .badge-admin { background: var(--df-slate-soft); color: var(--df-slate); }
.badge-employee { background: var(--df-primary-soft); color: var(--df-primary-dark); }

/* ---------- Table ---------- */
.table-wrap { overflow-x: auto; border: 1px solid var(--df-border); border-radius: var(--df-radius); }
table { width: 100%; border-collapse: collapse; font-size: 13.5px; }
thead th {
  text-align: left; padding: 11px 16px; background: var(--df-surface-sunken);
  color: var(--df-text-muted); font-weight: 600; font-size: 12px;
  text-transform: uppercase; letter-spacing: 0.03em;
  border-bottom: 1px solid var(--df-border);
}
tbody td { padding: 12px 16px; border-bottom: 1px solid var(--df-border); }
tbody tr:last-child td { border-bottom: none; }
tbody tr:hover { background: var(--df-surface-sunken); }
.empty-row td { text-align: center; padding: 32px 16px; color: var(--df-text-faint); }

/* ---------- Auth pages ---------- */
.auth-shell {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1fr 1fr;
}
.auth-visual {
  background: linear-gradient(160deg, #3C4FE0 0%, #5A63EE 55%, #7B6BF2 100%);
  color: #fff;
  padding: 56px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  overflow: hidden;
}
.auth-visual .brand { display: flex; align-items: center; gap: 10px; font-family: var(--df-font-display); font-weight: 700; font-size: 18px; }
.auth-visual .brand .mark { width: 26px; height: 26px; border-radius: 7px; background: rgba(255,255,255,0.22); }
.auth-visual .headline { font-family: var(--df-font-display); font-size: 34px; font-weight: 700; line-height: 1.25; max-width: 420px; }
.auth-visual .tagline { font-size: 14px; opacity: 0.85; margin-top: 12px; max-width: 380px; }

.flow-track {
  display: flex; align-items: center; gap: 0;
  margin-top: 40px;
}
.flow-track .seg { height: 5px; flex: 1; background: rgba(255,255,255,0.22); }
.flow-track .seg.filled { background: rgba(255,255,255,0.85); }
.flow-track .node {
  width: 11px; height: 11px; border-radius: 50%; background: #fff;
  box-shadow: 0 0 0 4px rgba(255,255,255,0.25);
}
.flow-labels { display: flex; justify-content: space-between; font-size: 11px; opacity: 0.75; margin-top: 8px; }

.auth-form-side {
  display: flex; align-items: center; justify-content: center;
  padding: 40px;
  background: var(--df-bg);
}
.auth-card { width: 100%; max-width: 380px; }
.auth-card h1 { font-size: 24px; margin-bottom: 6px; }
.auth-card .lead { color: var(--df-text-muted); font-size: 13.5px; margin-bottom: 26px; }
.auth-switch { text-align: center; font-size: 13px; color: var(--df-text-muted); margin-top: 18px; }
.auth-switch a { color: var(--df-primary); font-weight: 600; }

.demo-box {
  margin-top: 22px; padding: 12px 14px; background: var(--df-primary-soft);
  border-radius: var(--df-radius-sm); font-size: 12px; color: var(--df-primary-dark); line-height: 1.6;
}

/* ---------- Misc ---------- */
.loading-screen {
  min-height: 100vh; display: flex; align-items: center; justify-content: center;
  color: var(--df-text-muted); font-size: 14px;
}
.pill-group { display: flex; gap: 8px; flex-wrap: wrap; }
.filter-pill {
  padding: 6px 13px; border-radius: 999px; border: 1px solid var(--df-border);
  background: var(--df-surface); font-size: 12.5px; font-weight: 600; color: var(--df-text-muted); cursor: pointer;
}
.filter-pill.active { background: var(--df-primary); color: #fff; border-color: var(--df-primary); }

.timeclock {
  display: flex; align-items: center; justify-content: space-between;
  padding: 18px 22px; border-radius: var(--df-radius-lg);
  background: linear-gradient(135deg, var(--df-primary-soft), #F4F5FE);
  border: 1px solid var(--df-border);
  margin-bottom: 24px;
}
.timeclock .time { font-family: var(--df-font-display); font-size: 26px; font-weight: 700; }
.timeclock .desc { font-size: 12.5px; color: var(--df-text-muted); margin-top: 2px; }

@media (max-width: 900px) {
  .auth-shell { grid-template-columns: 1fr; }
  .auth-visual { display: none; }
  .app-shell { flex-direction: column; }
  .sidebar { width: 100%; height: auto; position: relative; flex-direction: row; overflow-x: auto; }
  .sidebar-footer { display: none; }
  .nav-group { flex-direction: row; margin-bottom: 0; }
}
