const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

function getToken() {
  return localStorage.getItem("dayflow_token");
}

async function request(path, { method = "GET", body, auth = true } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (auth) {
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    // no body
  }

  if (!res.ok) {
    const message = (data && data.error) || `Request failed with status ${res.status}`;
    throw new Error(message);
  }
  return data;
}

export const api = {
  // auth
  signup: (payload) => request("/auth/signup", { method: "POST", body: payload, auth: false }),
  verifyEmail: (token) => request("/auth/verify-email", { method: "POST", body: { token }, auth: false }),
  signin: (payload) => request("/auth/signin", { method: "POST", body: payload, auth: false }),
  me: () => request("/auth/me"),

  // employees / profile
  getMyProfile: () => request("/employees/me"),
  updateMyProfile: (payload) => request("/employees/me", { method: "PATCH", body: payload }),
  listEmployees: () => request("/employees"),
  getEmployee: (id) => request(`/employees/${id}`),
  updateEmployee: (id, payload) => request(`/employees/${id}`, { method: "PATCH", body: payload }),
  addDocument: (id, payload) => request(`/employees/${id}/documents`, { method: "POST", body: payload }),

  // attendance
  checkIn: () => request("/attendance/check-in", { method: "POST" }),
  checkOut: () => request("/attendance/check-out", { method: "POST" }),
  getMyAttendance: (params = "") => request(`/attendance/me${params}`),
  getAllAttendance: (params = "") => request(`/attendance${params}`),
  updateAttendanceStatus: (id, status) => request(`/attendance/${id}`, { method: "PATCH", body: { status } }),

  // leaves
  applyLeave: (payload) => request("/leaves", { method: "POST", body: payload }),
  getMyLeaves: () => request("/leaves/me"),
  getAllLeaves: (params = "") => request(`/leaves${params}`),
  reviewLeave: (id, payload) => request(`/leaves/${id}/review`, { method: "PATCH", body: payload }),

  // payroll
  getMyPayroll: () => request("/payroll/me"),
  getAllPayroll: () => request("/payroll"),
  getPayrollByUser: (userId) => request(`/payroll/${userId}`),
  updatePayroll: (userId, payload) => request(`/payroll/${userId}`, { method: "PATCH", body: payload }),

  // dashboard
  getEmployeeDashboard: () => request("/dashboard/employee"),
  getAdminDashboard: () => request("/dashboard/admin"),
};

export function setToken(token) {
  if (token) localStorage.setItem("dayflow_token", token);
  else localStorage.removeItem("dayflow_token");
}

export function getStoredToken() {
  return getToken();
}
