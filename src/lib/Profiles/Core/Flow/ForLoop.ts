import Logger from '../../../Diagnostics/Logger';
import Node from '../../../Nodes/Node';
import NodeEvalContext from '../../../Nodes/NodeEvalContext';
import FlowSocket from '../../../Sockets/Typed/FlowSocket';
import NumberSocket from '../../../Sockets/Typed/NumberSocket';

export default class ForLoop extends Node {
  constructor() {
    super(
      'Flow',
      'flow/forLoop',
      [
        new FlowSocket(),
        new NumberSocket('startIndex'),
        new NumberSocket('endIndex'),
      ],
      [
        new FlowSocket('loopBody'),
        new NumberSocket('index'),
        new FlowSocket('completed'),
      ],
      (context: NodeEvalContext) => {
        // these outputs are fired sequentially in an async fashion but without delays.
        // Thus a promise is returned and it continually returns a promise until each of the sequences has been executed.
        const startIndex = context.readInput('startIndex');
        const endIndex = context.readInput('endIndex');
        const loopBodyIteration = function loopBodyIteration(i: number) {
          Logger.verbose(`loop: loop body ${i} of [${startIndex}:${endIndex})`);
          if (i < endIndex) {
            context.writeOutput('index', i);
            context.commit('loopBody', () => {
              Logger.verbose(`loop: body completed for ${i}!`);
              loopBodyIteration(i + 1);
            });
          } else {
            context.commit('completed');
          }
        };
        loopBodyIteration(startIndex);
      },
    );
  }
}