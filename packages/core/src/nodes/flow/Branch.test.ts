import { expect } from 'chai';
import { buildStubEngineForFlowNode } from '../schema/testUtils';
import Branch from './Branch';

describe('Branch', () => {
  describe('trigger', () => {
    it('commits the true output when value is true', () => {
      const { trigger, writeInput, getOutputWrites } = buildStubEngineForFlowNode(Branch);

      writeInput('condition', true);
      trigger('flow');

      const expected = [
        {
          writeType: 'flow',
          socketName: 'true',
        },
      ];

      expect(getOutputWrites()).to.eql(expected);
    });
    it('commits the true output when value is false', () => {
      const { trigger, writeInput, getOutputWrites } = buildStubEngineForFlowNode(Branch);

      writeInput('condition', false);
      trigger('flow');

      const expected = [
        {
          writeType: 'flow',
          socketName: 'false',
        },
      ];

      expect(getOutputWrites()).to.eql(expected);
    });
  });
});
