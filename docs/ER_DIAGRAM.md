# Entity–Relationship Diagram

```mermaid
erDiagram
    USERS ||--o| JOB_DETAILS : has
    USERS ||--o| SALARY_STRUCTURES : has
    USERS ||--o{ DOCUMENTS : owns
    USERS ||--o{ ATTENDANCE : logs
    USERS ||--o{ LEAVE_REQUESTS : submits
    USERS ||--o{ NOTIFICATIONS : receives
    USERS ||--o{ LEAVE_REQUESTS : reviews

    USERS {
        string id PK
        string employee_id UK
        string email UK
        string password_hash
        string role "ADMIN or EMPLOYEE"
        string full_name
        string phone
        string address
        string profile_picture
        bool is_email_verified
    }

    JOB_DETAILS {
        string id PK
        string user_id FK
        string designation
        string department
        string date_of_joining
        string employment_type
        string manager_name
    }

    SALARY_STRUCTURES {
        string id PK
        string user_id FK
        real basic
        real hra
        real allowances
        real deductions
        real ctc_annual
    }

    DOCUMENTS {
        string id PK
        string user_id FK
        string name
        string file_url
    }

    ATTENDANCE {
        string id PK
        string user_id FK
        string date
        string check_in
        string check_out
        string status "PRESENT/ABSENT/HALF_DAY/LEAVE"
    }

    LEAVE_REQUESTS {
        string id PK
        string user_id FK
        string leave_type "PAID/SICK/UNPAID"
        string start_date
        string end_date
        string remarks
        string status "PENDING/APPROVED/REJECTED"
        string admin_comment
        string reviewed_by FK
    }

    NOTIFICATIONS {
        string id PK
        string user_id FK
        string message
        bool is_read
    }
```

## Relationship notes

- `users.role` distinguishes **Admin/HR Officer** from **Employee** — the same table backs both, per the requirements doc's user-class definitions.
- `job_details` and `salary_structures` are 1:1 with `users`, created automatically at signup so every account has an editable (initially empty) job/salary record from day one.
- `documents` is 1:many — an employee can have multiple files on record.
- `attendance` has a unique constraint on `(user_id, date)` — one record per employee per day, updated in place by check-in/check-out.
- `leave_requests.reviewed_by` references the admin user who approved/rejected the request, distinct from `user_id` (the requester).
- Approving a leave request writes/updates matching rows in `attendance` for each day in the leave's date range, keeping the two in sync as described in section 3.5.2 of the requirements ("changes reflect immediately in employee records").
