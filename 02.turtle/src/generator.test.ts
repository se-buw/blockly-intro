import * as Blockly from 'blockly';
import { beforeAll, describe, expect, it } from 'vitest';
import { defineBlocks } from './blocks';
import { pseudoGenerator } from './generator';

describe('pseudoGenerator', () => {
  beforeAll(() => {
    defineBlocks();
  });

  it('generates text for custom_print', () => {
    const workspace = new Blockly.Workspace();

    const printBlock = workspace.newBlock('custom_print');
    printBlock.setFieldValue('Hello', 'TEXT_TO_PRINT');

    const code = pseudoGenerator.blockToCode(printBlock);

    expect(code).toBe('DISPLAY: "Hello"\n');

    workspace.dispose();
  });

  it('appends chained next blocks via scrub_', () => {
    const workspace = new Blockly.Workspace();

    const first = workspace.newBlock('custom_print');
    const second = workspace.newBlock('custom_print');
    first.setFieldValue('First', 'TEXT_TO_PRINT');
    second.setFieldValue('Second', 'TEXT_TO_PRINT');
    first.nextConnection?.connect(second.previousConnection);

    const code = pseudoGenerator.workspaceToCode(workspace);

    expect(code).toBe('DISPLAY: "First"\nDISPLAY: "Second"\n');

    workspace.dispose();
  });

  it('generates repeat code from connected math_number input', () => {
    const workspace = new Blockly.Workspace();

    const repeat = workspace.newBlock('controls_repeat_ext');
    const times = workspace.newBlock('math_number');
    const body = workspace.newBlock('custom_print');

    times.setFieldValue('3', 'NUM');
    body.setFieldValue('Loop', 'TEXT_TO_PRINT');

    repeat.getInput('TIMES')?.connection?.connect(times.outputConnection);
    repeat.getInput('DO')?.connection?.connect(body.previousConnection);

    const code = pseudoGenerator.blockToCode(repeat);

    expect(code).toBe('REPEAT 3 TIMES:\n  DISPLAY: "Loop"\n');

    workspace.dispose();
  });

  it('uses 0 when repeat count input is not connected', () => {
    const workspace = new Blockly.Workspace();
    const repeat = workspace.newBlock('controls_repeat_ext');

    const code = pseudoGenerator.blockToCode(repeat);

    expect(code).toBe('REPEAT 0 TIMES:\n');

    workspace.dispose();
  });
});
