# Approvals

## Purpose

Managers review submitted claims from their team and approve or reject them.

Needs: F1.

## User Stories

- F2.1 As a manager, I see the pending claims of my direct reports in one list, oldest first.
- F2.2 As a manager, I open a claim and see its expense lines, total and the employee.
- F2.3 As a manager, I approve a claim.
- F2.4 As a manager, I reject a claim with a required reason.
- F2.5 As a manager, I see the claims of my direct reports that have already been decided.
- F2.6 As a manager, I am not offered a claim that was withdrawn or edited after I opened it without seeing its current state.

## Decisions

- Only the employee's line manager decides a claim; there is no approval limit and no second approver.
- A claim is approved or rejected as a whole.
- A rejection always carries a reason, which the employee sees.
- No deputy or delegation: a claim waits for the manager while they are away.
- A decision is final; a rejected claim returns to the employee, who resubmits it as in F1.

## Out of Scope

- Approval chains or Finance sign-off on large claims.
- Deputies and delegation when a manager is away.
- Approving individual expense lines separately.