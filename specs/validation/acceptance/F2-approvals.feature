Feature: F2 Approvals

  @story-F2.1 @story-F2.5
  Rule: A manager sees the pending and decided claims of their direct reports only

    Scenario: Pending claims are listed oldest first
      Given Ella and Omar report to Marco, and Ella submitted a claim on 3 October and Omar on 5 October
      When Marco opens his team claims
      Then Ella's claim is listed before Omar's claim

    Scenario: Decided claims are listed
      Given Marco has approved a claim from Ella
      When Marco filters his team claims by "Approved"
      Then Ella's claim is listed

    @negative
    Scenario: A claim from someone who does not report to the manager is not shown
      Given Nina does not report to Marco and has submitted a claim
      When Marco opens his team claims
      Then Nina's claim is not listed

  @story-F2.2
  Rule: A manager sees the lines, total and employee of a claim

    Scenario: Opening a claim
      Given Ella has submitted a claim with lines of 190.00 for "Travel" and 50.00 for "Meals"
      When Marco opens it
      Then he sees Ella's name, both lines and a total of 240.00

  @story-F2.3
  Rule: Only the employee's line manager approves a claim

    Scenario: Approving a claim
      Given Ella has submitted a claim to Marco
      When Marco approves it
      Then the claim has status "Approved"

    @negative
    Scenario: A manager of another team cannot approve
      Given Ella has submitted a claim and Nina is not her line manager
      When Nina tries to approve it
      Then the claim still has status "Submitted"

  @story-F2.4
  Rule: A rejection requires a reason

    Scenario: Rejecting with a reason
      Given Ella has submitted a claim to Marco
      When Marco rejects it with the reason "Receipt amount does not match"
      Then the claim has status "Rejected"
      And Ella sees the reason "Receipt amount does not match"

    @negative
    Scenario: Rejecting without a reason
      Given Ella has submitted a claim to Marco
      When Marco tries to reject it without a reason
      Then the claim still has status "Submitted"

  @story-F2.6
  Rule: A claim that changed after the manager opened it is not decided on its old state

    @negative
    Scenario: Approving a claim the employee has since withdrawn
      Given Marco has opened Ella's submitted claim
      And Ella then withdraws the claim
      When Marco tries to approve it
      Then the claim still has status "Withdrawn"

  @story-F2.3 @story-F2.4
  Rule: A decision is final

    @negative
    Scenario: Approving an already rejected claim
      Given Marco has rejected Ella's claim
      When Marco tries to approve it
      Then the claim still has status "Rejected"
