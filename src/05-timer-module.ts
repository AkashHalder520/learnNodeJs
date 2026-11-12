/* =========================================================
   WHAT ARE TIMERS?
   =========================================================
   - Timers let you run a function LATER, instead of right now.
   - They are built into Node.js. You do NOT need to import them
     (like `console.log`, they are "global" functions).
   - Everyday example: setting an alarm on your phone. You do not
     stand and wait. You do other things, and the alarm rings later.

   WHY DO WE NEED THEM?
   Node.js runs your code one line at a time. If you want
   "do this after 2 seconds" you must NOT freeze the program while
   waiting. Timers say: "Node, remember this job, come back to it
   later, and keep running the rest of my code meanwhile."
   Without timers you could only run everything immediately.

   What we cover in this file:
   1. setTimeout   -> run something ONCE, after a delay
   2. setInterval  -> run something AGAIN and AGAIN
   3. clearTimeout / clearInterval -> cancel a timer
   4. setImmediate -> run something "as soon as possible, but later"
   5. The order things run in (very important to understand)
   ========================================================= */


/* =========================================================
   1. setTimeout: run once after a delay
   ========================================================= */

/*
 * setTimeout(function, delayInMilliseconds)
 * 1000 milliseconds = 1 second.
 *
 * The line AFTER setTimeout does not wait. It runs right away.
 * That is why we say timers are "non-blocking".
 */
console.log("=== 1. setTimeout ===");

setTimeout(() => {
  console.log("1. This message is shown after 1 second");
}, 1000);

console.log("1. This message is shown immediately (it does not wait)");
// Output order:
//   1. This message is shown immediately (it does not wait)
//   1. This message is shown after 1 second


/* =========================================================
   2. setInterval + clearInterval: repeat, then stop
   ========================================================= */

/*
 * setInterval(function, delayInMilliseconds) runs the function
 * every `delay` milliseconds, FOREVER, until you stop it.
 *
 * Both setTimeout and setInterval give you back a "timer object".
 * Keep it in a variable. You need it to cancel the timer later.
 *
 * If you forget to cancel an interval, your program never ends.
 * Here we count to 3 and then stop it.
 */
let count = 0;

const intervalTimer = setInterval(() => {
  count++;
  console.log(`2. Interval tick number ${count}`);

  if (count === 3) {
    clearInterval(intervalTimer); // stop the repeating
    console.log("2. Interval stopped");
  }
}, 500);
// Output (every half second): tick 1, tick 2, tick 3, Interval stopped


/* =========================================================
   3. clearTimeout: cancel a timer before it runs
   ========================================================= */

/*
 * Real-life use: a user clicks "Save", you wait 5 seconds, but the
 * user clicks "Cancel" before that. You cancel the timer.
 */
const cancelledTimer = setTimeout(() => {
  console.log("3. You will NEVER see this message");
}, 3000);

clearTimeout(cancelledTimer); // cancelled, so it never runs


/* =========================================================
   4. setImmediate: "right after the current work"
   ========================================================= */

/*
 * setImmediate(function) runs the function as soon as Node has
 * finished what it is doing right now. It is like setTimeout with
 * a delay of 0, but it is designed for this job.
 */
setImmediate(() => {
  console.log("4. setImmediate ran");
});

setTimeout(() => {
  console.log("4. setTimeout with 0 ms ran");
}, 0);


/* =========================================================
   5. The order things run in
   ========================================================= */

/*
 * Even with a delay of 0, a timer NEVER runs in the middle of your
 * current code. Node first finishes ALL the normal lines, and only
 * then looks at the waiting timers.
 *
 * Order of everything above:
 *   1) All normal lines (the console.log lines run first).
 *   2) process.nextTick (below) runs first of the "later" jobs.
 *   3) Then timers / setImmediate.
 *
 * Note: between "setTimeout 0" and "setImmediate", the order can
 * change from run to run when both are called from the main file.
 * Do not depend on it.
 *
 * process.nextTick(function) is a special one: it runs before every
 * other "later" job. Use it rarely. It is shown here only so you
 * know it exists.
 */
process.nextTick(() => {
  console.log("5. process.nextTick ran (first of the later jobs)");
});

console.log("5. Normal line (runs before every timer)");
