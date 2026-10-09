Feature: F4 Expense reporting

  @story-F4.1
  Rule: Finance sees the submitted claims of all employees, newest first

    Scenario: Claims across teams
      Given Ella submitted a claim on 3 October and Nina on 6 October, under different managers
      When Fiona from finance opens all claims
      Then Nina's claim is listed before Ella's claim

    @negative
    Scenario: Drafts are not listed
      Given Ella has a draft claim she has not submitted
      When Fiona opens all claims
      Then Ella's draft is not listed

  @story-F4.2
  Rule: Finance can filter the list by status

    Scenario: Filtering approved claims
      Given one claim is approved and one is rejected
      When Fiona filters all claims by "Approved"
      Then only the approved claim is listed

  @story-F4.3
  Rule: Finance can open any claim to see its lines, total, employee, status and decision

    Scenario: Opening a rejected claim
      Given Marco rejected Ella's claim of 240.00 with the reason "Receipt amount does not match"
      When Fiona opens that claim
      Then she sees Ella's name, the lines, the total 240.00, the status "Rejected" and the reason

  @story-F4.4
  Rule: Finance sees the number and total of claims for each status

    Scenario: Totals by status
      Given two approved claims of 100.00 and 50.00 and one rejected claim of 30.00
      When Fiona opens all claims
      Then "Approved" shows 2 claims totalling 150.00
      And "Rejected" shows 1 claim totalling 30.00

  @story-F4.5
  Rule: Finance can download the filtered list as CSV

    Scenario: Downloading the filtered list
      Given two approved claims and one rejected claim exist
      When Fiona filters by "Approved" and downloads the CSV
      Then the file has exactly two claims

  @story-F4.1 @story-F4.3
  Rule: Reporting is read-only and only for Finance

    @negative
    Scenario: An employee cannot see all claims
      Given Ella the employee is signed in
      When Ella tries to open all claims
      Then no other employee's claim is shown to her
