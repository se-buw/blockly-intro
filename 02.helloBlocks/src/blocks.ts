import * as Blockly from 'blockly';

// Export a function to define our blocks
export function defineBlocks() {
  Blockly.defineBlocksWithJsonArray([
    {
      "type": "greeting_external",
      "message0": "Say %1 times \"Hello %2!\"",
      "args0": [
        {
          "type": "input_value",
          "name": "TIMES",
          "check": "Number",
        },
        {
          "type": "input_value",
          "name": "SUBJECT",
          "check": "String"
        }
      ],
      "previousStatement": null,
      "nextStatement": null,
      "colour": 255
    }
  ]);
}