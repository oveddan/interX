import { expect } from 'chai';
import { buildStubbedTriggeredInvoker } from '../schema/testUtils';
import Branch, { BranchSocketsDefinition } from './Branch';

describe('Branch', () => {
  describe('trigger', () => {
    it('commits the true output when value is true', () => {
      const mockNodeVals = {
        condition: true,
      };

      const { triggeredParams, getCommitedNodes } = buildStubbedTriggeredInvoker<BranchSocketsDefinition>(mockNodeVals);
      Branch.triggered(triggeredParams);

      expect(getCommitedNodes()).to.eql(['true']);
    });
    it('commits the true output when value is false', () => {
      const mockNodeVals = {
        condition: false,
      };

      const { triggeredParams, getCommitedNodes } = buildStubbedTriggeredInvoker<BranchSocketsDefinition>(mockNodeVals);
      Branch.triggered(triggeredParams);

      expect(getCommitedNodes()).to.eql(['false']);
    });
  });
});
