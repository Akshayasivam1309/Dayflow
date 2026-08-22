const { v4: uuidv4 } = require("uuid");
const db = require("../db");

const LEAVE_TYPES = ["PAID", "SICK", "UNPAID"];

// POST /api/leaves
function applyLeave(req, res) {
  const { leave_type, start_date, end_date, remarks } = req.body;
  if (!leave_type || !start_date || !end_date) {
    return res.status(400).json({ error: "leave_type, start_date, and end_date are required." });
  }
  if (!LEAVE_TYPES.includes(leave_type)) {
    return res.status(400).json({ error: `leave_type must be one of: ${LEAVE_TYPES.join(", ")}` });
  }
  if (new Date(start_date) > new Date(end_date)) {
    return res.status(400).json({ error: "start_date must be before or equal to end_date." });
  }

  const id = uuidv4();
  db.prepare(
    `INSERT INTO leave_requests (id, user_id, leave_type, start_date, end_date, remarks, status)
     VALUES (?, ?, ?, ?, ?, ?, 'PENDING')`
  ).run(id, req.user.id, leave_type, start_date, end_date, remarks || null);

  const request = db.prepare("SELECT * FROM leave_requests WHERE id = ?").get(id);
  res.status(201).json({ message: "Leave request submitted.", leave_request: request });
}

// GET /api/leaves/me
function getMyLeaves(req, res) {
  const records = db
    .prepare("SELECT * FROM leave_requests WHERE user_id = ? ORDER BY created_at DESC")
    .all(req.user.id);
  res.json({ leave_requests: records });
}

// GET /api/leaves (admin - all, optional ?status=)
function getAllLeaves(req, res) {
  const { status } = req.query;
  let query = `
    SELECT l.*, u.full_name, u.employee_id
    FROM leave_requests l JOIN users u ON u.id = l.user_id
    WHERE 1=1`;
  const params = [];
  if (status) {
    query += " AND l.status = ?";
    params.push(status);
  }
  query += " ORDER BY l.created_at DESC";
  const records = db.prepare(query).all(...params);
  res.json({ leave_requests: records });
}

// PATCH /api/leaves/:id/review (admin - approve/reject)
function reviewLeave(req, res) {
  const { id } = req.params;
  const { status, admin_comment } = req.body;
  if (!["APPROVED", "REJECTED"].includes(status)) {
    return res.status(400).json({ error: "status must be APPROVED or REJECTED." });
  }
  const leave = db.prepare("SELECT * FROM leave_requests WHERE id = ?").get(id);
  if (!leave) return res.status(404).json({ error: "Leave request not found." });
  if (leave.status !== "PENDING") {
    return res.status(409).json({ error: "This leave request has already been reviewed." });
  }

  db.prepare(
    `UPDATE leave_requests SET status = ?, admin_comment = ?, reviewed_by = ?, updated_at = datetime('now') WHERE id = ?`
  ).run(status, admin_comment || null, req.user.id, id);

  // Reflect approved leave into attendance records for each day in range
  if (status === "APPROVED") {
    const start = new Date(leave.start_date);
    const end = new Date(leave.end_date);
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().slice(0, 10);
      const existing = db.prepare("SELECT * FROM attendance WHERE user_id = ? AND date = ?").get(leave.user_id, dateStr);
      if (existing) {
        db.prepare("UPDATE attendance SET status = 'LEAVE' WHERE id = ?").run(existing.id);
      } else {
        db.prepare(
          "INSERT INTO attendance (id, user_id, date, status) VALUES (?, ?, ?, 'LEAVE')"
        ).run(uuidv4(), leave.user_id, dateStr);
      }
    }
  }

  db.prepare(
    "INSERT INTO notifications (id, user_id, message) VALUES (?, ?, ?)"
  ).run(uuidv4(), leave.user_id, `Your ${leave.leave_type} leave request (${leave.start_date} to ${leave.end_date}) was ${status.toLowerCase()}.`);

  const updated = db.prepare("SELECT * FROM leave_requests WHERE id = ?").get(id);
  res.json({ message: `Leave request ${status.toLowerCase()}.`, leave_request: updated });
}

module.exports = { applyLeave, getMyLeaves, getAllLeaves, reviewLeave };
