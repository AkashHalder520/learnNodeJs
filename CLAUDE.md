# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## About the user and the purpose of this repo

The owner is **new to Node.js** and just started learning backend development. This repo is a personal learning notebook, not a production app. Each file in `src/` teaches one Node.js topic.

When working here:
- **Make concepts clear and easy.** Use simple words and short sentences. Avoid jargon; if a technical term is needed, explain it right away in plain language.
- **Don't over-complicate.** Prefer the simplest example that shows the idea. No clever tricks, no extra abstractions.
- **Explain the "why", not just the "what".** Say why a thing exists and what goes wrong without it.
- Teach inside the code with comments, using the style of the existing files (see below).

## How to explain things to the user

Whenever the user asks for an explanation or an example:
- Assume they are a **complete beginner**. Never assume they already know a concept, even a basic one.
- Use very simple language. Avoid jargon. If a technical term is needed, explain it right away with a small everyday example.
- Go **step by step**, in small pieces, and prefer a short practical example over a long theory.
- Say what a thing is, why it exists, and what goes wrong without it.

## Keeping README.md up to date

`README.md` is the long-term guide to this project. It must always match the real code.
- When a module/lesson or significant feature is added, changed, or pushed, update `README.md` in the same piece of work: table of contents, project structure, a lesson section (what it does, why it exists, how it works, how it connects to the other lessons), and the `npm run NN` command.
- Document only what actually exists in the code. Mark unfinished work as unfinished (for example, say clearly when a lesson is only a stub).
- When a problem in the README's "Known problems" section is fixed, remove it from that list.
- Write the README in the same simple, beginner-friendly style described above.

## Commands

```bash
npm run 01     # run src/01-process-object.ts
npm run 02     # run src/02-crypto-module.ts
npm run 03     # run src/03-os-module.ts
npm run 04     # run src/04-path-module.ts
npm run 05     # run src/05-timer-module.ts
npm run dev    # tsx watch src/index.ts (re-runs on save)
npm run build  # tsc, compiles src/ to dist/
```

- Files are run directly with `tsx` (no build step needed to try an example).
- Each new lesson file gets its own numbered script in `package.json` (`"05": "tsx src/05-....ts"`).
- There is no test runner or linter configured; `npm test` is a placeholder that fails.

## Structure and conventions

- `src/NN-topic.ts`: one numbered file per Node.js topic, in learning order. The planned order is in `concept.md` (process, path, fs, event loop, async/await, events, buffer, crypto, errors, streams). The numbering of existing files does not exactly match that list, so follow the file numbers, not `concept.md`.
- `src/index.ts` is only a scratch entry point for `npm run dev`.
- Lesson files are self-contained and are meant to be read top to bottom. The best examples of the expected style are `01-process-object.ts` and `04-path-module.ts`: a big header comment ("What is X? Why do we use it?"), numbered sections, then small runnable `console.log` examples with the expected output in comments. Keep this style when adding or editing lessons.
- Use the `node:` prefix for built-in imports (`node:path`, `node:process`).

## Gotchas

- `package.json` has `"type": "module"` (ES modules). So `__dirname` and `__filename` do **not** exist; use `import.meta.dirname` / `import.meta.filename`. `require()` is also unavailable; use `import`.
- `tsconfig.json` uses `module: NodeNext`, `strict: true`, `rootDir: ./src`, and lists `"jest"` in `types` even though jest is not installed, so `npm run build` may fail on that until it's removed or jest is added.
- `concept.md` holds the user's own learning notes; don't rewrite it unless asked.
