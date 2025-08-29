import { gql } from "@apollo/client";

export const DELETE_EXPENSE_TRANSACTION = gql`
  mutation DeleteExpenseTransaction($id: String!) {
    deleteExpenseTransaction(id: $id)
  }
`;

