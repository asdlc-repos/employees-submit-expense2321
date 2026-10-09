# Payroll export

## Purpose

Finance exports approved claims to a downloadable file for payroll.

Needs: F2.

## User Stories

- F3.1 As a finance user, I see how many approved claims are waiting to be exported and their total.
- F3.2 As a finance user, I export all approved claims not yet exported as one batch in a single download.
- F3.3 As a finance user, I see claims marked as exported once a batch is created, so they are not included in later exports.
- F3.4 As a finance user, I see past export batches and re-download any of them.

## Decisions

- The export is a CSV file.
- Each row is one claim: employee, claim ID, approval date and total.
- Each export includes every approved claim not yet exported; Finance does not pick claims individually.
- Exported claims are marked as exported, left out of later batches, and stay available in their batch for re-download.
- Only Finance can create or download exports.

## Out of Scope

- A direct connection to a payroll system.
- Selecting individual claims or a date range for an export.
- Expense-line detail (category, description) in the file.