import { gql } from "@apollo/client";

export const CREATE_EXPENSE_TRANSACTION = gql`
  mutation CreateExpenseTransaction($expenseId: String!, $describtion: String!, $amount: Float!, $categoryId: String, $date: Float, $autocategorize: Boolean) {
    createExpenseTransaction(expenseId: $expenseId, describtion: $describtion, amount: $amount, categoryId: $categoryId, date: $date, autocategorize: $autocategorize) {
      id
      describtion
      amount
      createdAt
      updatedAt
      category { id name color icon }
    }
  }
`;

