import * as Blockly from 'blockly';

// Export a function to define our blocks
export function defineBlocks() {
  Blockly.defineBlocksWithJsonArray([
    {
      "type": "custom_print",
      "message0": "say %1",
      "args0":[
        {
          "type": "field_input",
          "name": "TEXT_TO_PRINT",
          "text": "Hello, Formal World!"
        }
      ],
      "previousStatement": null,
      "nextStatement": null,
      "colour": 160
    }
  ]);
}