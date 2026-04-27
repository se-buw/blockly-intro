import * as Blockly from 'blockly';
import { beforeAll, describe, expect, it } from 'vitest';
import { defineBlocks } from './blocks';
import { pseudoGenerator } from './generator';

function requireConnection(connection: Blockly.Connection | null): Blockly.Connection {
  if (!connection) {
    throw new Error('Expected Blockly connection to exist.');
  }

  return connection;
}

describe('pseudoGenerator', () => {
  beforeAll(() => {
    defineBlocks();
  });

  it('generates a single greeting statement', () => {
    const workspace = new Blockly.Workspace();

    const greetingBlock = workspace.newBlock('greeting');
    greetingBlock.setFieldValue('1', 'TIMES');
    greetingBlock.setFieldValue('Blockly', 'SUBJECT');

    const code = pseudoGenerator.blockToCode(greetingBlock);

    expect(code).toBe('DISPLAY: "Hello Blockly!"\n');

    workspace.dispose();
  });

  it('appends chained next blocks via scrub_', () => {
    const workspace = new Blockly.Workspace();

    const first = workspace.newBlock('greeting');
    const second = workspace.newBlock('greeting');
    first.setFieldValue('1', 'TIMES');
    first.setFieldValue('Ada', 'SUBJECT');
    second.setFieldValue('2', 'TIMES');
    second.setFieldValue('Grace', 'SUBJECT');
    requireConnection(first.nextConnection).connect(
      requireConnection(second.previousConnection),
    );

    const code = pseudoGenerator.workspaceToCode(workspace);

    expect(code).toBe('DISPLAY: "Hello Ada!"\nREPEAT 2 TIMES:\n  DISPLAY: "Hello Grace!"\n');

    workspace.dispose();
  });

  it('wraps the greeting in a repeat block when TIMES is greater than one', () => {
    const workspace = new Blockly.Workspace();

    const greetingBlock = workspace.newBlock('greeting');
    greetingBlock.setFieldValue('3', 'TIMES');
    greetingBlock.setFieldValue('Blockly', 'SUBJECT');

    const code = pseudoGenerator.blockToCode(greetingBlock);

    expect(code).toBe('REPEAT 3 TIMES:\n  DISPLAY: "Hello Blockly!"\n');

    workspace.dispose();
  });

  it('returns an empty string when TIMES is less than one', () => {
    const workspace = new Blockly.Workspace();
    const greetingBlock = workspace.newBlock('greeting');
    greetingBlock.setFieldValue('0', 'TIMES');
    greetingBlock.setFieldValue('Nobody', 'SUBJECT');

    const code = pseudoGenerator.blockToCode(greetingBlock);

    expect(code).toBe('');

    workspace.dispose();
  });
});
