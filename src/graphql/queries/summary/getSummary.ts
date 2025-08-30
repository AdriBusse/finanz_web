import { gql } from "@apollo/client";

export const GET_SUMMARY = gql`
  query Summary {
    summary {
      latestExpense {
        id
        title
        currency
        sum
        updatedAt
      }
      todaySpent {
        id
        describtion
        amount
        createdAt
        category { id name color icon }
        expense { id title currency }
      }
      etfWorth
      etfMovement
      savingValue
    }
  }
`;
