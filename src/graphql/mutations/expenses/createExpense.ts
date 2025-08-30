import { gql } from "@apollo/client";

export const CREATE_EXPENSE = gql`
  mutation CreateExpense($title: String!, $currency: String, $monthlyRecurring: Boolean, $spendingLimit: Int, $skipTemplateIds: [ID!]) {
    createExpense(title: $title, currency: $currency, monthlyRecurring: $monthlyRecurring, spendingLimit: $spendingLimit, skipTemplateIds: $skipTemplateIds) {
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
