import { gql } from "@apollo/client";

export const GET_EXPENSE_CATEGORIES = gql`
  query GetExpenseCategories {
    getExpenseCategories { id name color icon }
  }
`;

