import { gql } from "@apollo/client";

export const GET_EXPENSES = gql`
  query GetExpenses($archived: Boolean, $order: String) {
    getExpenses(archived: $archived, order: $order) {
      id
      title
      currency
      archived
      monthlyRecurring
      spendingLimit
      sum
      createdAt
      updatedAt
    }
  }
`;

