import { gql } from 'apollo-server-express';

export default gql`
  ### Call Definitions ###
  type Query {
    # resolvers/queries/User.ts
    users(input: FindUsersInput): [User]!
  }

  type Mutation {
    # resolvers/mutations/User.ts
    createUser(
      username: String!
      password: String!
      firstName: String!
      lastName: String!
      email: String!
      roles: [String!]!
    ): User!
    updateUser(_id: ID!, updateData: UpdateUserData): User!
    deleteUser(_id: ID!): User!
  }

  ### Input Definitions ###
  input FindUsersInput {
    _id: ID
    username: String
    email: String
    roles: String
  }

  input UpdateUserData {
    username: String
    password: String
    firstName: String
    lastName: String
    email: String
    roles: [String]
  }

  ### Type Definitions ###
  type User {
    _id: ID!
    username: String!
    email: String!
    firstName: String!
    lastName: String!
    roles: [String]!
  }
`;
