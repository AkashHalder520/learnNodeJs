/*
 * ============================================================
 *  Callbacks, Promises, and async/await
 * ============================================================
 *
 * WHAT IS THE PROBLEM?
 * Some jobs take time: reading a file, asking a database, calling
 * a website. Node.js does NOT sit and wait for them. If it did,
 * the whole program would freeze (like a shop where the cashier
 * stops serving everyone while one customer looks for their wallet).
 *
 * So Node.js says: "Start the job. Call me back when it is done.
 * Meanwhile I will do other work."
 *
 * There are 3 ways to say "tell me when it is done":
 *   1. Callback       (the oldest way)
 *   2. Promise        (a cleaner way)
 *   3. async / await  (the easiest to read, built on Promises)
 *
 * All 3 solve the SAME problem. This file shows the same task
 * (find a user by id) written in all 3 ways.
 *
 * Everyday example: you order food at a restaurant.
 *   - Callback : you give your phone number. "Call me when ready."
 *   - Promise  : you get a token. The token will become food (or
 *                "sorry, we ran out").
 *   - async/await : you wait at the table, but only YOU wait.
 *                The rest of the restaurant keeps working.
 *
 * Run it: npm run 06
 */

// ------------------------------------------------------------
// 0. The fake data
// ------------------------------------------------------------
// A "type" tells TypeScript what a User looks like.
// If we forget a field or spell it wrong, TypeScript warns us.
type User = {
  id: number;
  name: string;
  role: "user" | "super-admin"; // role can ONLY be one of these two words
};

// Our fake "database": just a list in memory.
const user: User[] = [
  { id: 1, name: "Junaid", role: "user" },
  { id: 2, name: "Ali", role: "super-admin" },
  { id: 3, name: "Ahmed", role: "user" },
];

// ------------------------------------------------------------
// 1. CALLBACK
// ------------------------------------------------------------
// A callback is just a function that you pass INTO another function,
// so that function can call it later, when its work is finished.
//
// Node.js has a rule for callbacks: the first argument is the
// error, the second is the result.
//   - Something went wrong -> callback(error)
//   - All good             -> callback(null, result)
// "null" means "no error".
//
// setTimeout here pretends the search takes time (like a real
// database would). Without it, the example would not show the
// "come back later" idea.

function findUserWithCallback(
  userId: number,
  callback: (error: Error | null, user?: User) => void,
): void {
  setTimeout(() => {
    const userFound = user.find((user) => user.id === userId);
    if (!userFound) {
      callback(new Error("User not found")); // failure: send the error
      return; // stop here, so we do not call callback a second time
    }
    callback(null, userFound); // success: no error, send the user
  });
}

// Way A: write the callback directly inside the call.
// findUserWithCallback(9, (error, user) => {
//     if (error) {
//         console.error(error.message);
//     } else {
//         console.log(user);
//     }
// })

// Way B: give the callback a name. Same result, easier to read,
// and you can reuse it.
function displayUser(error: Error | null, user?: User): void {
  if (error) {
    console.error(error.message);
  } else {
    console.log(user, "response from callback");
  }
}

// We pass displayUser WITHOUT brackets. We are not running it now.
// We are handing it over so findUserWithCallback can run it later.
// findUserWithCallback(9, displayUser);
// Expected output: User not found   (there is no user with id 9)

// WHY CALLBACKS ARE PAINFUL:
// If you need step 1, then step 2 after it, then step 3 after that,
// you must put callbacks inside callbacks inside callbacks.
// The code drifts to the right and gets very hard to read.
// People call this "callback hell". Promises were made to fix it.

// ------------------------------------------------------------
// 2. PROMISE
// ------------------------------------------------------------
// A Promise is an object that means: "I do not have the answer yet,
// but I promise I will give you either a result or an error."
//
// A Promise is always in one of 3 states:
//   - pending   : still working
//   - fulfilled : finished OK     (we called resolve)
//   - rejected  : failed          (we called reject)
//
// Inside new Promise(...) we get two helpers:
//   - resolve(value) : "success, here is the answer"
//   - reject(error)  : "failure, here is the problem"
//
// Compare with the callback version: no callback argument any more.
// The function simply RETURNS a Promise, and the caller decides
// what to do with it.

function findUserWithPromise(userId: number): Promise<User> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const userFound = user.find((user) => user.id === userId);
      if (!userFound) {
        reject(new Error("User not found")); // promise fails
        return;
      }
      resolve(userFound); // promise succeeds
    }, 1000); // wait 1 second to pretend it is slow
  });
}

// How to use a Promise:
//   .then(fn)  -> runs fn if the promise succeeded (resolve)
//   .catch(fn) -> runs fn if the promise failed    (reject)
//
// Here we ask for id 9, which does not exist, so .catch runs
// and prints the error after 1 second.
findUserWithPromise(9)
  .then((response) => {
    console.log(response, "response from promise");
  })
  .catch((error) => {
    console.error(error);
  });

// Why this is better than callbacks:
// You can chain steps in a straight line:
//   findUserWithPromise(1).then(step2).then(step3).catch(handleError)
// One .catch at the end handles an error from ANY step above it.

// ------------------------------------------------------------
// 3. ASYNC / AWAIT
// ------------------------------------------------------------
// async/await is "syntactic sugar" over promises.
// That means: it is NOT a new feature. It is the same Promise,
// just written so it reads like normal top-to-bottom code.
//
// Two rules:
//   - "async" before a function -> that function returns a Promise,
//     and you are allowed to use "await" inside it.
//   - "await" before a Promise  -> pause THIS function until the
//     promise finishes, then give me the result.
//     (Only this function pauses. The rest of the program keeps going.)
//
// Errors: a rejected promise becomes a normal thrown error, so we
// catch it with try / catch, like in any other code.
//   - try   : the code that might fail
//   - catch : what to do if it fails

async function findUserWithAsyncAwait(userId: number) {
  try {
    // Waits ~1 second here, then userFound holds the User.
    const userFound = await findUserWithPromise(userId);
    console.log(userFound, "response from async await");
  } catch (error) {
    // If the promise was rejected, we land here.
    console.error(error);
  }
}

// id 1001 does not exist, so this prints the error from catch.
// Try id 1 to see the success path instead.
findUserWithAsyncAwait(1001);

// ------------------------------------------------------------
// SUMMARY
// ------------------------------------------------------------
//  Callback    : pass a function in. Simple, but nests badly.
//  Promise     : function returns an object. Use .then / .catch.
//  async/await : same as Promise, but reads like normal code.
//                Use this one in most new code.
//
// Common mistake: forgetting "await". Then you get the Promise
// object itself (it prints as "Promise { <pending> }") instead
// of the real answer.
