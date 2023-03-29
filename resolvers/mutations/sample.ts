import { SampleInput } from '../../types/inputTypes';

export const mutationSample = async (_parent: object, args: { input: SampleInput }) => {
  const {
    input: { isSuccess: success },
  } = args;
  return { success };
};
