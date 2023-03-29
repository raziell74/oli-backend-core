export const subscriptionSample = async (_parent: object, args: { id?: number }) => {
  const { id } = args;
  const success = id ? true : false;
  return { success };
};
