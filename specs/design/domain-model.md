# Domain model

Employees file expense claims made of lines; the claim is decided as a whole by the employee's line manager, and approved claims are collected into payroll export batches. All amounts are integer cents in the single company currency.

```mermaid
erDiagram
    EMPLOYEE ||--o{ CLAIM : files
    EMPLOYEE ||--o{ EMPLOYEE : manages
    CLAIM ||--|{ CLAIM_LINE : contains
    CATEGORY ||--o{ CLAIM_LINE : classifies
    PAYROLL_EXPORT ||--o{ CLAIM : includes
    CLAIM ||--o{ AUDIT_EVENT : records

    EMPLOYEE {
        string username PK
        string displayName
        string managerUsername FK
    }
    CATEGORY {
        string id PK
        string name
    }
    CLAIM {
        uuid id PK
        string employeeUsername FK
        string status "draft|submitted|approved|rejected|withdrawn"
        int version
        string rejectionReason
        datetime submittedAt
        datetime decidedAt
        string decidedBy
        uuid payrollExportId FK
    }
    CLAIM_LINE {
        uuid id PK
        uuid claimId FK
        date expenseDate
        int amountCents
        string categoryId FK
        string description
    }
    PAYROLL_EXPORT {
        uuid id PK
        datetime createdAt
        string createdBy
        int claimCount
        int totalCents
    }
    AUDIT_EVENT {
        uuid id PK
        uuid claimId FK
        string actor
        string action
        datetime at
    }
```

- A claim total is the sum of its lines' `amountCents`; it is derived, never stored separately.
- `managerUsername` is the line-manager relation behind `/me/team/claims`; it is meant to come from the organization's people directory.
- `AUDIT_EVENT` rows are written for every submission, edit, withdrawal, decision and export (P2); no screen reads them.
- A claim is exported at most once: `payrollExportId` is set when a batch includes it.