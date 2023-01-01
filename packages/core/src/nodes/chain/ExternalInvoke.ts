import { makeFlowNodeDefinition, NodeCategory } from '@oveddan-behave-graph/core';
import { IChainGraph } from '../../abstractions';
import { ChainNodeTypes, ChainValueType, makeChainSocketMapping } from './IChainNode';

export const externalTriggerNodeTypeName = 'chain/externalTrigger';

/**
 * Interface to the outside world from the on-chain graph; Allows for invoking the graph from the outside.
 * @param chainGraph
 * @returns
 */
export const ExternalInvoke = (chainGraph: IChainGraph) => {
  const local = makeFlowNodeDefinition({
    typeName: externalTriggerNodeTypeName,
    category: NodeCategory.Flow,
    label: 'External Trigger',
    configuration: {
      invokeId: {
        valueType: 'number',
      },
    },
    initialState: undefined,
    in: {
      flow: 'flow',
    },
    out: {
      flow: 'flow',
    },
    triggered: ({ configuration }) => {
      // todo: how do we handle needing a node id?
      chainGraph.invoke(configuration.invokeId);

      return undefined;
    },
  });

  return makeChainSocketMapping(local, {
    nodeType: ChainNodeTypes.ExternalInvoke,
    inputValueType: ChainValueType.NotAVariable,
    socketIdKey: 'externalInvoke',
    socketMappings: {
      out: {
        flow: 'outputFlowSocket',
      },
    },
  });
};
