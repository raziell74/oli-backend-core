import { SampleInput } from '../queries/sample';

export const mutationSample = async (_parent: object, args: { input: SampleInput }) => {
  const {
    input: { isSuccess: success },
  } = args;
  return { success };
};
