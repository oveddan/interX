import { makeFlowNodeDefinition, NodeCategory } from '@oveddan-behave-graph/core';
import { IChainGraph } from '../../abstractions';
import { ChainNodeTypes, ChainValueType, makeChainNodeDefinition } from './IChainNode';

export const externalTriggerNodeTypeName = 'chain/externalTrigger';

export const ExternalTrigger = (chainGraph: IChainGraph) =>
  makeFlowNodeDefinition({
    typeName: externalTriggerNodeTypeName,
    category: NodeCategory.Flow,
    label: 'External Trigger',
    configuration: {
      triggerId: {
        valueType: 'string',
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
      chainGraph.trigger(configuration.triggerId);

      return undefined;
    },
  });

export const onChainDefinition = (chainGraph: IChainGraph) =>
  makeChainNodeDefinition(ExternalTrigger(chainGraph), {
    nodeType: ChainNodeTypes.ExternalTrigger,
    inputValueType: ChainValueType.NotAVariable,
    inSocketIds: {
      flow: 0,
    },
    outSocketIds: {
      flow: 1,
    },
  });
