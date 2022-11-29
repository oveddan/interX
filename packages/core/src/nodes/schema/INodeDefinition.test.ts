import { makeFlowNodeDefinition, readNodeInputFn } from './FlowNodes';
import { FlowSockets, ValueSockets, ExtractValueType, ValueTypeNameMapping, Sockets } from './Sockets';
import { expectType } from './testUtils';

describe('TriggeredParams', () => {
  describe('writeOutput', () => {
    it('can only write output to a socket in the output definition that is a value type', () => {
      const flowDef = makeFlowNodeDefinition({
        inputSockets: {
          a: {
            valueType: 'boolean',
          },
          b: {
            valueType: 'string',
          },
          c: {
            valueType: 'flow',
          },
        },
        outputSockets: {
          c: {
            valueType: 'float',
          },
          d: {
            valueType: 'integer',
          },
          e: {
            valueType: 'flow',
          },
          f: {
            valueType: 'string',
          },
        },
        triggered: ({ commit, readInput, writeOutput }) => {
          const a = readInput('a');

          writeOutput('c', a ? 1.0 : 0.0);

          commit('e');

          return undefined;
        },
        initialState: () => undefined,
      });

      expectType<ValueSockets<typeof flowDef.inputSockets>>({
        a: {
          valueType: 'boolean',
        },
        b: {
          valueType: 'string',
        },
      });

      expectType<FlowSockets<typeof flowDef.inputSockets>>({
        c: {
          valueType: 'flow',
        },
      });

      expectType<ValueTypeNameMapping<'boolean'>>(true);
      expectType<ValueTypeNameMapping<'string'>>('asdfasfd');
      expectType<ExtractValueType<typeof flowDef.inputSockets, 'a'>>(false);
      // expectType<OutputValueType<typeof vals, 'c'>>(1.0);
      // expectType<OutputValueType<typeof vals, 'd'>>(1n);
      // expectType<OutputValueType<typeof vals, 'f'>>('asdfasfd');

      expectType<Parameters<readNodeInputFn<typeof flowDef.inputSockets>>>(['a']);
      expectType<Parameters<readNodeInputFn<typeof flowDef.inputSockets>>>(['b']);
    });
  });
});
