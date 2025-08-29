import { gql } from "@apollo/client";

export const DELETE_EXPENSE_CATEGORY = gql`
  mutation DeleteExpenseCategory($id: String!) {
    deleteExpenseCategory(id: $id)
  }
`;

