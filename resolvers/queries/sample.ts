import { SampleInput } from '../../types/inputTypes';

export const querySample = async (_parent: object, args: { id: number; input: SampleInput }) => {
  const {
    input: { isSuccess: success },
  } = args;
  return { success };
};
