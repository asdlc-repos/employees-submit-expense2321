Feature: F3 Payroll export

  @story-F3.1
  Rule: Finance sees how many approved claims wait for export and their total

    Scenario: Pending summary
      Given two approved claims of 240.00 and 60.00 have not been exported
      When Fiona from finance opens payroll export
      Then she sees 2 claims waiting with a total of 300.00

  @story-F3.2
  Rule: One export includes every approved claim not yet exported, as a CSV with one row per claim

    Scenario: Exporting all waiting claims
      Given two approved claims from Ella and Omar have not been exported
      When Fiona exports approved claims
      Then the downloaded CSV has exactly two rows
      And each row shows the employee, the claim ID, the approval date and the total

    @negative
    Scenario: Submitted claims are not exported
      Given one claim from Ella is approved and one from Omar is only submitted
      When Fiona exports approved claims
      Then the downloaded CSV has exactly one row

    @negative
    Scenario: Exporting when nothing is waiting
      Given every approved claim has already been exported
      When Fiona tries to export approved claims
      Then no new export batch exists

  @story-F3.3
  Rule: Exported claims are marked and left out of later exports

    Scenario: A claim is not exported twice
      Given Fiona has exported Ella's approved claim
      And Omar's claim is then approved
      When Fiona exports approved claims
      Then the downloaded CSV has exactly one row
      And Ella's claim is shown as exported

  @story-F3.4
  Rule: Past batches can be downloaded again

    Scenario: Re-downloading a batch
      Given Fiona exported a batch of two claims yesterday
      When Fiona downloads that batch again
      Then the file has the same two rows

  @story-F3.1 @story-F3.2 @story-F3.4
  Rule: Only Finance creates or downloads exports

    @negative
    Scenario: An employee cannot export
      Given Ella the employee is signed in and an approved claim is waiting
      When Ella tries to export approved claims
      Then no new export batch exists
