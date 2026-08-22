/**
 * Seeds the database with a demo admin and a few employees.
 * Run with: npm run seed
 */
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");
const db = require("./index");

function upsertUser({ employee_id, email, password, role, full_name, designation, department, basic, hra, allowances }) {
  const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email);
  if (existing) {
    console.log(`Skipping ${email} (already exists)`);
    return existing.id;
  }
  const id = uuidv4();
  const password_hash = bcrypt.hashSync(password, 10);
  db.prepare(
    `INSERT INTO users (id, employee_id, email, password_hash, role, full_name, is_email_verified)
     VALUES (?, ?, ?, ?, ?, ?, 1)`
  ).run(id, employee_id, email, password_hash, role, full_name);

  db.prepare(`INSERT INTO job_details (id, user_id, designation, department, date_of_joining, employment_type)
              VALUES (?, ?, ?, ?, date('now'), 'Full-Time')`).run(uuidv4(), id, designation, department);

  const ctc = (basic + hra + allowances) * 12;
  db.prepare(
    `INSERT INTO salary_structures (id, user_id, basic, hra, allowances, deductions, ctc_annual)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  ).run(uuidv4(), id, basic, hra, allowances, 0, ctc);

  console.log(`Created ${role} -> ${email} / ${password}`);
  return id;
}

upsertUser({
  employee_id: "ADM001",
  email: "admin@dayflow.com",
  password: "Admin@123",
  role: "ADMIN",
  full_name: "Asha Rao",
  designation: "HR Manager",
  department: "Human Resources",
  basic: 60000,
  hra: 24000,
  allowances: 10000,
});

upsertUser({
  employee_id: "EMP001",
  email: "priya.sharma@dayflow.com",
  password: "Employee@123",
  role: "EMPLOYEE",
  full_name: "Priya Sharma",
  designation: "Software Engineer",
  department: "Engineering",
  basic: 45000,
  hra: 18000,
  allowances: 6000,
});

upsertUser({
  employee_id: "EMP002",
  email: "rahul.mehta@dayflow.com",
  password: "Employee@123",
  role: "EMPLOYEE",
  full_name: "Rahul Mehta",
  designation: "Product Analyst",
  department: "Product",
  basic: 40000,
  hra: 16000,
  allowances: 5000,
});

console.log("\nSeed complete.");
