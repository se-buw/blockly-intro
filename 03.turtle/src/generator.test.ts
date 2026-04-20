import * as Blockly from 'blockly';
import { beforeAll, describe, expect, it } from 'vitest';
import { defineBlocks } from './blocks';
import { turtleGenerator } from './generator';

function requireConnection(connection: Blockly.Connection | null): Blockly.Connection {
  if (!connection) {
    throw new Error('Expected Blockly connection to exist.');
  }

  return connection;
}

describe('turtleGenerator', () => {
  beforeAll(() => {
    defineBlocks();
  });

  it('generates forward movement code', () => {
    const workspace = new Blockly.Workspace();
    const moveBlock = workspace.newBlock('turtle_move');
    const distanceBlock = workspace.newBlock('math_number');

    moveBlock.setFieldValue('FORWARD', 'DIRECTION');
    distanceBlock.setFieldValue('50', 'NUM');
    requireConnection(moveBlock.getInput('DISTANCE')?.connection ?? null).connect(
      requireConnection(distanceBlock.outputConnection),
    );

    const code = turtleGenerator.workspaceToCode(workspace);

    expect(code).toBe('turtle.move(50);\n');

    workspace.dispose();
  });

  it('encodes backward movement as a negative distance', () => {
    const workspace = new Blockly.Workspace();
    const moveBlock = workspace.newBlock('turtle_move');
    const distanceBlock = workspace.newBlock('math_number');

    moveBlock.setFieldValue('BACKWARD', 'DIRECTION');
    distanceBlock.setFieldValue('25', 'NUM');
    requireConnection(moveBlock.getInput('DISTANCE')?.connection ?? null).connect(
      requireConnection(distanceBlock.outputConnection),
    );

    const code = turtleGenerator.workspaceToCode(workspace);

    expect(code).toBe('turtle.move(-(25));\n');

    workspace.dispose();
  });

  it('generates chained turtle statements in workspace order', () => {
    const workspace = new Blockly.Workspace();

    const first = workspace.newBlock('turtle_move');
    const firstDistance = workspace.newBlock('math_number');
    const second = workspace.newBlock('turtle_turn');
    const secondAngle = workspace.newBlock('math_number');

    first.setFieldValue('FORWARD', 'DIRECTION');
    firstDistance.setFieldValue('10', 'NUM');
    second.setFieldValue('RIGHT', 'DIRECTION');
    secondAngle.setFieldValue('90', 'NUM');
    requireConnection(first.getInput('DISTANCE')?.connection ?? null).connect(
      requireConnection(firstDistance.outputConnection),
    );
    requireConnection(second.getInput('ANGLE')?.connection ?? null).connect(
      requireConnection(secondAngle.outputConnection),
    );
    requireConnection(first.nextConnection).connect(requireConnection(second.previousConnection));

    const code = turtleGenerator.workspaceToCode(workspace);

    expect(code).toBe('turtle.move(10);\nturtle.turn(90);\n');

    workspace.dispose();
  });

  it('works with controls_repeat_ext using built-in JavaScript generation', () => {
    const workspace = new Blockly.Workspace();

    const repeat = workspace.newBlock('controls_repeat_ext');
    const times = workspace.newBlock('math_number');
    const body = workspace.newBlock('turtle_turn');
    const angle = workspace.newBlock('math_number');

    times.setFieldValue('3', 'NUM');
    body.setFieldValue('LEFT', 'DIRECTION');
    angle.setFieldValue('90', 'NUM');

    requireConnection(repeat.getInput('TIMES')?.connection ?? null).connect(
      requireConnection(times.outputConnection),
    );
    requireConnection(body.getInput('ANGLE')?.connection ?? null).connect(
      requireConnection(angle.outputConnection),
    );
    requireConnection(repeat.getInput('DO')?.connection ?? null).connect(
      requireConnection(body.previousConnection),
    );

    const code = turtleGenerator.workspaceToCode(workspace);

    expect(code).toContain('for (var count = 0; count < 3; count++)');
    expect(code).toContain('turtle.turn(-(90));');

    workspace.dispose();
  });

  it('falls back to zero distance when movement input is not connected', () => {
    const workspace = new Blockly.Workspace();
    workspace.newBlock('turtle_move');

    const code = turtleGenerator.workspaceToCode(workspace);

    expect(code).toBe('turtle.move(0);\n');

    workspace.dispose();
  });
});
