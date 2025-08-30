import { gql } from "@apollo/client";

export const UPDATE_EXPENSE_TRANSACTION_TEMPLATE = gql`
  mutation UpdateExpenseTransactionTemplate($id: String!, $describtion: String, $amount: Float, $categoryId: String) {
    updateExpenseTransactionTemplate(id: $id, describtion: $describtion, amount: $amount, categoryId: $categoryId) {
      id
      describtion
      amount
      createdAt
      updatedAt
      category { id name color icon }
    }
  }
`;

