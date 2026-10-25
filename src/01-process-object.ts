import process from "node:process";

/* =========================================================
   WHAT IS THE `process` OBJECT?
   =========================================================
   - `process` is a built-in, global object in Node.js.
   - It acts as a bridge between your running JavaScript code 
     and the underlying Operating System (OS).
   - Because it is global, you don't need to install any npm package.
   - (Importing `node:process` is optional, but recommended in modern 
     TypeScript for type safety and clarity).

   Common things `process` is used for:
   1. System & runtime info (Node version, OS platform, PID, cwd)
   2. Environment variables (`process.env`)
   3. Command-line arguments (`process.argv`)
   4. Lifecycle events (`process.on("exit")`)
   5. Controlling application exit (`process.exit()`)
   ========================================================= */


/* =========================================================
   1. Basic System & Process Info
   ========================================================= */

/*
 * Quick snapshot of the current running environment:
 * - process.version  -> Which version of Node.js is running
 * - process.platform -> Operating system ('win32', 'linux', 'darwin')
 * - process.pid      -> Process ID assigned by the OS
 * - process.cwd()    -> Current Working Directory from where the script ran
 */

console.log("=== 1. System & Process Info ===");
console.log(`Node Version : ${process.version}`);
console.log(`Platform     : ${process.platform}`);
console.log(`Process ID   : ${process.pid}`);
console.log(`Current Dir  : ${process.cwd()}`);
console.log();


/* =========================================================
   2. Environment Variables: `process.env`
   ========================================================= */

/*
 * WHAT IS IT?
 * `process.env` is an object containing all environment variables
 * set in your OS or passed into the process.
 *
 * WHY DO WE USE IT?
 * 1. Configuration: Switch behavior between 'development', 'staging', & 'production'.
 * 2. Security: Keep secrets (API keys, DB passwords) out of source code.
 *
 * CRITICAL RULE:
 * Every value in `process.env` is ALWAYS a string (or undefined).
 * If you need numbers or booleans, you must parse/convert them manually!
 */

console.log("=== 2. Environment Variables ===");

// 1. String variable with fallback default:
const nodeEnv: string = process.env.NODE_ENV || "development";

// 2. Numeric variable (must be parsed from string):
const port: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// 3. Secret key example:
const secretKey: string = process.env.SECRET_KEY || "default_dev_secret_key";

console.log(`NODE_ENV   : ${nodeEnv}`);
console.log(`PORT       : ${port} (type: ${typeof port})`);
console.log(`SECRET_KEY : ${secretKey}`);
console.log();


/* =========================================================
   3. Command Line Arguments: `process.argv`
   ========================================================= */

/*
 * WHAT IS IT?
 * `process.argv` is an array containing all command-line arguments 
 * passed when launching the Node.js process.
 *
 * THE STRICT 3-PART STRUCTURE OF `process.argv`:
 * [0] -> Path to the Node executable (e.g., C:\Program Files\nodejs\node.exe)
 * [1] -> Path to the executed file (e.g., E:\basic_node\src\01-process-object.ts)
 * [2+] -> Custom user arguments and flags passed in the terminal!
 *
 * PRO TIP:
 * To get ONLY the user's custom arguments, slice off the first two items:
 * const userArgs = process.argv.slice(2);
 */

console.log("=== 3. Command Line Arguments ===");
console.log("Full process.argv array:", process.argv);

// Extract only user-provided arguments:
const userArgs = process.argv.slice(2);
console.log("User arguments only     :", userArgs);

// 1. Positional Argument (e.g., first word after the script):
// Default to "start" if no argument was provided:
const command = userArgs[0] && !userArgs[0].startsWith("--") ? userArgs[0] : "start";

// 2. Boolean Flags (e.g., checking if user passed --crash or --fail):
const shouldCrash = process.argv.includes("--crash");
const shouldFail = process.argv.includes("--fail");

console.log(`Command detected        : ${command}`);
console.log(`Flag --crash present?   : ${shouldCrash}`);
console.log(`Flag --fail present?    : ${shouldFail}`);
console.log();

/*
 * ---------------------------------------------------------
 * IMPORTANT NOTE ON NPM SCRIPTS:
 * ---------------------------------------------------------
 * When running via npm scripts (e.g. `npm run 01`), npm intercepts
 * flags unless you use an extra `--` delimiter!
 *
 * ❌ WRONG:  npm run 01 --fail
 *   (npm consumes `--fail` for itself or passes it incorrectly)
 *
 * ✔️ CORRECT: npm run 01 -- --fail
 *   (The first `--` tells npm: "Pass everything after this directly to tsx/node")
 */


/* =========================================================
   4. Process Lifecycle Events: `process.on()`
   ========================================================= */

/*
 * WHAT IS IT?
 * `process` is an EventEmitter. It emits events during different
 * stages of the program's lifecycle.
 *
 * "exit" EVENT:
 * Emitted when the Node.js process is about to exit.
 *
 * IMPORTANT RULES FOR "exit":
 * 1. Great for final cleanup logging or closing synchronous resources.
 * 2. You CANNOT perform asynchronous operations here (e.g., setTimeout,
 *    database calls, or promises will NOT complete because the event loop stops).
 */

process.on("exit", (code: number) => {
  console.log();
  console.log("=========================================");
  console.log(`[Lifecycle Event] Process exited with code: ${code}`);
  if (code === 0) {
    console.log("Status: Success (Normal termination)");
  } else {
    console.log(`Status: Terminated with error code (${code})`);
  }
  console.log("=========================================");
});


/* =========================================================
   5. Exiting a Process: `process.exit()`
   ========================================================= */

/*
 * WHAT IS IT?
 * `process.exit(code)` immediately stops the Node.js process.
 *
 * STANDARD EXIT CODES:
 * - 0: Success / clean exit (default if script finishes naturally).
 * - 1: General error / uncaught failure.
 * - 2: Misuse of shell built-in or custom application error code.
 *
 * Any non-zero code signals to the OS and CI/CD pipelines that
 * the script encountered an error.
 */

function runApp() {
  console.log("=== 4. Running Application Demo ===");
  console.log(`Starting app in "${nodeEnv}" mode on port ${port}...`);

  if (shouldCrash) {
    console.warn("⚠️  Simulating a critical crash (--crash detected)...");
    process.exit(1); // Exits immediately with error code 1
  }

  if (shouldFail) {
    console.warn("⚠️  Simulating a business logic failure (--fail detected)...");
    process.exit(2); // Exits immediately with error code 2
  }

  console.log(`✓ Application command "${command}" executed successfully!`);
}

// Start the demo app
runApp();


/* =========================================================
   EASY WAY TO REMEMBER (CHEATSHEET)
   =========================================================

   process.env.MY_VAR
       ↓
   "What is my environment configuration / secret?"
   (Always string, use parseInt/JSON.parse if needed)

   process.argv.slice(2)
       ↓
   "What flags or arguments did the user type in the terminal?"
   ([0] is node, [1] is script, [2+] are user args)

   process.on("exit", (code) => ...)
       ↓
   "Run this final synchronous cleanup log before dying."

   process.exit(0)  -> "I finished successfully."
   process.exit(1)  -> "Something failed, stop now."

   =========================================================
   HOW TO TEST THIS FILE IN YOUR TERMINAL:
   =========================================================
   1. Normal run:
      npm run 01

   2. Pass a custom command:
      npm run 01 -- migrate

   3. Simulate a crash (exit code 1):
      npm run 01 -- --crash

   4. Simulate a failure (exit code 2):
      npm run 01 -- --fail
   ========================================================= */
