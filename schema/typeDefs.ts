import { gql } from 'apollo-server-express';

export default gql`
  type Query {
    querySample(id: ID!, input: SampleInput): Sample!
  }

  type Mutation {
    mutationSample(input: SampleInput): Sample!
  }

  type Subscription {
    subscriptionSample(id: ID!): Sample!
  }

  ### Sample Types ###
  input SampleInput {
    isSuccess: Boolean
  }

  type Sample {
    success: String
  }
`;
