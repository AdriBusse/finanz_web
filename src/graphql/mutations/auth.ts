import { gql } from "@apollo/client";

export const LOGIN_MUTATION = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
      user { id username email }
    }
  }
`;

export const SIGNUP_MUTATION = gql`
  mutation Signup($data: RegisterInput!) {
    signup(data: $data) { id username email }
  }
`;

