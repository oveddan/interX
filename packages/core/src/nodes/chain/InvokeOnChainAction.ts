import { makeFlowNodeDefinition, NodeCategory } from '@behave-graph/core';
import { IChainGraph } from '../../abstractions';
import { ChainNodeTypes, ChainValueType, makeChainSocketMapping } from './IChainNode';
import { chainGraphDependencyKey } from './OnChainVariableGet';

export const externalTriggerNodeTypeName = 'chain/invokeAction';

/**
 * Interface to the outside world from the on-chain graph; Allows for invoking the graph from the outside.
 * @param chainGraph
 * @returns
 */
const local = makeFlowNodeDefinition({
  typeName: externalTriggerNodeTypeName,
  category: NodeCategory.Flow,
  label: 'Invoke Action',
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
  triggered: ({ configuration, graph: { getDependency } }) => {
    // todo: how do we handle needing a node id?
    const chainGraph = getDependency<IChainGraph>(chainGraphDependencyKey);
    chainGraph.invoke(configuration.invokeId);

    return undefined;
  },
});

export const InvokeOnChainAction = makeChainSocketMapping(local, {
  nodeType: ChainNodeTypes.ExternalInvoke,
  inputValueType: ChainValueType.NotAVariable,
  socketIdKey: 'externalInvoke',
  socketMappings: {
    out: {
      flow: 'outputFlowSocket',
    },
  },
});
