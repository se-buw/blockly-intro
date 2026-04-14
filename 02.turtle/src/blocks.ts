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
      'type': 'turtle_pen',
      'message0': 'pen %1',
      'args0': [
        {
          'type': 'field_dropdown',
          'name': 'STATE',
          'options': [
            ['down', 'DOWN'],
            ['up', 'UP'],
          ],
        },
      ],
      'previousStatement': null,
      'nextStatement': null,
      'colour': 20,
    },
    {
      'type': 'turtle_home',
      'message0': 'go home',
      'previousStatement': null,
      'nextStatement': null,
      'colour': 65,
    },
  ]);
}