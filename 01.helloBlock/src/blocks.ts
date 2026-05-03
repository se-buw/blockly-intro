import * as Blockly from 'blockly';

// Export a function to define our blocks
export function defineBlocks() {
  Blockly.defineBlocksWithJsonArray([
    {
      "type": "greeting",
      "message0": "Say %1 times \"Hello %2!\"",
      "args0": [
        {
          "type": "field_number",
          "name": "TIMES",
          "value": 1,
          "min": 0,
          "max": 100,
          "precision": 1
        },
        {
          "type": "field_input",
          "name": "SUBJECT"
        }
      ],
      "previousStatement": null,
      "nextStatement": null
    }
  ]);
}