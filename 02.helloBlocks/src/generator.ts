import * as Blockly from 'blockly';

// Create and configure the generator
export const pseudoGenerator = new Blockly.Generator('PseudoCode');
pseudoGenerator.INDENT = '  ';

// The scrub function (handles chained blocks)
pseudoGenerator.scrub_ = function (block: Blockly.Block, code: string, thisOnly?: boolean): string {
  const nextBlock = block.nextConnection && block.nextConnection.targetBlock();
  const nextCode = thisOnly ? '' : pseudoGenerator.blockToCode(nextBlock);
  return code + nextCode;
};

pseudoGenerator.forBlock['greeting_external'] = function (block: Blockly.Block, generator: Blockly.Generator): string {
  const timesCode = generator.valueToCode(block, 'TIMES', 0);
  const subjectCode = generator.valueToCode(block, 'SUBJECT', 0);
  if (!timesCode) {
    throw new Error('Missing input code for TIMES');
  } 
  if (!subjectCode) {
    throw new Error('Missing input code for SUBJECT');
  }
  return `REPEAT ${timesCode} TIMES:\n  DISPLAY: "Hello ${subjectCode}!"\n`;
};

pseudoGenerator.forBlock['math_number'] = function (block: Blockly.Block): [string, number] {
  const rawValue = block.getFieldValue('NUM');
  const numericValue: number = Number(rawValue);
  return [String(numericValue), 0];
};

pseudoGenerator.forBlock['text'] = function (block: Blockly.Block): [string, number] {
  const textValue: string = block.getFieldValue('TEXT') || '';
  return [`${textValue}`, 0];
};