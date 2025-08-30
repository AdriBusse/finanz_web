import { gql } from "@apollo/client";

export const CREATE_EXPENSE_TRANSACTION_TEMPLATE = gql`
  mutation CreateExpenseTransactionTemplate($describtion: String!, $amount: Float!, $categoryId: String) {
    createExpenseTransactionTemplate(describtion: $describtion, amount: $amount, categoryId: $categoryId) {
      id
      describtion
      amount
      createdAt
      updatedAt
      category { id name color icon }
    }
  }
`;

