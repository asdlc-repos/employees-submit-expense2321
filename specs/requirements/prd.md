# Employee expense claims

## Problem Statement

Employees need to be reimbursed for work expenses, managers need to approve them, and finance must get approved claims into payroll. Without a shared flow, claims are chased by hand and finance re-keys approved amounts into payroll.

## Solution

A web product where employees submit expense claims, managers approve or reject them, and finance exports approved claims to payroll as a downloadable file and reviews claim history.

## Actors

- Employee — submits and tracks their own expense claims.
- Manager — reviews and decides claims from their team.
- Finance — exports approved claims for payroll and reports on claims across the company.

## Features

- F1 [Submit expenses](features/F1-submit-expenses.md)
- F2 [Approvals](features/F2-approvals.md)
- F3 [Payroll export](features/F3-payroll-export.md)
- F4 [Expense reporting](features/F4-expense-reporting.md)

## Product-wide

See [Product-wide](product-wide.md).

## Out of Scope

- Notifications (email or chat alerts on claim status changes).
- Automatic extraction of claim details from receipt images by an agent.
- Integration with a specific payroll system; the export is a downloadable file.

## Open Questions

1. Payroll export was not ticked in the feature list, but the brief asks for it; I kept it as F3 *assumed*. Confirm it stays.

