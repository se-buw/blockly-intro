import * as Blockly from 'blockly';
import { defineBlocks } from './blocks';
import { pseudoGenerator } from './generator';

// 1. Initialize the custom blocks
defineBlocks();

// 2. Inject Blockly into the HTML div
const workspace = Blockly.inject('blocklyDiv', {
  toolbox: {
    "kind": "flyoutToolbox",
    "contents":[
      { "kind": "block", "type": "custom_print" },
      { "kind": "block", "type": "controls_repeat_ext" }, // The Loop
      { "kind": "block", "type": "math_number" }         // The Number
    ]
  }
});

// 3. Attach the button event listener safely
const generateBtn = document.getElementById('generateBtn');
const codeOutput = document.getElementById('codeOutput');

if (generateBtn && codeOutput) {
  generateBtn.addEventListener('click', () => {
    // Generate the code using our typed generator
    const code: string = pseudoGenerator.workspaceToCode(workspace);
    codeOutput.textContent = code;
  });
}