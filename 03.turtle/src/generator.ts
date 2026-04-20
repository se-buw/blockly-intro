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

turtleGenerator.forBlock['routine_def'] = function(block: Blockly.Block, generator: JavascriptGenerator): string {
  // access definitions of the generator to append our function definitions
  const definitions = (generator as JavascriptGenerator & { definitions_: Record<string, string> }).definitions_;
  const routineName = String(block.getFieldValue('ROUTINE_NAME') || 'UnnamedRoutine');
  const body = generator.statementToCode(block, 'BODY');

  definitions[`routine:${routineName}`] = `function ${routineName}() {\n${body}}\n`;
  return '';
};

turtleGenerator.forBlock['routine_call'] = function(block: Blockly.Block): string {
  const routineName = String(block.getFieldValue('ROUTINE_NAME') || '');
  if (!routineName || routineName === 'NONE') {
    return '';
  }

  return `${routineName}();\n`;
};

