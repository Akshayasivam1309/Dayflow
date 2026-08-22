const db = require("../db");

function computeNet(s) {
  if (!s) return null;
  return {
    ...s,
    net_monthly: Math.round(((s.basic + s.hra + s.allowances - s.deductions)) * 100) / 100,
  };
}

// GET /api/payroll/me
function getMyPayroll(req, res) {
  const salary = db.prepare("SELECT * FROM salary_structures WHERE user_id = ?").get(req.user.id);
  res.json({ payroll: computeNet(salary) });
}

// GET /api/payroll (admin - all)
function getAllPayroll(req, res) {
  const rows = db
    .prepare(
      `SELECT s.*, u.full_name, u.employee_id
       FROM salary_structures s JOIN users u ON u.id = s.user_id
       ORDER BY u.full_name ASC`
    )
    .all();
  res.json({ payroll: rows.map(computeNet) });
}

// GET /api/payroll/:userId (admin)
function getPayrollByUser(req, res) {
  const salary = db.prepare("SELECT * FROM salary_structures WHERE user_id = ?").get(req.params.userId);
  if (!salary) return res.status(404).json({ error: "Salary structure not found for this employee." });
  res.json({ payroll: computeNet(salary) });
}

// PATCH /api/payroll/:userId (admin - update salary structure)
function updatePayroll(req, res) {
  const { userId } = req.params;
  const fields = ["basic", "hra", "allowances", "deductions", "ctc_annual"];
  const updates = {};
  for (const f of fields) {
    if (req.body[f] !== undefined) {
      const num = Number(req.body[f]);
      if (Number.isNaN(num) || num < 0) {
        return res.status(400).json({ error: `${f} must be a non-negative number.` });
      }
      updates[f] = num;
    }
  }
  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ error: "Provide at least one of: " + fields.join(", ") });
  }
  const existing = db.prepare("SELECT * FROM salary_structures WHERE user_id = ?").get(userId);
  if (!existing) return res.status(404).json({ error: "Salary structure not found for this employee." });

  const setClause = Object.keys(updates).map((k) => `${k} = @${k}`).join(", ");
  db.prepare(`UPDATE salary_structures SET ${setClause}, updated_at = datetime('now') WHERE user_id = @user_id`).run({
    ...updates,
    user_id: userId,
  });

  const updated = db.prepare("SELECT * FROM salary_structures WHERE user_id = ?").get(userId);
  res.json({ message: "Salary structure updated.", payroll: computeNet(updated) });
}

module.exports = { getMyPayroll, getAllPayroll, getPayrollByUser, updatePayroll };
