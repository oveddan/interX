import { expect } from 'chai';
import { buildStubEngineForFlowNode, RecordedOutputWrites } from '../schema/testUtils';
import Counter from './Counter';

describe('Branch', () => {
  describe('trigger', () => {
    it('writes to the output and triggers a flow for each trigger', () => {
      const { trigger, getOutputWrites } = buildStubEngineForFlowNode(Counter);

      trigger('flow');
      trigger('flow');

      const expected: RecordedOutputWrites<typeof Counter.socketsDefinition> = [
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
    //   it('commits the true output when value is false', () => {
    //     const { trigger, writeInput, getOutputWrites } = buildStubEngineForFlowNode(Counter);

    //     writeInput('condition', false);
    //     trigger('flow');

    //     const expected = [
    //       {
    //         writeType: 'flow',
    //         socketName: 'false',
    //       },
    //     ];

    //     expect(getOutputWrites()).to.eql(expected);
    //   });
  });
});
