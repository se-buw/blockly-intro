import * as Blockly from 'blockly';

// Create and configure a fresh generator
export const pseudoGenerator = new Blockly.Generator('PseudoCode');
pseudoGenerator.INDENT = '  ';

// The scrub function (handles chained blocks)
pseudoGenerator.scrub_ = function(block: Blockly.Block, code: string, thisOnly?: boolean): string {
  const nextBlock = block.nextConnection && block.nextConnection.targetBlock();
  const nextCode = thisOnly ? '' : pseudoGenerator.blockToCode(nextBlock);
  return code + nextCode;
};

// Define the rule to generate code for greeting blocks
pseudoGenerator.forBlock['greeting'] = function(block: Blockly.Block): string {
  const timesValue: number = Number(block.getFieldValue('TIMES'));
  if (!Number.isFinite(timesValue) || timesValue < 1) {
    return '';
  }
  const subjectValue: string = block.getFieldValue('SUBJECT');
  let code : string = 'DISPLAY: "Hello ' + subjectValue + '!"\n';
  if (timesValue > 1 ) {
    code = `REPEAT ${timesValue} TIMES:\n  ${code}`;
  } 
  return code;
};
