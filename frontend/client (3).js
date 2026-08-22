import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const employeeLinks = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/profile", label: "My Profile" },
  { to: "/attendance", label: "Attendance" },
  { to: "/leaves", label: "Leave Requests" },
  { to: "/payroll", label: "Payroll" },
];

const adminLinks = [
  { to: "/dashboard", label: "Overview" },
  { to: "/admin/employees", label: "Employees" },
  { to: "/admin/attendance", label: "Attendance" },
  { to: "/admin/leaves", label: "Leave Approvals" },
  { to: "/admin/payroll", label: "Payroll" },
];

function initials(name = "") {
  return name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function Layout({ title, subtitle, children }) {
  const { user, signout } = useAuth();
  const navigate = useNavigate();
  const links = user?.role === "ADMIN" ? adminLinks : employeeLinks;

  const handleSignout = () => {
    signout();
    navigate("/login");
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="mark" />
          <span>Dayflow</span>
        </div>

        <div className="nav-group">
          <div className="nav-label">{user?.role === "ADMIN" ? "Admin" : "Workspace"}</div>
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
              end={link.to === "/dashboard"}
            >
              <span className="dot" />
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="avatar">{initials(user?.full_name)}</div>
            <div className="who">
              <div className="name">{user?.full_name}</div>
              <div className="role">{user?.employee_id} · {user?.role}</div>
            </div>
          </div>
          <button className="signout-btn" onClick={handleSignout}>Sign out</button>
        </div>
      </aside>

      <div className="main-area">
        <div className="topbar">
          <div>
            <h1>{title}</h1>
            {subtitle && <div className="subtitle">{subtitle}</div>}
          </div>
        </div>
        <div className="page-content">{children}</div>
      </div>
    </div>
  );
}
