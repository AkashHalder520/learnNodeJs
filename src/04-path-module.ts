import path from "node:path";
import process from "node:process";

/* =========================================================
   WHAT IS THE `path` MODULE?
   =========================================================
   - `path` is a built-in Node.js module (no npm install needed).
   - It helps you build, read and clean up FILE and FOLDER PATHS
     (like "/home/akash/project/src/app.ts").
   - It works purely on STRINGS. It never touches the disk, so it
     does NOT check whether a file or folder actually exists.
     (To check or read files you will use the `fs` module later.)

   WHY DO WE NEED IT?
   Different operating systems write paths differently:
     - Linux / macOS : /home/akash/project/src/app.ts   (separator "/")
     - Windows       : C:\Users\akash\project\src\app.ts (separator "\")
   If you glue strings together by hand, your code may work on your
   machine and break on a teammate's or on the production server.
   `path` picks the right separator for the OS the code runs on.

   What we cover in this file:
   1. Where am I?  -> __dirname / __filename in ES modules
   2. Building paths safely -> path.join() and path.resolve()
   3. Taking a path apart -> basename, dirname, extname, parse
   4. Handy extras -> normalize, relative, isAbsolute, format, sep
   ========================================================= */


/* =========================================================
   1. Where am I? (current file and folder)
   ========================================================= */

/*
 * Two different "locations" exist in every Node program. Beginners
 * mix them up all the time:
 *
 * a) The location of THE FILE being executed
 *      -> never changes, no matter where you start the program from.
 * b) The CURRENT WORKING DIRECTORY (cwd)
 *      -> the folder your terminal was in when you typed `node ...`.
 *      -> changes depending on where you run the command from.
 *
 * Example: you run `npm run 04` from /home/akash/learnNodeJs
 *   - file location : /home/akash/learnNodeJs/src/04-path-module.ts
 *   - cwd           : /home/akash/learnNodeJs
 *
 * If you run the same file from inside the `src` folder, the cwd
 * becomes /home/akash/learnNodeJs/src, but the file location stays same.
 *
 * Rule of thumb:
 *   - Need a file RELATIVE TO YOUR CODE (config, template, JSON)?
 *       -> use the file location (currentDir below).
 *   - Need something relative to where the user ran the command?
 *       -> use process.cwd().
 */

/*
 * IMPORTANT (ES modules vs CommonJS):
 * Older Node code uses the globals `__dirname` and `__filename`.
 * Those exist ONLY in CommonJS. This project has "type": "module" in
 * package.json (ES modules), where using them throws:
 *     ReferenceError: __dirname is not defined in ES module scope
 *
 * In ES modules use `import.meta` instead (Node 20.11+):
 *   - import.meta.filename -> full path of THIS file   (was __filename)
 *   - import.meta.dirname  -> full path of THIS folder (was __dirname)
 */
const currentFile = import.meta.filename;
const currentDir = import.meta.dirname;

console.log("=== 1. Where am I? ===");
console.log("Current file :", currentFile);
console.log("Current dir  :", currentDir); // folder that contains this file
console.log("cwd          :", process.cwd()); // folder you ran the command from
console.log();


/* =========================================================
   2. Building paths: path.join() and path.resolve()
   ========================================================= */

/*
 * COMMON MISTAKE - building a path with the `+` operator:
 *
 *     const filePath = currentDir + "/" + "data" + "/" + "users.json";
 *
 * Problems:
 *   - "/" is wrong on Windows (which uses "\").
 *   - Easy to end up with a double slash ("//") or a missing slash.
 *
 * CORRECT WAY - let `path` do it:
 */

// path.join(...parts)
// Glues the parts together using the OS separator, then cleans the
// result (removes duplicate slashes, understands "." and "..").
const dataFile = path.join(currentDir, "data", "users.json");
// -> /home/akash/learnNodeJs/src/data/users.json   (on Linux)

// Watch out: currentDir is ALREADY the `src` folder, so adding "src"
// again would produce ".../src/src/...", which does not exist.
const wrongFile = path.join(currentDir, "src", "04-path-module.ts");

// ".." means "go up one folder". Here we reach the project root:
const projectRoot = path.join(currentDir, "..");
const packageJson = path.join(projectRoot, "package.json");

console.log("=== 2. Building paths ===");
console.log("join  (data file)    :", dataFile);
console.log("join  (src/src bug)  :", wrongFile);
console.log("join  (project root) :", projectRoot);
console.log("join  (package.json) :", packageJson);

/*
 * path.resolve(...parts)
 * Like join, but ALWAYS returns an ABSOLUTE path (starting from the
 * root of the disk). It works from right to left, stopping as soon as
 * it has built an absolute path. If the parts are not enough, it
 * puts process.cwd() in front.
 *
 *   path.resolve("src", "app.ts")
 *     -> <cwd>/src/app.ts
 *   path.resolve("/etc", "nginx", "nginx.conf")
 *     -> /etc/nginx/nginx.conf
 *   path.resolve("/etc", "/var", "log")
 *     -> /var/log     (a part starting with "/" restarts the path)
 *
 * join vs resolve:
 *   - join    : just stitches pieces together (result may be relative).
 *   - resolve : gives the full absolute path, using cwd if needed.
 */
console.log("resolve (relative)   :", path.resolve("src", "app.ts")); // depends on cwd!
console.log("resolve (absolute)   :", path.resolve("/etc", "nginx", "nginx.conf"));

/*
 * NOTE: join()/resolve() only create a string. They do NOT check that
 * the file exists. Use the `fs` module for that (next topic).
 */
console.log();


/* =========================================================
   3. Taking a path apart
   ========================================================= */

/*
 * Given:  /home/akash/learnNodeJs/src/04-path-module.ts
 *
 *   /home/akash/learnNodeJs/src / 04-path-module .ts
 *   |_____________________________| |____________| |__|
 *               dir                      name       ext
 *                                |______________________|
 *                                         base
 *
 * - path.basename(p)  -> "04-path-module.ts"   (file name with extension)
 * - path.dirname(p)   -> "/home/akash/learnNodeJs/src" (folder part)
 * - path.extname(p)   -> ".ts"                 (extension, includes the dot)
 */
const fileName = path.basename(currentFile);
const dirName = path.dirname(currentFile);
const extName = path.extname(currentFile);

console.log("=== 3. Taking a path apart ===");
console.log("File Name      :", fileName);
console.log("Directory Name :", dirName);
console.log("Extension Name :", extName);

// Tip: pass the extension as 2nd argument to basename to strip it.
// Useful for generating names like "04-path-module.js" from the ".ts" file.
console.log("Name w/o ext   :", path.basename(currentFile, extName));

/*
 * path.parse(p) -> gets ALL the pieces in one go, as an object:
 *   { root, dir, base, ext, name }
 *
 *   root : "/"                          (start of the path; "C:\" on Windows)
 *   dir  : "/home/.../src"              (same as dirname)
 *   base : "04-path-module.ts"          (same as basename)
 *   ext  : ".ts"                        (same as extname)
 *   name : "04-path-module"             (base without the extension)
 */
const parsedPath = path.parse(currentFile);
console.log("Parsed Path    :", parsedPath);

/*
 * path.format(obj) does the REVERSE of parse: object -> path string.
 * Handy when you want to change just one piece, e.g. the extension.
 */
const asJsFile = path.format({ ...parsedPath, base: undefined, ext: ".js" });
console.log("Same file, .js :", asJsFile);
console.log();


/* =========================================================
   4. Handy extras
   ========================================================= */

console.log("=== 4. Handy extras ===");

/*
 * path.normalize(p)
 * Cleans a messy path: collapses "//", resolves "." and "..".
 */
console.log("normalize      :", path.normalize("/a//b/../c/./d")); // -> /a/c/d

/*
 * path.isAbsolute(p)
 * true if the path starts from the root of the disk ("/" or "C:\").
 */
console.log("isAbsolute /a  :", path.isAbsolute("/a")); // true
console.log("isAbsolute a/b :", path.isAbsolute("a/b")); // false

/*
 * path.relative(from, to)
 * "How do I get from folder A to folder B?" -> returns the relative path.
 */
console.log("relative       :", path.relative("/a/b", "/a/c/d")); // -> ../c/d

/*
 * path.sep       -> the separator of the current OS ("/" or "\")
 * path.delimiter -> separator used in lists such as PATH (":" or ";")
 */
console.log("sep            :", path.sep);
console.log("delimiter      :", path.delimiter);

/*
 * path.posix / path.win32
 * Force one style regardless of the OS you are on. Useful when you
 * handle URLs or paths that belong to ANOTHER system (e.g. a Linux
 * server path inside a Windows-run script).
 */
console.log("win32.join     :", path.win32.join("a", "b")); // -> a\b

/*
 * SECURITY NOTE (path traversal):
 * Never trust user input when building paths. If a user sends
 * "../../etc/passwd" and you do path.join(uploadsDir, userInput),
 * they can escape your folder and read any file on the server.
 * Always resolve the final path and check it still starts with the
 * folder you expect:
 */
const uploadsDir = path.resolve(projectRoot, "uploads");
const userInput = "../../etc/passwd"; // pretend this came from a request
const requested = path.resolve(uploadsDir, userInput);
const isSafe = requested.startsWith(uploadsDir + path.sep);
console.log("Traversal safe :", isSafe, "->", requested); // false

/* =========================================================
   QUICK CHEAT SHEET
   =========================================================
   Need                              Use
   --------------------------------  ---------------------------
   Combine path pieces               path.join()
   Absolute path from pieces         path.resolve()
   File name (+ extension)           path.basename()
   Folder of a file                  path.dirname()
   Extension (".ts")                 path.extname()
   All pieces at once                path.parse()  / path.format()
   Clean up a messy path             path.normalize()
   Path from A to B                  path.relative()
   Is it absolute?                   path.isAbsolute()
   This file / this folder (ESM)     import.meta.filename / dirname
   Folder the command was run from   process.cwd()
   ========================================================= */
