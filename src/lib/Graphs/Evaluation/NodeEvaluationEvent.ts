import { Node } from '../../Nodes/Node.js';
import { TAbstractionsConstraint } from '../../Registry.js';
import { NodeEvaluationType } from './NodeEvaluationType.js';

export class NodeEvaluationEvent<T extends TAbstractionsConstraint> {
  constructor(
    public node: Node<T>,
    public nodeEvaluationType: NodeEvaluationType,
    public async: boolean
  ) {}
}
