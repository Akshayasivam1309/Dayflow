# API Reference

Base URL: `http://localhost:4000/api`

All authenticated endpoints require an `Authorization: Bearer <token>` header. Tokens are returned from `/auth/signin` and expire after 7 days by default.

Roles: `ADMIN` (HR Officer) and `EMPLOYEE`. Endpoints marked **Admin only** return `403` for employee tokens.

---

## Auth

### `POST /auth/signup`
Register a new account.

```json
{
  "employee_id": "EMP010",
  "email": "jordan.lee@dayflow.com",
  "password": "Passw0rd!",
  "full_name": "Jordan Lee",
  "role": "EMPLOYEE"
}
```
Password must be 8+ characters with at least one letter and one number. Returns a `verification_token` (stands in for a real emailed link in this demo build).

### `POST /auth/verify-email`
```json
{ "token": "<verification_token>" }
```

### `POST /auth/signin`
```json
{ "email": "jordan.lee@dayflow.com", "password": "Passw0rd!" }
```
Returns `{ token, user }`. Fails with `403` if the email isn't verified yet.

### `GET /auth/me`
Returns the current authenticated user.

---

## Employees / Profile

### `GET /employees/me`
Your own full profile (user + job details + salary + documents).

### `PATCH /employees/me`
Edit your own limited fields: `phone`, `address`, `profile_picture`.

### `GET /employees` — **Admin only**
List all employees.

### `GET /employees/:id`
Admins can view any profile; employees may only view their own (`:id` must match their own user id).

### `PATCH /employees/:id` — **Admin only**
Full edit rights, including `job_details`:
```json
{
  "full_name": "Jordan Lee",
  "phone": "+91 90000 00000",
  "job_details": { "designation": "Engineer II", "department": "Engineering" }
}
```

### `POST /employees/:id/documents` — **Admin only**
```json
{ "name": "Offer Letter.pdf", "file_url": "https://…" }
```

---

## Attendance

### `POST /attendance/check-in`
Marks today present with the current check-in time. `409` if already checked in.

### `POST /attendance/check-out`
Records check-out time. Requires a prior check-in; `409` if already checked out.

### `GET /attendance/me?from=YYYY-MM-DD&to=YYYY-MM-DD`
Your own attendance history (date filters optional).

### `GET /attendance?user_id=&date=&from=&to=` — **Admin only**
All employees' attendance, with optional filters.

### `PATCH /attendance/:id` — **Admin only**
```json
{ "status": "ABSENT" }
```
`status` is one of `PRESENT`, `ABSENT`, `HALF_DAY`, `LEAVE`.

---

## Leave requests

### `POST /leaves`
```json
{ "leave_type": "PAID", "start_date": "2026-09-01", "end_date": "2026-09-02", "remarks": "Family event" }
```
`leave_type` is one of `PAID`, `SICK`, `UNPAID`.

### `GET /leaves/me`
Your own leave request history.

### `GET /leaves?status=PENDING` — **Admin only**
All leave requests, optionally filtered by `PENDING` / `APPROVED` / `REJECTED`.

### `PATCH /leaves/:id/review` — **Admin only**
```json
{ "status": "APPROVED", "admin_comment": "Enjoy your trip!" }
```
Approving a leave request automatically marks the corresponding days as `LEAVE` in the employee's attendance record and creates a notification for them.

---

## Payroll

### `GET /payroll/me`
Your own salary structure, including a computed `net_monthly`.

### `GET /payroll` — **Admin only**
All employees' payroll.

### `GET /payroll/:userId` — **Admin only**
A single employee's payroll.

### `PATCH /payroll/:userId` — **Admin only**
```json
{ "basic": 50000, "hra": 20000, "allowances": 6000, "deductions": 0, "ctc_annual": 912000 }
```
Any subset of fields may be provided.

---

## Dashboard

### `GET /dashboard/employee`
Today's attendance, pending/approved leave counts, recent leave requests, notifications, and this month's attendance summary.

### `GET /dashboard/admin` — **Admin only**
Total employee count, present-today count, pending leave request count, recent leave requests, and today's attendance across the team.

---

## Error format

All errors return a JSON body with an `error` message:
```json
{ "error": "Incorrect email or password." }
```
