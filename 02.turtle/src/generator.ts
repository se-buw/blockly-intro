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
  const method = direction === 'BACKWARD' ? 'backward' : 'forward';
  return `turtle.${method}(${distance});\n`;
};

turtleGenerator.forBlock['turtle_turn'] = function(block: Blockly.Block, generator: JavascriptGenerator): string {
  const direction = block.getFieldValue('DIRECTION');
  const angle = getNumberInput(generator, block, 'ANGLE', '90');
  const method = direction === 'RIGHT' ? 'turnRight' : 'turnLeft';
  return `turtle.${method}(${angle});\n`;
};

turtleGenerator.forBlock['turtle_pen'] = function(block: Blockly.Block): string {
  const state = block.getFieldValue('STATE');
  return state === 'UP' ? 'turtle.penUp();\n' : 'turtle.penDown();\n';
};

turtleGenerator.forBlock['turtle_home'] = function(): string {
  return 'turtle.home();\n';
};