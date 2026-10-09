screen MyClaims "An employee's claims and their status"
  navbar "Expense Claims"
  sidebar "My claims -> MyClaims | Sign out"
  heading "My claims"
  row
    select "Status: All"
    right
    button "New claim" primary -> ClaimEditor
  table "Created | Total | Lines | Status" -> ClaimDetail
    row "12 Oct | 84.50 | 3 | Draft"
    row "03 Oct | 240.00 | 2 | Submitted"
    row "28 Sep | 56.20 | 1 | Rejected"
    row "14 Sep | 120.00 | 4 | Approved"

screen ClaimEditor "Create or correct a claim made of expense lines"
  navbar "Expense Claims"
  sidebar "My claims -> MyClaims | Sign out"
  heading "Claim"
  card "Expense line"
    row
      input "Date"
      input "Amount"
      select "Category"
    input "Description"
  button "Add line"
  text "Total: 84.50"
  row
    right
    button "Cancel" -> MyClaims
    button "Save draft" -> MyClaims
    button "Submit claim" primary -> ClaimDetail

screen ClaimDetail "One of the employee's claims with status and rejection reason"
  navbar "Expense Claims"
  sidebar "My claims -> MyClaims | Sign out"
  breadcrumb "My claims / Claim"
  row
    heading "Claim 03 Oct"
    badge "Rejected" danger
  card "Rejection reason | Receipt amount does not match | Rejected by your manager"
  table "Date | Category | Description | Amount"
    row "02 Oct | Travel | Train to client | 56.20"
  row
    right
    button "Withdraw" danger // withdraws in place and stays on the page
    button "Edit claim" primary -> ClaimEditor

screen TeamQueue "A manager's team claims, pending and decided"
  navbar "Expense Claims"
  sidebar "Team claims -> TeamQueue | My claims -> MyClaims | Sign out"
  heading "Team claims"
  tabs "Pending | Decided"
  table "Employee | Submitted | Total | Status" -> TeamClaimDetail
    row "Ana Perera | 03 Oct | 240.00 | Submitted"
    row "Ben Silva | 05 Oct | 56.20 | Submitted"

screen TeamClaimDetail "A manager reviews one claim and decides it"
  navbar "Expense Claims"
  sidebar "Team claims -> TeamQueue | My claims -> MyClaims | Sign out"
  breadcrumb "Team claims / Ana Perera"
  row
    heading "Ana Perera, 240.00"
    badge "Submitted" info
  table "Date | Category | Description | Amount"
    row "01 Oct | Travel | Train to client | 190.00"
    row "02 Oct | Meals | Team lunch | 50.00"
  row
    right
    button "Reject" danger -> RejectClaim
    button "Approve" primary -> TeamQueue

screen RejectClaim "A manager gives the required reason for rejecting"
  navbar "Expense Claims"
  sidebar "Team claims -> TeamQueue | My claims -> MyClaims | Sign out"
  heading "Reject claim"
  textarea "Reason (required)"
  row
    right
    button "Cancel" -> TeamClaimDetail
    button "Reject claim" primary -> TeamQueue

screen AllClaims "Finance reviews every submitted claim with totals by status"
  navbar "Expense Claims"
  sidebar "All claims -> AllClaims | Payroll export -> PayrollExports | Sign out"
  heading "All claims"
  row
    card "Submitted | 12 | 1,240.00"
    card "Approved | 30 | 5,880.00"
    card "Rejected | 4 | 410.00"
  row
    select "Status: All"
    right
    button "Download CSV" // downloads the filtered list and stays on the page
  table "Employee | Submitted | Total | Status | Exported" -> FinanceClaimDetail
    row "Ana Perera | 03 Oct | 240.00 | Approved | Yes"
    row "Ben Silva | 05 Oct | 56.20 | Approved | No"

screen FinanceClaimDetail "Finance reads one claim with its lines and decision"
  navbar "Expense Claims"
  sidebar "All claims -> AllClaims | Payroll export -> PayrollExports | Sign out"
  breadcrumb "All claims / Ana Perera"
  row
    heading "Ana Perera, 240.00"
    badge "Approved" success
  text "Decided by Mr Fernando on 04 Oct"
  table "Date | Category | Description | Amount"
    row "01 Oct | Travel | Train to client | 190.00"
    row "02 Oct | Meals | Team lunch | 50.00"
  button "Back to claims" primary -> AllClaims

screen PayrollExports "Finance exports approved claims and re-downloads past batches"
  navbar "Expense Claims"
  sidebar "All claims -> AllClaims | Payroll export -> PayrollExports | Sign out"
  heading "Payroll export"
  row
    card "Waiting to export | 8 claims | 1,520.00"
    right
    button "Export approved claims" primary // creates the batch and downloads it on this page
  heading "Past batches"
  table "Created | Claims | Total | By"
    row "01 Oct | 14 | 2,310.00 | Finance"
    row "15 Sep | 9 | 1,180.00 | Finance"
  button "Download selected batch" // re-downloads in place

flow "My claims"
  role "Employee"
  description "An employee files, tracks and corrects their own claims"
  MyClaims
  ClaimEditor
  ClaimDetail

flow "Approval queue"
  role "Manager"
  description "A manager reviews a direct report's claim and approves or rejects it"
  TeamQueue
  TeamClaimDetail
  RejectClaim

flow "Claim reporting"
  role "FinanceOfficer"
  description "Finance reviews all claims, filters by status and downloads the list"
  AllClaims
  FinanceClaimDetail

flow "Payroll export"
  role "FinanceOfficer"
  description "Finance exports approved claims to a CSV batch and re-downloads past batches"
  PayrollExports
