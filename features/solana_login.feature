Feature: Login by Solana wallet

  Background: A valid Solana account
    Given a valid solana account

  Scenario Outline:
    When request auth challenge
    Then systems returns status code "201"
    When request solana login with "<validity>" auth
    Then systems returns status code "<status>"

    Examples:
      | validity | status |
      | valid    | 201    |
      | invalid  | 401    |

  Scenario Outline: Happy case
    When request auth challenge
    Then systems returns status code "201"
    And request solana login with "valid" auth
    Then systems returns status code "201"
    And systems returns valid auth token