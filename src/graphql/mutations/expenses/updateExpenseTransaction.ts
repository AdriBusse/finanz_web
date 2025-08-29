import { gql } from "@apollo/client";

export const UPDATE_EXPENSE_TRANSACTION = gql`
  mutation UpdateExpenseTransaction($transactionId: String!, $describtion: String, $amount: Float, $categoryId: String, $date: String) {
    updateExpenseTransaction(transactionId: $transactionId, describtion: $describtion, amount: $amount, categoryId: $categoryId, date: $date) {
      id
      describtion
      amount
      createdAt
      updatedAt
      category { id name color icon }
    }
  }
`;

