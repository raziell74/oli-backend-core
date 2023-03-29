import { gql } from 'apollo-server-express';

export default gql`
  type Query {
    sample(id: ID!, input: SampleInput): Sample!
  }

  type Mutation {
    sample(input: SampleInput): Sample!
  }

  type Subscription {
    sample(id: ID!): Sample!
  }

  ### Sample Types ###
  input SampleInput {
    isSuccess: Boolean
  }

  type Sample {
    success: String
  }
`;
