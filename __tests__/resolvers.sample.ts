import Query from '../resolvers/Query';
import Mutation from '../resolvers/Mutation';
import Subscription from '../resolvers/Subscription';
import { SampleInput } from '../resolvers/queries/sample';

// resolvers.queries.sample
describe('resolvers.queries', () => {
  describe('sample', () => {
    describe('querySample', () => {
      it('should return the provided success value', async () => {
        const id = 1;
        const input: SampleInput = { isSuccess: true };
        const result = await Query.querySample({}, { id, input });

        expect(result).toEqual({ success: input.isSuccess });
      });
    });
  });
});

// resolvers.mutations.sample
describe('resolvers.mutations', () => {
  describe('sample', () => {
    describe('mutationSample', () => {
      it('should return the provided success value', async () => {
        const input: SampleInput = { isSuccess: true };
        const result = await Mutation.mutationSample({}, { input });

        expect(result).toEqual({ success: input.isSuccess });
      });
    });
  });
});

// resolvers.subscriptions.sample
describe('resolvers.subscriptions', () => {
  describe('sample', () => {
    describe('subscriptionSample', () => {
      it('should return true if id is provided', async () => {
        const id = 1;
        const result = await Subscription.subscriptionSample({}, { id });

        expect(result).toEqual({ success: true });
      });

      it('should return false if id is not provided', async () => {
        const result = await Subscription.subscriptionSample({}, {});

        expect(result).toEqual({ success: false });
      });
    });
  });
});
