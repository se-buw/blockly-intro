import * as Blockly from 'blockly';
import { defineBlocks } from './blocks';
import { turtleGenerator } from './generator';
import { TurtleSimulator, runTurtleProgram } from './simulator';

defineBlocks();

const starterWorkspaceState = {
  blocks: {
    languageVersion: 0,
    blocks: [
      {
        type: 'controls_repeat_ext',
        x: 40,
        y: 40,
        inputs: {
          TIMES: {
            block: {
              type: 'math_number',
              fields: {
                NUM: 5,
              },
            },
          },
          DO: {
            block: {
              type: 'turtle_move',
              fields: {
                DIRECTION: 'FORWARD',
              },
              inputs: {
                DISTANCE: {
                  block: {
                    type: 'math_number',
                    fields: {
                      NUM: 120,
                    },
                  },
                },
              },
              next: {
                block: {
                  type: 'turtle_turn',
                  fields: {
                    DIRECTION: 'RIGHT',
                  },
                  inputs: {
                    ANGLE: {
                      block: {
                        type: 'math_number',
                        fields: {
                          NUM: 144,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    ],
  },
};

const workspace = Blockly.inject('blocklyDiv', {
  toolbox: {
    kind: 'flyoutToolbox',
    contents: [
      { kind: 'block', type: 'turtle_move' },
      { kind: 'block', type: 'turtle_turn' },
      { kind: 'block', type: 'controls_repeat_ext' },
      { kind: 'block', type: 'math_number' },
    ],
  },
});

Blockly.serialization.workspaces.load(starterWorkspaceState, workspace);

const runBtn = document.getElementById('runBtn');
const codeOutput = document.getElementById('codeOutput');
const simulatorCanvas = document.getElementById('simulatorCanvas');

function getGeneratedCode(): string {
  return turtleGenerator.workspaceToCode(workspace);
}

if (
  runBtn instanceof HTMLButtonElement &&
  codeOutput instanceof HTMLElement &&
  simulatorCanvas instanceof HTMLCanvasElement
) {
  const simulator = new TurtleSimulator(simulatorCanvas);

  const showCode = () => {
    const code = getGeneratedCode();
    codeOutput.textContent = code;
    return code;
  };

  runBtn.addEventListener('click', () => {
    void runTurtleProgram(showCode(), simulator);
  });

  workspace.addChangeListener(() => showCode());

  showCode();
  void runTurtleProgram(getGeneratedCode(), simulator);
}