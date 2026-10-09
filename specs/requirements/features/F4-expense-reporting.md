# Expense reporting

## Purpose

Finance searches claim history across the company and sees summaries.

Needs: F1.

## User Stories

- F4.1 As a finance user, I see the claims of all employees in one list, newest first.
- F4.2 As a finance user, I filter that list by status.
- F4.3 As a finance user, I open a claim and see its expense lines, total, employee, status and decision.
- F4.4 As a finance user, I see the total amount and the number of claims for each status.
- F4.5 As a finance user, I download the filtered list as a CSV file.

## Decisions

- Reporting is read-only; Finance cannot change or decide claims here.
- Filtering is by status only; summaries are totals by status only.
- Only Finance can use reporting.

## Out of Scope

- Filtering by employee, date range, category or team.
- Summaries by category, employee or month.