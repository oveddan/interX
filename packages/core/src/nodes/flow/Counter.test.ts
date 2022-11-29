import { expect } from 'chai';
import { buildStubEngineForFlowNode, RecordedOutputWrites } from '../schema/testUtils';
import Counter from './Counter';

describe('Branch', () => {
  describe('trigger', () => {
    it('writes to the output and triggers a flow for each trigger', () => {
      const { trigger, getOutputWrites } = buildStubEngineForFlowNode(Counter);

      trigger('flow');
      trigger('flow');

      const expected: RecordedOutputWrites<typeof Counter.outputSockets> = [
        {
          writeType: 'value',
          socketName: 'count',
          value: 1n,
        },
        {
          writeType: 'flow',
          socketName: 'flow',
        },
        {
          writeType: 'value',
          socketName: 'count',
          value: 2n,
        },
        {
          writeType: 'flow',
          socketName: 'flow',
        },
      ];

      expect(getOutputWrites()).to.eql(expected);
    });
    it('resets the value to 0 but doesnt write the update on reset', () => {
      const { trigger, getOutputWrites } = buildStubEngineForFlowNode(Counter);

      trigger('flow');
      trigger('flow');
      trigger('reset');
      trigger('flow');

      const expected: RecordedOutputWrites<typeof Counter.outputSockets> = [
        {
          writeType: 'value',
          socketName: 'count',
          value: 1n,
        },
        {
          writeType: 'flow',
          socketName: 'flow',
        },
        {
          writeType: 'value',
          socketName: 'count',
          value: 2n,
        },
        {
          writeType: 'flow',
          socketName: 'flow',
        },
        // reset triggered - goes back to 0 but value isnt emitted
        {
          writeType: 'value',
          socketName: 'count',
          value: 1n,
        },
        {
          writeType: 'flow',
          socketName: 'flow',
        },
      ];

      expect(getOutputWrites()).to.eql(expected);
    });
  });
});
