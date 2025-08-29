import { gql } from "@apollo/client";

export const CREATE_EXPENSE_CATEGORY = gql`
  mutation CreateExpenseCategory($name: String!, $color: String, $icon: String) {
    createExpenseCategory(name: $name, color: $color, icon: $icon) {
      id
      name
      color
      icon
    }
  }
`;

