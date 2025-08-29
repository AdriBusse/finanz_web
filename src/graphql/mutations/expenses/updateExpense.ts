import { gql } from "@apollo/client";

export const UPDATE_EXPENSE = gql`
  mutation UpdateExpense($id: String!, $title: String, $currency: String, $monthlyRecurring: Boolean, $spendingLimit: Int, $archived: Boolean) {
    updateExpense(id: $id, title: $title, currency: $currency, monthlyRecurring: $monthlyRecurring, spendingLimit: $spendingLimit, archived: $archived) {
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

