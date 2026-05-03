import * as Blockly from 'blockly';
import { defineBlocks } from './blocks';

// define our custom blocks before setting up the workspace
defineBlocks();

// set up the Blockly workspace
const workspace = Blockly.inject('blocklyDiv', {
  toolbox: {
    "kind": "flyoutToolbox",
    "contents":[
      { "kind": "block", "type": "greeting_external" },
      { "kind": "block", "type": "text" },
      { "kind": "block", "type": "math_number" }
    ]
  }
});

import { pseudoGenerator } from './generator';

// show code and errors
const codeOutput = document.getElementById('codeOutput');
const errorOutput = document.getElementById('errorOutput');

// generate code whenever the workspace changes
function generateCode() {
  try {
    const code = pseudoGenerator.workspaceToCode(workspace);
    if (codeOutput) codeOutput.textContent = code;
    if (errorOutput) errorOutput.textContent = '';
  } catch (e) {
    if (errorOutput) errorOutput.textContent = e instanceof Error ? e.message : String(e);
  }
}

workspace.addChangeListener(generateCode);