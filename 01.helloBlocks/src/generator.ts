import * as Blockly from 'blockly';

// Create and configure the generator
export const pseudoGenerator = new Blockly.Generator('PseudoCode');
pseudoGenerator.INDENT = '  ';

// The scrub function (handles chained blocks)
pseudoGenerator.scrub_ = function(block: Blockly.Block, code: string, thisOnly?: boolean): string {
  const nextBlock = block.nextConnection && block.nextConnection.targetBlock();
  const nextCode = thisOnly ? '' : pseudoGenerator.blockToCode(nextBlock);
  return code + nextCode;
};

// Define the rule with strict TypeScript types
pseudoGenerator.forBlock['custom_print'] = function(block: Blockly.Block, generator: Blockly.Generator): string {
  // TypeScript knows getFieldValue returns a string
  const textValue: string = block.getFieldValue('TEXT_TO_PRINT');
  return `DISPLAY: "${textValue}"\n`;
};

// Example for a loop block (controls_repeat_ext)
pseudoGenerator.forBlock['controls_repeat_ext'] = function(block: Blockly.Block, generator: Blockly.Generator): string {
  const timesCode: string = generator.valueToCode(block, 'TIMES', 0) || '0';
  const branchCode: string = generator.statementToCode(block, 'DO');
  return `REPEAT ${timesCode} TIMES:\n${branchCode}`;
};