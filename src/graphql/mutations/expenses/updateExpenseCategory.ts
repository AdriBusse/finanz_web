import { gql } from "@apollo/client";

export const UPDATE_EXPENSE_CATEGORY = gql`
  mutation UpdateExpenseCategory($id: String!, $name: String, $color: String, $icon: String) {
    updateExpenseCategory(id: $id, name: $name, color: $color, icon: $icon) {
      id
      name
      color
      icon
    }
  }
`;

