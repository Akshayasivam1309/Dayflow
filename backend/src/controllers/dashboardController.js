const db = require("../db");

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

// GET /api/dashboard/employee
function employeeDashboard(req, res) {
  const userId = req.user.id;
  const today = todayStr();

  const todayAttendance = db.prepare("SELECT * FROM attendance WHERE user_id = ? AND date = ?").get(userId, today);
  const pendingLeaves = db
    .prepare("SELECT COUNT(*) as c FROM leave_requests WHERE user_id = ? AND status = 'PENDING'")
    .get(userId).c;
  const approvedLeaves = db
    .prepare("SELECT COUNT(*) as c FROM leave_requests WHERE user_id = ? AND status = 'APPROVED'")
    .get(userId).c;
  const recentLeaves = db
    .prepare("SELECT * FROM leave_requests WHERE user_id = ? ORDER BY created_at DESC LIMIT 5")
    .all(userId);
  const notifications = db
    .prepare("SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 10")
    .all(userId);
  const thisMonthPrefix = today.slice(0, 7);
  const monthAttendance = db
    .prepare("SELECT status, COUNT(*) as c FROM attendance WHERE user_id = ? AND date LIKE ? GROUP BY status")
    .all(userId, `${thisMonthPrefix}%`);

  res.json({
    today_attendance: todayAttendance || null,
    pending_leaves: pendingLeaves,
    approved_leaves: approvedLeaves,
    recent_leaves: recentLeaves,
    notifications,
    month_attendance_summary: monthAttendance,
  });
}

// GET /api/dashboard/admin
function adminDashboard(req, res) {
  const today = todayStr();
  const totalEmployees = db.prepare("SELECT COUNT(*) as c FROM users WHERE role = 'EMPLOYEE'").get().c;
  const presentToday = db
    .prepare("SELECT COUNT(*) as c FROM attendance WHERE date = ? AND status = 'PRESENT'")
    .get(today).c;
  const pendingLeaveRequests = db
    .prepare("SELECT COUNT(*) as c FROM leave_requests WHERE status = 'PENDING'")
    .get().c;
  const recentLeaveRequests = db
    .prepare(
      `SELECT l.*, u.full_name, u.employee_id FROM leave_requests l
       JOIN users u ON u.id = l.user_id
       ORDER BY l.created_at DESC LIMIT 10`
    )
    .all();
  const attendanceToday = db
    .prepare(
      `SELECT a.*, u.full_name, u.employee_id FROM attendance a
       JOIN users u ON u.id = a.user_id WHERE a.date = ?`
    )
    .all(today);

  res.json({
    total_employees: totalEmployees,
    present_today: presentToday,
    pending_leave_requests: pendingLeaveRequests,
    recent_leave_requests: recentLeaveRequests,
    attendance_today: attendanceToday,
  });
}

module.exports = { employeeDashboard, adminDashboard };
