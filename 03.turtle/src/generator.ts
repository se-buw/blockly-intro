import * as Blockly from 'blockly';
import { javascriptGenerator, JavascriptGenerator, Order } from 'blockly/javascript';

export const turtleGenerator = javascriptGenerator;
turtleGenerator.INDENT = '  ';

function getNumberInput(generator: JavascriptGenerator, block: Blockly.Block, inputName: string, fallback: string): string {
  return generator.valueToCode(block, inputName, Order.NONE) || fallback;
}

turtleGenerator.forBlock['turtle_move'] = function(block: Blockly.Block, generator: JavascriptGenerator): string {
  const direction = block.getFieldValue('DIRECTION');
  const distance = getNumberInput(generator, block, 'DISTANCE', '0');
  const signedDistance = direction === 'BACKWARD' ? `-(${distance})` : distance;
  return `turtle.move(${signedDistance});\n`;
};

turtleGenerator.forBlock['turtle_turn'] = function(block: Blockly.Block, generator: JavascriptGenerator): string {
  const direction = block.getFieldValue('DIRECTION');
  const angle = getNumberInput(generator, block, 'ANGLE', '90');
  const signedAngle = direction === 'RIGHT' ? angle : `-(${angle})`;
  return `turtle.turn(${signedAngle});\n`;
};

