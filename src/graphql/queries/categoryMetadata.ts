import { gql } from "@apollo/client";

export const CATEGORY_METADATA_QUERY = gql`
  query CategoryMetadata {
    categoryMetadata {
      colors { key hex label }
      icons { keyword icon label }
    }
  }
`;

