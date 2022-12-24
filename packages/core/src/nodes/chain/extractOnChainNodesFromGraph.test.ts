import { GraphJSON } from '@behave-graph/core';
import { ExternalTrigger } from './ExternalTrigger';
import { extractOnChainNodesFromGraph } from './extractOnChainNodesFromGraph';

describe('extractOnChainNodesFromGraph', () => {
  beforeEach(() => {
    // const smartContractAction =
    // const externalTriggerDesc = ExternalTrigger.Description();

    const graph: GraphJSON = {
      nodes: [],
    };
  });

  it('generates on chain nodes for each chain node in graph', () => {});

  it('sets the on chain-node initial values', () => {});

  it('generates on-chain edges for each edge between on-chain nodes', () => {});

  it('excludes off-chain nodes', () => {});

  it('excludes edges between off-chain and on-chain nodes', () => {});
});
