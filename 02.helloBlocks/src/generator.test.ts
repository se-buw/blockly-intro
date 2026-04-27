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

  it('generates code for a greeting block with connected inputs', () => {
    const workspace = new Blockly.Workspace();

    const greetingBlock = workspace.newBlock('greeting_external');
    const timesBlock = workspace.newBlock('math_number');
    const subjectBlock = workspace.newBlock('text');
    timesBlock.setFieldValue('3', 'NUM');
    subjectBlock.setFieldValue('Blockly', 'TEXT');

    requireConnection(greetingBlock.getInput('TIMES')?.connection ?? null).connect(
      requireConnection(timesBlock.outputConnection),
    );
    requireConnection(greetingBlock.getInput('SUBJECT')?.connection ?? null).connect(
      requireConnection(subjectBlock.outputConnection),
    );

    const code = pseudoGenerator.blockToCode(greetingBlock);

    expect(code).toBe('REPEAT 3 TIMES:\n  DISPLAY: "Hello Blockly!"\n');

    workspace.dispose();
  });

  it('appends chained next blocks via scrub_', () => {
    const workspace = new Blockly.Workspace();

    const first = workspace.newBlock('greeting_external');
    const second = workspace.newBlock('greeting_external');
    const firstTimes = workspace.newBlock('math_number');
    const firstSubject = workspace.newBlock('text');
    const secondTimes = workspace.newBlock('math_number');
    const secondSubject = workspace.newBlock('text');

    firstTimes.setFieldValue('1', 'NUM');
    firstSubject.setFieldValue('Ada', 'TEXT');
    secondTimes.setFieldValue('2', 'NUM');
    secondSubject.setFieldValue('Grace', 'TEXT');

    requireConnection(first.getInput('TIMES')?.connection ?? null).connect(
      requireConnection(firstTimes.outputConnection),
    );
    requireConnection(first.getInput('SUBJECT')?.connection ?? null).connect(
      requireConnection(firstSubject.outputConnection),
    );
    requireConnection(second.getInput('TIMES')?.connection ?? null).connect(
      requireConnection(secondTimes.outputConnection),
    );
    requireConnection(second.getInput('SUBJECT')?.connection ?? null).connect(
      requireConnection(secondSubject.outputConnection),
    );
    requireConnection(first.nextConnection).connect(
      requireConnection(second.previousConnection),
    );

    const code = pseudoGenerator.workspaceToCode(workspace);

    expect(code).toBe('REPEAT 1 TIMES:\n  DISPLAY: "Hello Ada!"\nREPEAT 2 TIMES:\n  DISPLAY: "Hello Grace!"\n');

    workspace.dispose();
  });

  it('throws when the TIMES input is missing', () => {
    const workspace = new Blockly.Workspace();

    const greetingBlock = workspace.newBlock('greeting_external');
    const subjectBlock = workspace.newBlock('text');
    subjectBlock.setFieldValue('Blockly', 'TEXT');
    requireConnection(greetingBlock.getInput('SUBJECT')?.connection ?? null).connect(
      requireConnection(subjectBlock.outputConnection),
    );

    expect(() => pseudoGenerator.blockToCode(greetingBlock)).toThrow('Missing input code for TIMES');

    workspace.dispose();
  });

  it('throws when the SUBJECT input is missing', () => {
    const workspace = new Blockly.Workspace();
    const greetingBlock = workspace.newBlock('greeting_external');
    const timesBlock = workspace.newBlock('math_number');
    timesBlock.setFieldValue('2', 'NUM');
    requireConnection(greetingBlock.getInput('TIMES')?.connection ?? null).connect(
      requireConnection(timesBlock.outputConnection),
    );

    expect(() => pseudoGenerator.blockToCode(greetingBlock)).toThrow('Missing input code for SUBJECT');

    workspace.dispose();
  });
});
