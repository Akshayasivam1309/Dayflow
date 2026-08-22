const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const db = require("../db");
const { signToken } = require("../utils/jwt");

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Min 8 chars, at least 1 letter and 1 number
const PASSWORD_RE = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

function toPublicUser(user) {
  const { password_hash, verification_token, ...rest } = user;
  return rest;
}

function signup(req, res) {
  const { employee_id, email, password, full_name, role } = req.body;

  if (!employee_id || !email || !password || !full_name) {
    return res.status(400).json({ error: "employee_id, email, password, and full_name are required." });
  }
  if (!EMAIL_RE.test(email)) {
    return res.status(400).json({ error: "Please provide a valid email address." });
  }
  if (!PASSWORD_RE.test(password)) {
    return res.status(400).json({
      error: "Password must be at least 8 characters and include at least one letter and one number.",
    });
  }
  const finalRole = role === "ADMIN" ? "ADMIN" : "EMPLOYEE";

  const existing = db
    .prepare("SELECT id FROM users WHERE email = ? OR employee_id = ?")
    .get(email, employee_id);
  if (existing) {
    return res.status(409).json({ error: "An account with this email or employee ID already exists." });
  }

  const id = uuidv4();
  const password_hash = bcrypt.hashSync(password, 10);
  const verification_token = crypto.randomBytes(20).toString("hex");

  db.prepare(
    `INSERT INTO users (id, employee_id, email, password_hash, role, full_name, verification_token, is_email_verified)
     VALUES (?, ?, ?, ?, ?, ?, ?, 0)`
  ).run(id, employee_id, email, password_hash, finalRole, full_name, verification_token);

  db.prepare(`INSERT INTO job_details (id, user_id) VALUES (?, ?)`).run(uuidv4(), id);
  db.prepare(`INSERT INTO salary_structures (id, user_id) VALUES (?, ?)`).run(uuidv4(), id);

  const user = db.prepare("SELECT * FROM users WHERE id = ?").get(id);

  // In a production system this token would be emailed. Returned here for demo/testing purposes.
  return res.status(201).json({
    message: "Account created. Please verify your email before signing in.",
    verification_token,
    user: toPublicUser(user),
  });
}

function verifyEmail(req, res) {
  const { token } = req.body;
  if (!token) return res.status(400).json({ error: "Verification token is required." });

  const user = db.prepare("SELECT * FROM users WHERE verification_token = ?").get(token);
  if (!user) return res.status(400).json({ error: "Invalid or expired verification token." });

  db.prepare(
    "UPDATE users SET is_email_verified = 1, verification_token = NULL, updated_at = datetime('now') WHERE id = ?"
  ).run(user.id);

  return res.json({ message: "Email verified successfully. You can now sign in." });
}

function signin(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).json({ error: "Incorrect email or password." });
  }

  if (!user.is_email_verified) {
    return res.status(403).json({ error: "Please verify your email before signing in." });
  }

  const token = signToken({ id: user.id, role: user.role });
  return res.json({ token, user: toPublicUser(user) });
}

function me(req, res) {
  return res.json({ user: toPublicUser(req.user) });
}

module.exports = { signup, verifyEmail, signin, me };
