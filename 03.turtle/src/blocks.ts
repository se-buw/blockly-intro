import * as Blockly from 'blockly';

export function defineBlocks() {
  Blockly.defineBlocksWithJsonArray([
    {
      'type': 'turtle_move',
      'message0': 'move %1 by %2 px',
      'args0': [
        {
          'type': 'field_dropdown',
          'name': 'DIRECTION',
          'options': [
            ['forward', 'FORWARD'],
            ['backward', 'BACKWARD'],
          ],
        },
        {
          'type': 'input_value',
          'name': 'DISTANCE',
          'check': 'Number',
        },
      ],
      'previousStatement': null,
      'nextStatement': null,
      'colour': 160,
    },
    {
      'type': 'turtle_turn',
      'message0': 'turn %1 by %2 deg',
      'args0': [
        {
          'type': 'field_dropdown',
          'name': 'DIRECTION',
          'options': [
            ['left', 'LEFT'],
            ['right', 'RIGHT'],
          ],
        },
        {
          'type': 'input_value',
          'name': 'ANGLE',
          'check': 'Number',
        },
      ],
      'previousStatement': null,
      'nextStatement': null,
      'colour': 230,
    },
    {
      "type": "routine_def",
      "message0": "Routine %1 %2 %3",
      "args0": [
        { "type": "field_input", "name": "ROUTINE_NAME", "text": "MyTask" },
        { "type": "input_dummy" },
        { "type": "input_statement", "name": "BODY" }
      ],
      "colour": 290,
      "tooltip": "Define a block of commands"
    }
  ]);

  Blockly.Blocks['routine_call'] = {
    init: function () {
      // Create a dynamic dropdown function (This is Blockly's version of an Xtext ScopeProvider!)
      const dropdownOptions: Blockly.MenuGeneratorFunction = () => {
        const workspace = Blockly.getMainWorkspace();
        if (!workspace) return [['', '']];

        // Find every "routine_def" block currently on the screen
        const routineBlocks = workspace.getBlocksByType('routine_def');

        if (routineBlocks.length === 0) {
          return [['<No Routines Defined>', 'NONE']];
        }

        // Return an array of [Human_Readable_Text, Internal_Value]
        return routineBlocks.map((block): Blockly.MenuOption => {
          const name = String(block.getFieldValue('ROUTINE_NAME') || 'UnnamedRoutine');
          return [name, name];
        });
      };

      this.appendDummyInput()
        .appendField("Run routine:")
        .appendField(new Blockly.FieldDropdown(dropdownOptions), "ROUTINE_NAME");

      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(290);
    }
  };
}