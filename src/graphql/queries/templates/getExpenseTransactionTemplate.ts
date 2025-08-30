import { gql } from "@apollo/client";

export const GET_EXPENSE_TRANSACTION_TEMPLATE = gql`
  query GetExpenseTransactionTemplate($id: String!) {
    getExpenseTransactionTemplate(id: $id) {
      id
      describtion
      amount
      createdAt
      updatedAt
      category { id name color icon }
    }
  }
`;

