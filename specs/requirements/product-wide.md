# Product-wide

Rules that apply to more than one feature.

## Requirements

- P1 Every user signs in through single sign-on, and what they see and do depends on their role (employee, manager, finance). \[org default\] Applies to: all.
- P2 Every submission, approval, rejection and export is recorded in an audit log. Applies to: all. *assumed*
- P3 Amounts are held in a single company currency. Applies to: F1, F2, F3, F4. *assumed*

## Decisions

- Payroll export is a downloadable file, not a connection to a payroll system.
- Receipt details are typed by employees; no agent reads receipts.