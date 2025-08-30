import { gql } from "@apollo/client";

export const DELETE_EXPENSE_TRANSACTION_TEMPLATE = gql`
  mutation DeleteExpenseTransactionTemplate($id: String!) {
    deleteExpenseTransactionTemplate(id: $id)
  }
`;

