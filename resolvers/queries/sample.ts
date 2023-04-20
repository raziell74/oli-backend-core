type SampleInputTypes = {
  id: number;
  isSuccess: boolean;
};

export type SampleInput = Pick<SampleInputTypes, 'isSuccess'>;

export const querySample = async (_parent: object, args: { id: number; input: SampleInput }) => {
  const {
    input: { isSuccess: success },
  } = args;
  return { success };
};
