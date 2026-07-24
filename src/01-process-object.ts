// this is responsible for processing the object and returning the result
// like env variables, command line arguments, etc.
// exit function is used to terminate the process with a specific exit code
// process object is a global object in Node.js that provides information about the current Node.js process
// it can be used to access environment variables, command line arguments, and other process-related information
//process lifecycle events are events that are emitted by the process object during the lifecycle of a Node.js application examples
 
//read backend port from env variable and if not found then use default port 3000

// read secret key from env variable and if not found then use default secret key

import process from "process";

// process.env  is an object that contains the user environment variables


const nodeEnv = process.env.NODE_ENV || "development";

//process.env values are always strings, so we need to convert them to the appropriate type if needed

// Like for example if we have port number in env variable then we need to convert it to number type

const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;


//process.argv is an array that contains the command line arguments passed to the Node.js process it is a global object 
//like for example if we run the command `node app.js --port=3000` then process.argv will be ['node', 'app.js', '--port=3000']

// The returned array always follows a strict structure, where the first two elements are automatically populated by the system:
// process.argv[0]: The absolute file path of the Node.js executable running the script. 
// process.argv[1]: The absolute file path of the JavaScript file currently being executed.
// process.argv[2] and beyond: Custom strings or arguments provided manually by the

const command = process.argv[2] || "start"; // default command is start
console.log(process.argv);

// we can use this as flag like crash flag or fail flag to simulate a crash or failure in the application for testing purposes

const shouldCrash = process.argv.includes("--crash") || false;
const shouldFail = process.argv.includes("-fail") || false;

process.on("exit", (code) => {
  console.log(`Process exited with code: ${code}`);
});// this code  is helpful for final log or final cleanup before the process exits

function runApp() {
    console.log(`Running in ${nodeEnv} mode on port ${port}`);
    console.log(`Command: ${command}`);
    if (shouldCrash) {
        console.log("Simulating a crash...");
        process.exit(1); // exit with error code 1
    }
    if (shouldFail) {
        console.log("Simulating a failure...");
        process.exit(2); // exit with error code 2
    }
}
runApp();

//npm run 01 --fail
//[
//   "run",
//   "01",
//   "--fail"
// ]
//  above one is wrong because we need to separe te the command and the flag with -- like below
//npm run 01 -- --fail
//without the second -- the --fail will be treated as a command and not as a flag

