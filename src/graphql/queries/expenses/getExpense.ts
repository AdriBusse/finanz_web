import { gql } from "@apollo/client";

export const GET_EXPENSE = gql`
  query GetExpense($id: String!) {
    getExpense(id: $id) {
      id
      title
      currency
      archived
      monthlyRecurring
      spendingLimit
      sum
      createdAt
      updatedAt
      transactions(order: "DESC") {
        id
        describtion
        amount
        createdAt
        updatedAt
        category { id name color icon }
      }
    }
  }
`;

