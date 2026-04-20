import * as Blockly from 'blockly';
import { beforeAll, describe, expect, it } from 'vitest';
import { defineBlocks } from './blocks';
import { generator } from './generator';

describe('pseudoGenerator', () => {
  beforeAll(() => {
    defineBlocks();
  });

  // TODO add tests for the generator here.
  
  it('generates something', () => {
    const workspace = new Blockly.Workspace();

    const block = workspace.newBlock('XXX');

    const code = generator.blockToCode(block);

    expect(code).toBe('XXX');

    workspace.dispose();
  });

});
