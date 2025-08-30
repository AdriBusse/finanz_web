import { gql } from "@apollo/client";

export const GET_EXPENSE_TRANSACTION_TEMPLATES = gql`
  query GetExpenseTransactionTemplates {
    getExpenseTransactionTemplates {
      id
      describtion
      amount
      createdAt
      updatedAt
      category { id name color icon }
    }
  }
`;

