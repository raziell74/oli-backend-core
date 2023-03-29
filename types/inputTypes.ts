/** Input Type Defs for graphql schema **/

// Sample Resolvers

type SampleInputTypes = {
  id: number;
  isSuccess: boolean;
};

export type SampleInput = Pick<SampleInputTypes, 'isSuccess'>;
