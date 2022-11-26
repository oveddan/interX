import { expect } from 'chai';
import { buildStubbedTriggeredInvoker, RecordedOutputWrites } from '../schema/testUtils';
import Branch, { branchSockets } from './Branch';

type BranchSocketsDefinition = typeof branchSockets;

describe('Branch', () => {
  describe('trigger', () => {
    it('commits the true output when value is true', () => {
      const mockNodeVals = {
        condition: true,
      };

      const { triggeredParams, getCommitedNodes } = buildStubbedTriggeredInvoker<BranchSocketsDefinition>(mockNodeVals);
      Branch.triggered(triggeredParams, 'flow');

      const expected = [
        {
          writeType: 'flow',
          socketName: 'true',
        },
      ];

      expect(getCommitedNodes()).to.eql(expected);
    });
    it('commits the true output when value is false', () => {
      const mockNodeVals = {
        condition: false,
      };

      const { triggeredParams, getCommitedNodes } = buildStubbedTriggeredInvoker<BranchSocketsDefinition>(mockNodeVals);
      Branch.triggered(triggeredParams, 'flow');

      const expected = [
        {
          writeType: 'flow',
          socketName: 'false',
        },
      ];

      expect(getCommitedNodes()).to.eql(expected);
    });
  });
});
