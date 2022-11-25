import {
  FlowSockets,
  IHasSockets,
  makeFlowNodeDefinition,
  OutputValueType,
  readInputFn,
  ValueSockets,
  ExtractValueType,
  ValueTypeNameMapping,
} from './INodeDefinition';
import { expectType } from './testUtils';

describe('TriggeredParams', () => {
  describe('writeOutput', () => {
    it('can only write output to a socket in the output definition that is a value type', () => {
      const vals = {
        inputSockets: {
          a: {
            valueType: 'boolean',
          },
          b: {
            valueType: 'string',
          },
          c: {
            valueType: "flow"
          }
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
      } satisfies IHasSockets;

      const flowNode = makeFlowNodeDefinition({
        socketsDefinition: vals,
        triggered: ({
          commit,
          readInput,
          writeOutput
        }) => {
          const a = readInput('a');

          writeOutput("c", a ? 1.0 : 0.0);
        }
      })

      expectType<ValueSockets<typeof vals.inputSockets>>({
        a: {
          valueType: 'boolean'
        },
        b: {
          valueType: 'string'
        }
      })

      expectType<FlowSockets<typeof vals.inputSockets>>({
        c: {
          valueType: 'flow'
        }
      })

      expectType<ValueTypeNameMapping<'boolean'>>(true);
      expectType<ValueTypeNameMapping<'string'>>('asdfasfd');
      expectType<ExtractValueType<typeof vals.inputSockets, 'a'>>(false);
      expectType<OutputValueType<typeof vals, 'c'>>(1.0);
      expectType<OutputValueType<typeof vals, 'd'>>(1n);
      expectType<OutputValueType<typeof vals, 'f'>>('asdfasfd');


      expectType<Parameters<readInputFn<typeof vals>>>(['a']);
      expectType<Parameters<readInputFn<typeof vals>>>(['b']);
    });
  });
});
