const { v4: uuidv4 } = require("uuid");
const db = require("../db");

function toPublicUser(user) {
  if (!user) return null;
  const { password_hash, verification_token, ...rest } = user;
  return rest;
}

function getFullProfile(userId) {
  const user = db.prepare("SELECT * FROM users WHERE id = ?").get(userId);
  if (!user) return null;
  const job = db.prepare("SELECT * FROM job_details WHERE user_id = ?").get(userId);
  const salary = db.prepare("SELECT * FROM salary_structures WHERE user_id = ?").get(userId);
  const documents = db.prepare("SELECT * FROM documents WHERE user_id = ?").all(userId);
  return { ...toPublicUser(user), job_details: job || null, salary_structure: salary || null, documents };
}

// GET /api/employees/me
function getMyProfile(req, res) {
  res.json({ profile: getFullProfile(req.user.id) });
}

// PATCH /api/employees/me  (employee can edit limited fields)
function updateMyProfile(req, res) {
  const allowedFields = ["phone", "address", "profile_picture"];
  const updates = {};
  for (const field of allowedFields) {
    if (req.body[field] !== undefined) updates[field] = req.body[field];
  }
  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ error: "No editable fields provided. You may edit: phone, address, profile_picture." });
  }
  const setClause = Object.keys(updates).map((k) => `${k} = @${k}`).join(", ");
  db.prepare(`UPDATE users SET ${setClause}, updated_at = datetime('now') WHERE id = @id`).run({
    ...updates,
    id: req.user.id,
  });
  res.json({ message: "Profile updated.", profile: getFullProfile(req.user.id) });
}

// GET /api/employees  (admin only) - list all employees
function listEmployees(req, res) {
  const users = db.prepare("SELECT * FROM users ORDER BY full_name ASC").all();
  res.json({ employees: users.map(toPublicUser) });
}

// GET /api/employees/:id (admin only, or self)
function getEmployeeById(req, res) {
  const { id } = req.params;
  if (req.user.role !== "ADMIN" && req.user.id !== id) {
    return res.status(403).json({ error: "You can only view your own profile." });
  }
  const profile = getFullProfile(id);
  if (!profile) return res.status(404).json({ error: "Employee not found." });
  res.json({ profile });
}

// PATCH /api/employees/:id (admin only - full edit rights)
function updateEmployee(req, res) {
  const { id } = req.params;
  const user = db.prepare("SELECT * FROM users WHERE id = ?").get(id);
  if (!user) return res.status(404).json({ error: "Employee not found." });

  const userFields = ["full_name", "phone", "address", "profile_picture", "role", "email"];
  const updates = {};
  for (const field of userFields) {
    if (req.body[field] !== undefined) updates[field] = req.body[field];
  }
  if (Object.keys(updates).length > 0) {
    const setClause = Object.keys(updates).map((k) => `${k} = @${k}`).join(", ");
    db.prepare(`UPDATE users SET ${setClause}, updated_at = datetime('now') WHERE id = @id`).run({
      ...updates,
      id,
    });
  }

  if (req.body.job_details) {
    const jd = req.body.job_details;
    const fields = ["designation", "department", "date_of_joining", "employment_type", "manager_name"];
    const jdUpdates = {};
    for (const f of fields) if (jd[f] !== undefined) jdUpdates[f] = jd[f];
    if (Object.keys(jdUpdates).length > 0) {
      const setClause = Object.keys(jdUpdates).map((k) => `${k} = @${k}`).join(", ");
      db.prepare(`UPDATE job_details SET ${setClause}, updated_at = datetime('now') WHERE user_id = @user_id`).run({
        ...jdUpdates,
        user_id: id,
      });
    }
  }

  res.json({ message: "Employee updated.", profile: getFullProfile(id) });
}

// POST /api/employees/:id/documents (admin only)
function addDocument(req, res) {
  const { id } = req.params;
  const { name, file_url } = req.body;
  if (!name || !file_url) return res.status(400).json({ error: "name and file_url are required." });
  const docId = uuidv4();
  db.prepare("INSERT INTO documents (id, user_id, name, file_url) VALUES (?, ?, ?, ?)").run(
    docId,
    id,
    name,
    file_url
  );
  res.status(201).json({ message: "Document added." });
}

module.exports = {
  getMyProfile,
  updateMyProfile,
  listEmployees,
  getEmployeeById,
  updateEmployee,
  addDocument,
  getFullProfile,
};
