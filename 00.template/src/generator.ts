import * as Blockly from 'blockly';

// TODO select a generator to use. For example, you could use the built-in JavaScript generator or create your own custom generator.
export const generator = new Blockly.Generator('PseudoCode');
// import { javascriptGenerator, JavascriptGenerator, Order } from 'blockly/javascript';
// export const generator = javascriptGenerator;

generator.INDENT = '  ';

// TODO add your code generation logic here.
// https://developers.google.com/blockly/guides/create-custom-blocks/generating-code