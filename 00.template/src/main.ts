import * as Blockly from 'blockly';
import { defineBlocks } from './blocks';
import { generator } from './generator';

// define custom blocsks before setting up the workspace
defineBlocks();

// set up the Blockly workspace
const workspace = Blockly.inject('blocklyDiv', {
  toolbox: {
    "kind": "flyoutToolbox",
    "contents": [
      // TODO add your blocks to the toolbox here. 
      // https://developers.google.com/blockly/guides/configure/web/toolboxes/toolbox
    ]
  }
});

// show code and errors
const codeOutput = document.getElementById('codeOutput');
const errorOutput = document.getElementById('errorOutput');

// generate code whenever the workspace changes
function generateCode() {
  try {
    const code = generator.workspaceToCode(workspace);
    if (codeOutput) codeOutput.textContent = code;
    if (errorOutput) errorOutput.textContent = '';
  } catch (e) {
    if (errorOutput) errorOutput.textContent = e instanceof Error ? e.message : String(e);
  }
}

// generate code on changes to editor
workspace.addChangeListener(generateCode);