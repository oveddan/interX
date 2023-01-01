import { NodeSpecJSON } from '@oveddan-behave-graph/core';
import { NodeTypes } from 'reactflow';
import { Node } from '../components/Node';
import { ISceneWithQueries } from '@blocktopia/core';

const getCustomNodeTypes = (allSpecs: NodeSpecJSON[], scene: ISceneWithQueries) => {
  return allSpecs.reduce((nodes, node) => {
    nodes[node.type] = (props) => (
      <Node spec={node} allSpecs={allSpecs} {...props} getProperties={scene.getProperties} />
    );
    return nodes;
  }, {} as NodeTypes);
};

export default getCustomNodeTypes;
