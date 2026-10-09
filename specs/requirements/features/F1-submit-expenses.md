# Submit expenses

## Purpose

Employees create expense claims, submit them for approval and track their status.

## User Stories

- F1.1 As an employee, I create a claim made of one or more expense lines, each with a date, an amount, a category and a description.
- F1.2 As an employee, I save a claim as a draft and come back to finish it.
- F1.3 As an employee, I submit a claim, and it goes to my line manager for approval.
- F1.4 As an employee, I see my claims and each one's status (draft, submitted, approved, rejected, withdrawn).
- F1.5 As an employee, I edit a submitted claim until it is decided.
- F1.6 As an employee, I withdraw a submitted claim until it is decided.
- F1.7 As an employee, I see the reason a claim was rejected and resubmit it after correcting it.
- F1.8 As an employee, I pick each line's category from a fixed list.

## Decisions

- A claim holds several expense lines and is approved or rejected as a whole.
- Receipts are not attached to claims.
- The approver is the employee's line manager, taken from the organization's people directory; the employee does not choose.
- A claim can no longer be edited or withdrawn once it is approved or rejected; a rejected claim is corrected and resubmitted.

## Out of Scope

- Attaching receipts or images to claims.
- Employees choosing their own approver.