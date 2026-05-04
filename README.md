# Blockly Tutorial

This repository serves as an introduction to developing [blockly](https://developers.google.com/blockly) languages and code generators. 

It is part of a tutorial that teaches how to define visual Blockly languages and code generators. 

In addition to the code in this repository, the tutorial comes with:
- A [step-by-step guide to defining visual Blockly languages and code generators](https://se-buw.de/teaching/gse/tutorials/blockly/).
- A [video walkthrough of the tutorial](https://www.youtube.com/watch?v=95_8n-FnHyo&list=PLGyeoukah9NbMQqFaMfuGMkAQ-yaaWUD3), explaining the concepts and demonstrating the implementation.

## Blockly Examples in this Repository

The repository contains a collection of examples of increasing complexity:
- [01.helloBlock](./01.helloBlock): A very basic Hello-World-language and a code generator that produces Pseudo code. It demonstrated:
  - defining a blockly language, here, a single block with a number field and a text field
  - defining a code generator for a language from scratch
  - setting up a workspace and graphical user interface

- [02.helloBlocks](./02.helloBlocks): An extended Hello-World-language that composes blocks through typed inputs. It demonstrated:
  - defining blocks that consume values from other blocks via `input_value`
  - generating code from nested blocks using `valueToCode`
  - adding built-in blocks (`math_number`, `text`) and custom generator rules for them

- [03.turtle](./03.turtle): A small turtle-graphics language and executable simulator. It demonstrated:
  - creating a richer block language (movement, turning, routines, and routine calls -- where blocks actively identify available routines via JavaScript code)
  - combining custom blocks with built-in control-flow blocks such as loops
  - reusing a code generator that produces JavaScript code
  - running generated code against a simulator with visual playback

  
Finally, the repository contains a minimal and empty template project [00.template](./00.template) that can be used as a starting point for new blockly languages and code generators.

## Installation and Running

Each example is a standalone Vite + TypeScript project with its own `package.json`.

Prerequisites:
- Node.js (recent LTS version)
- npm

1. Install dependencies:
  - `npm install`
2. Start the development server:
  - `npm run dev:<project-name>` (e.g., `npm run dev:helloBlock`)
  - Available: `dev:template`, `dev:helloBlock`, `dev:helloBlocks`, `dev:turtle`
3. Open the local URL printed by Vite (typically `http://localhost:5173` -- changes based on availability of ports).

Optional commands (inside any project folder):
- Run tests once: `npm test`
- Run tests in watch mode: `npm run test:watch`
- Build for production: `npm run build`
- Preview production build: `npm run preview:<project-name>` (e.g., `npm run preview:helloBlock`)

