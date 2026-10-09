Feature: F1 Submit expenses

  @story-F1.1 @story-F1.8
  Rule: A claim is made of one or more lines, each with a date, amount, category from the fixed list and description

    Scenario: Creating a claim with two lines
      Given Ella the employee is signed in
      When Ella creates a claim with a line of 190.00 for "Travel" on 1 October and a line of 50.00 for "Meals" on 2 October
      Then her claim shows two lines and a total of 240.00

    @negative
    Scenario: A claim with no lines is refused
      Given Ella the employee is signed in
      When Ella tries to create a claim with no lines
      Then Ella has no new claim

  @story-F1.2 @story-F1.4
  Rule: A draft can be saved and finished later, and every claim shows its status

    Scenario: Returning to a saved draft
      Given Ella has saved a draft claim of 84.50 for "Travel"
      When Ella opens her claims
      Then the claim is listed with status "Draft" and a total of 84.50

  @story-F1.3
  Rule: Submitting sends the claim to the employee's line manager

    Scenario: Submitting a claim
      Given Ella has a draft claim of 240.00 and her line manager is Marco
      When Ella submits the claim
      Then the claim has status "Submitted"
      And the claim appears in Marco's pending claims

  @story-F1.5
  Rule: An employee may edit a claim only until it is decided

    Scenario: Editing a submitted claim
      Given Ella has submitted a claim with a line of 50.00 for "Meals"
      When Ella changes the line amount to 45.00
      Then the claim total is 45.00

    @negative
    Scenario: Editing an approved claim
      Given Ella's claim of 50.00 has been approved
      When Ella tries to change the line amount to 45.00
      Then the claim total is still 50.00

  @story-F1.6
  Rule: An employee may withdraw a claim only until it is decided

    Scenario: Withdrawing a submitted claim
      Given Ella has submitted a claim
      When Ella withdraws it
      Then the claim has status "Withdrawn"

    @negative
    Scenario: Withdrawing a rejected claim
      Given Ella's claim has been rejected
      When Ella tries to withdraw it
      Then the claim still has status "Rejected"

  @story-F1.7
  Rule: A rejected claim shows its reason and can be corrected and resubmitted

    Scenario: Resubmitting after rejection
      Given Marco has rejected Ella's claim with the reason "Receipt amount does not match"
      When Ella opens the claim
      Then she sees the reason "Receipt amount does not match"
      When Ella corrects the line amount and submits it again
      Then the claim has status "Submitted"

  @story-F1.4
  Rule: An employee sees only their own claims

    @negative
    Scenario: Another employee's claims are not listed
      Given Ella has a submitted claim
      When Omar the employee opens his claims
      Then Omar's list does not include Ella's claim
