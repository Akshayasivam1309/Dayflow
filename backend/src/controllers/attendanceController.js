const { v4: uuidv4 } = require("uuid");
const db = require("../db");

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

// POST /api/attendance/check-in
function checkIn(req, res) {
  const userId = req.user.id;
  const date = todayStr();
  const existing = db.prepare("SELECT * FROM attendance WHERE user_id = ? AND date = ?").get(userId, date);
  const now = new Date().toISOString();

  if (existing) {
    if (existing.check_in) {
      return res.status(409).json({ error: "You have already checked in today." });
    }
    db.prepare("UPDATE attendance SET check_in = ?, status = 'PRESENT' WHERE id = ?").run(now, existing.id);
  } else {
    db.prepare(
      "INSERT INTO attendance (id, user_id, date, check_in, status) VALUES (?, ?, ?, ?, 'PRESENT')"
    ).run(uuidv4(), userId, date, now);
  }
  const record = db.prepare("SELECT * FROM attendance WHERE user_id = ? AND date = ?").get(userId, date);
  res.status(200).json({ message: "Checked in.", attendance: record });
}

// POST /api/attendance/check-out
function checkOut(req, res) {
  const userId = req.user.id;
  const date = todayStr();
  const existing = db.prepare("SELECT * FROM attendance WHERE user_id = ? AND date = ?").get(userId, date);
  if (!existing || !existing.check_in) {
    return res.status(400).json({ error: "You must check in before checking out." });
  }
  if (existing.check_out) {
    return res.status(409).json({ error: "You have already checked out today." });
  }
  const now = new Date().toISOString();
  db.prepare("UPDATE attendance SET check_out = ? WHERE id = ?").run(now, existing.id);
  const record = db.prepare("SELECT * FROM attendance WHERE id = ?").get(existing.id);
  res.json({ message: "Checked out.", attendance: record });
}

// GET /api/attendance/me?from=&to=
function getMyAttendance(req, res) {
  const { from, to } = req.query;
  let query = "SELECT * FROM attendance WHERE user_id = ?";
  const params = [req.user.id];
  if (from) {
    query += " AND date >= ?";
    params.push(from);
  }
  if (to) {
    query += " AND date <= ?";
    params.push(to);
  }
  query += " ORDER BY date DESC";
  const records = db.prepare(query).all(...params);
  res.json({ attendance: records });
}

// GET /api/attendance (admin - all employees, optional ?user_id=&date=&from=&to=)
function getAllAttendance(req, res) {
  const { user_id, from, to, date } = req.query;
  let query = `
    SELECT a.*, u.full_name, u.employee_id
    FROM attendance a JOIN users u ON u.id = a.user_id
    WHERE 1=1`;
  const params = [];
  if (user_id) {
    query += " AND a.user_id = ?";
    params.push(user_id);
  }
  if (date) {
    query += " AND a.date = ?";
    params.push(date);
  }
  if (from) {
    query += " AND a.date >= ?";
    params.push(from);
  }
  if (to) {
    query += " AND a.date <= ?";
    params.push(to);
  }
  query += " ORDER BY a.date DESC, u.full_name ASC";
  const records = db.prepare(query).all(...params);
  res.json({ attendance: records });
}

// PATCH /api/attendance/:id (admin - manually set status, e.g. Absent/Half-day/Leave)
function updateAttendanceStatus(req, res) {
  const { id } = req.params;
  const { status } = req.body;
  const valid = ["PRESENT", "ABSENT", "HALF_DAY", "LEAVE"];
  if (!valid.includes(status)) {
    return res.status(400).json({ error: `status must be one of: ${valid.join(", ")}` });
  }
  const record = db.prepare("SELECT * FROM attendance WHERE id = ?").get(id);
  if (!record) return res.status(404).json({ error: "Attendance record not found." });
  db.prepare("UPDATE attendance SET status = ? WHERE id = ?").run(status, id);
  res.json({ message: "Attendance status updated.", attendance: db.prepare("SELECT * FROM attendance WHERE id = ?").get(id) });
}

module.exports = { checkIn, checkOut, getMyAttendance, getAllAttendance, updateAttendanceStatus };
