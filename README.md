# Learn Node.js: A Personal Learning Notebook

This project is a notebook for learning Node.js step by step. It is not a real app. Each file in `src/` teaches **one** Node.js topic with small, runnable examples and lots of comments.

If you are reading this years later and have forgotten everything: start at [How to use this project](#how-to-use-this-project), then read the lessons in order.

---

## Table of contents

1. [What is Node.js? (very short)](#what-is-nodejs-very-short)
2. [How to use this project](#how-to-use-this-project)
3. [Project structure](#project-structure)
4. [Lessons](#lessons)
   - [01 - The `process` object](#01---the-process-object)
   - [02 - The `crypto` module](#02---the-crypto-module)
   - [03 - The `os` module](#03---the-os-module)
   - [04 - The `path` module](#04---the-path-module)
   - [05 - The timer module](#05---the-timer-module)
5. [How the lessons connect](#how-the-lessons-connect)
6. [Important concepts explained simply](#important-concepts-explained-simply)
7. [Dependencies](#dependencies)
8. [Configuration files](#configuration-files)
9. [Learning roadmap](#learning-roadmap)
10. [Known problems and things to fix](#known-problems-and-things-to-fix)
11. [How this README is maintained](#how-this-readme-is-maintained)

---

## What is Node.js? (very short)

JavaScript was first made to run **inside a web browser**. Node.js lets you run JavaScript **on your own computer or a server**, outside the browser. That makes it possible to build backends: programs that talk to databases, read files, and answer requests from websites and apps.

Node.js comes with many **built-in modules** (ready-made toolboxes). For example `path` helps with file paths and `crypto` helps with security. You do not need to install built-in modules. You just `import` them.

---

## How to use this project

### One-time setup

You need Node.js installed (the lessons use features from Node 20.11 and newer). Then, inside this folder:

```bash
npm install
```

This downloads the tools listed in `package.json` into the `node_modules/` folder.

### Run a lesson

Each lesson has a number. Run it with `npm run <number>`:

```bash
npm run 01     # process object
npm run 02     # crypto module
npm run 03     # os module
npm run 04     # path module
npm run 05     # timer module
```

Lesson 01 also accepts extra options. Notice the extra `--`; without it, npm swallows the options itself:

```bash
npm run 01 -- migrate     # pass a custom command word
npm run 01 -- --crash     # pretend the app crashed (exit code 1)
npm run 01 -- --fail      # pretend the app failed (exit code 2)
```

### Other commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Runs `src/index.ts` and re-runs it every time you save. Good for experiments. |
| `npm run build` | Compiles TypeScript from `src/` into JavaScript in `dist/`. See [Known problems](#known-problems-and-things-to-fix): it may fail today. |
| `npm test` | Does nothing useful. No tests exist yet. |

### Why can we run `.ts` files directly?

The code is written in **TypeScript** (JavaScript plus types). Node.js cannot run TypeScript by itself. The tool `tsx` reads the `.ts` file and runs it right away, so you do not need a separate build step to try an example.

---

## Project structure

```
learnNodeJs/
├── src/                       <- all the code lives here
│   ├── 01-process-object.ts   <- lesson 1
│   ├── 02-crypto-module.ts    <- lesson 2
│   ├── 03-os-module.ts        <- lesson 3
│   ├── 04-path-module.ts      <- lesson 4
│   ├── 05-timer-module.ts     <- lesson 5
│   └── index.ts               <- scratch file for quick experiments
├── concept.md                 <- your own notes (do not rewrite)
├── CLAUDE.md                  <- rules for the Claude Code assistant
├── README.md                  <- this file
├── package.json               <- project info, scripts, dependencies
├── package-lock.json          <- exact versions installed (auto-generated)
├── tsconfig.json              <- TypeScript settings
└── .gitignore                 <- files git should ignore (node_modules/)
```

**Rule of the project:** one file in `src/` = one topic, numbered in learning order. Every new lesson also gets its own `npm run NN` script in `package.json`.

---

## Lessons

Every lesson file is written to be read **top to bottom**: a big comment at the top ("What is this? Why do we need it?"), then numbered sections, then small examples that print something with `console.log`.

### 01 - The `process` object

**File:** `src/01-process-object.ts` | **Run:** `npm run 01`

**What it is:** `process` is a built-in object that represents the program that is running right now. It is the bridge between your code and the operating system.

**Why it exists:** Your program needs to ask things like "which Node version am I on?", "what settings were given to me?", "how should I stop?" Without `process` you could not answer these.

**What the file teaches:**

1. **System info.** `process.version`, `process.platform`, `process.pid` (the number the OS gave this program), `process.cwd()` (the folder you ran the command from).
2. **Environment variables.** `process.env` holds settings that live outside your code, such as `NODE_ENV` or `PORT`. They keep secrets (passwords, API keys) out of source code. **Every value is a string**, so a number must be converted, e.g. `parseInt(process.env.PORT, 10)`.
3. **Command-line arguments.** `process.argv` is a list of what the user typed. Item `[0]` is the Node path, `[1]` is the script path, and `[2]` onwards are the user's own words. `process.argv.slice(2)` gives only the user's part.
4. **Lifecycle events.** `process.on("exit", ...)` runs your function just before the program ends. Only quick, synchronous work works there (no timers or database calls).
5. **Exiting.** `process.exit(code)` stops the program. `0` means success; any other number means an error. Other programs and deploy tools read this number to know if the run succeeded.

**Code flow:**

```
read env settings -> read argv -> register "exit" listener -> runApp()
                                                                 |
                                          --crash? exit(1)  --fail? exit(2)
                                                                 |
                                                   otherwise print success
                                                                 |
                                               "exit" listener prints the code
```

**Tiny example:**

```ts
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
// no PORT set -> 3000. PORT="8080" -> the number 8080.
```

### 02 - The `crypto` module

**File:** `src/02-crypto-module.ts` | **Run:** `npm run 02`

**What it is:** A built-in toolbox for security-related work: random values, hashing, and signing.

**Why it exists:** Normal tools like `Math.random()` are predictable, so they are unsafe for secrets. `crypto` gives properly unpredictable values and trusted algorithms.

**What the file teaches (in order):**

| Tool | Plain meaning | Use it for |
| --- | --- | --- |
| `crypto.randomUUID()` | "Give me a unique ID." | user ID, order ID, request ID |
| `crypto.randomBytes(32)` | "Give me a secret random value." | password reset tokens, API secrets |
| `crypto.createHash("sha256")` | "Give me a fingerprint of this data." | checking a file or data did not change |
| `crypto.createHmac("sha256", key)` | "Give me a fingerprint that needs a secret key." | webhook signatures, signed requests |

**Concepts inside this lesson:**

- **Hash.** A one-way scramble. The same input always gives the same output, a tiny change gives a totally different output, and you cannot go backwards. A hash is **not** encryption (encryption can be undone with a key; a hash cannot).
- **Do not store passwords with plain SHA-256.** Use slow, purpose-made tools like Argon2, bcrypt or scrypt, which also add a random "salt".
- **HMAC.** A hash plus a secret key. Only someone who knows the key can create or check the signature. This proves the message was not changed and came from the key holder.
- **Webhook verification.** The file builds `verifyWebhookSignature()`: recompute the signature from the body you received and compare it with the one sent. It compares with `crypto.timingSafeEqual()` instead of `===`, because `===` stops at the first wrong character and that tiny timing difference can leak information to attackers (a "timing attack"). It also checks the lengths first, because `timingSafeEqual` throws an error when lengths differ.

**Code flow of the webhook example:**

```
payload + secret -> HMAC -> signature
received payload + secret -> HMAC -> expected signature
compare expected vs received (timing-safe) -> true / false
```

The file tests it twice: the real payload gives `true`; a payload with a changed amount gives `false`.

### 03 - The `os` module

**File:** `src/03-os-module.ts` | **Run:** `npm run 03`

**What it is:** A built-in module that tells you about the computer your program runs on.

**Why it exists:** Sometimes a program must adapt to its machine, for example by checking free memory or the number of CPU cores.

**What the file prints:**

- `os.cpus()` - a list with details of each CPU core
- `os.totalmem()` and `os.freemem()` - total and free memory, in **bytes**
- `os.type()` and `os.platform()` - the operating system name
- `os.uptime()` - seconds since the computer started
- `os.homedir()` - your home folder path (remember the `()`: without the brackets you print the function itself, not the path)

This is the shortest lesson. It only has plain `console.log` lines and just three short comment lines, so it does not yet explain the "what" and "why" like the other lessons.

### 04 - The `path` module

**File:** `src/04-path-module.ts` | **Run:** `npm run 04`

**What it is:** A built-in module that builds and takes apart file and folder paths (like `/home/akash/project/src/app.ts`).

**Why it exists:** Windows writes paths with `\` and Linux/macOS use `/`. If you join strings by hand (`a + "/" + b`) your code may break on another computer. `path` uses the correct separator for the system. It only works on **text**: it never checks if a file really exists.

**What the file teaches:**

1. **Where am I?** The file's own location (`import.meta.filename`, `import.meta.dirname`) is different from the working folder (`process.cwd()`). In this project `__dirname` does not exist because of ES modules (see [concepts](#es-modules-vs-commonjs)).
2. **Building paths.** `path.join()` stitches pieces together and cleans them; `path.resolve()` always returns a full absolute path.
3. **Taking a path apart.** `basename` (file name), `dirname` (folder), `extname` (extension), `parse` (all pieces as an object), `format` (the reverse of `parse`).
4. **Extras.** `normalize`, `isAbsolute`, `relative`, `sep`, `delimiter`, `posix` / `win32`.
5. **Security: path traversal.** If a user sends `../../etc/passwd` and you blindly join it to your uploads folder, they can escape the folder. Fix: resolve the final path, then check that it still starts with the folder you expect.

**Tiny example:**

```ts
path.join("/a", "b", "..", "c");   // "/a/c"   (".." means go up one folder)
path.extname("photo.png");         // ".png"
```

**Connection to other lessons:** it uses `process.cwd()` from lesson 01. The path knowledge is needed for the upcoming file system lesson.

### 05 - The timer module

**File:** `src/05-timer-module.ts` | **Run:** `npm run 05`

**What it is:** timers let you run a function *later* instead of right now. They are global, so there is nothing to import.

**Why it exists:** Node runs your code line by line. If you want "do this after 2 seconds", you must not freeze the whole program while waiting. A timer says "remember this job, keep running the rest of my code, come back later".

**What the file shows, in order:**
1. `setTimeout` runs a function once after a delay. The next line does not wait.
2. `setInterval` repeats a function. `clearInterval` stops it (the demo counts to 3 and stops, otherwise the program never ends).
3. `clearTimeout` cancels a timer before it runs.
4. `setImmediate` runs a function right after the current work.
5. The run order: normal lines first, then `process.nextTick`, then timers and `setImmediate`. The order of `setTimeout(0)` versus `setImmediate` is not guaranteed.

**Connection to other lessons:** this is a first look at "later" code, which leads to the event loop lesson (planned).

### Scratch file: `src/index.ts`

Contains one `console.log`. Run with `npm run dev`. Use it to try small ideas. It is not a lesson.

---

## How the lessons connect

```
01 process  ------> 04 path        (path examples use process.cwd())
     |
     +------------> 02 crypto      (secrets often come from process.env)
     |
03 os               (stands alone: info about the machine)

04 path  ---------> file system lesson (planned): needs paths to find files
05 timers ---------> event loop lesson (planned): timers are the easiest way to see it
```

Lessons are mostly independent, so you can run any of them alone.

---

## Important concepts explained simply

### Module
A ready-made toolbox of code you can import. Built-in ones ship with Node.js (`path`, `os`, `crypto`, `process`). Others you install with npm.

### The `node:` prefix
`import path from "node:path"` the `node:` part says "this is a Node built-in, not something from npm". It is the modern, clearer way to import built-ins. (Lessons 02 and 03 do not use the prefix yet; both styles work.)

### ES modules vs CommonJS
Node has two ways to share code between files.

| | CommonJS (old) | ES modules (new, used here) |
| --- | --- | --- |
| Import | `const x = require("x")` | `import x from "x"` |
| Current folder | `__dirname` | `import.meta.dirname` |
| Current file | `__filename` | `import.meta.filename` |

This project is set to ES modules by `"type": "module"` in `package.json`. So `require()` and `__dirname` give errors here.

### Environment variable
A setting stored outside your code, in the operating system. Example: `PORT=8080`. Why: the same code can run on your laptop and on a server with different settings, and secrets stay out of your code and out of git.

### Exit code
A number a program gives back when it ends. `0` = all good. Anything else = something went wrong.

### Dependency vs devDependency (from your own notes in `concept.md`)
- **dependency**: needed while the app is **running**.
- **devDependency**: needed only while **developing** (compilers, type helpers, test tools).

This project has only devDependencies, because it is just for learning.

### Synchronous vs asynchronous
- **Synchronous**: do the job now, wait until it is finished, then move on.
- **Asynchronous**: start the job, move on, and get told when it finishes later.
The `exit` event in lesson 01 can only do synchronous work. Async is covered in the planned event loop and async/await lessons.

---

## Dependencies

All three are in `devDependencies` of `package.json`:

| Package | Why we have it |
| --- | --- |
| `typescript` | The TypeScript language and compiler (`tsc`, used by `npm run build`). |
| `tsx` | Runs `.ts` files directly, with no build step. Powers every `npm run NN` command and `npm run dev`. |
| `@types/node` | Type descriptions for Node's built-in modules. It lets TypeScript and your editor understand `path`, `os`, `process`, and so on. |

---

## Configuration files

### `package.json`
- `"type": "module"` turns on ES modules.
- `"scripts"` are the shortcuts for `npm run ...` (`01` to `04`, `dev`, `build`, `test`).
- `"devDependencies"` is the list above.

### `tsconfig.json` (TypeScript settings)
- `target: ES2022` - which JavaScript version the output uses.
- `module` / `moduleResolution: NodeNext` - follow Node's real rules for ES modules.
- `strict: true` - the strictest, safest type checking.
- `rootDir: ./src`, `outDir: ./dist` - read from `src/`, write compiled output to `dist/`.
- `types: ["node", "jest"]` - see the next section about `jest`.

### `.gitignore`
Tells git to ignore `node_modules/` (downloaded packages; anyone can recreate them with `npm install`) and `settings.json`.

---

## Learning roadmap

The order you planned in `concept.md`:

1. process object (done: lesson 01)
2. path module (done: lesson 04)
3. file system (`fs`)
4. event loop
5. callbacks, promises, async/await
6. event emitter
7. buffer
8. crypto module (done: lesson 02)
9. error handling
10. basic streams

Note: lesson file numbers do **not** match this list, because lessons were added in the order they were studied (`os` and `timer` were added too). Follow the file numbers in `src/` for what exists, and `concept.md` for what is planned.

---

## Known problems and things to fix

Written here so the notes stay honest:

- **`npm run build` may fail.** `tsconfig.json` lists `"jest"` under `types`, but jest is not installed. Fix: remove `"jest"` from that list, or install jest.
- **Lessons 02 and 03** do not use the `node:` import prefix like 01 and 04 do.
- **No tests or linter** are set up.

---

## How this README is maintained

- Whenever a lesson or significant feature is added, changed, or pushed, this README is updated in the same piece of work.
- Each new lesson gets: an entry in the table of contents and project structure, a section under [Lessons](#lessons) (what it is, why it exists, how it works, how it connects), and its `npm run NN` command.
- Only code that really exists is documented. Unfinished ideas are marked as such.
- When a problem in [Known problems](#known-problems-and-things-to-fix) is fixed, remove it from that list.
