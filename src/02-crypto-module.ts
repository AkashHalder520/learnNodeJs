import crypto from "crypto";
//this is built-in module in nodejs, we can use it to generate random bytes, hashes, and other cryptographic operations

//crypto.randomBytes(size, callback) is a method that generates cryptographically strong pseudo-random data. 
//The size argument specifies the number of bytes to generate. The callback is a function that will be called with the generated data or an error if one occurred.
//security related task 
//creating a random UUID, IDs
//createing a secure token for authentication
//creating a hash of a password before storing it in a database

//crypro.randomUUID() is a method that generates a random UUID (Universally Unique Identifier) using the RFC 4122 standard.
//like user id , order id , session id


const randomUUID = crypto.randomUUID();
console.log(`Random UUID: ${randomUUID}`);


//crypto.randomBytes is The main usage of crypto.randomBytes() is to generate unpredictable, unique values for security purposes. Because it is cryptographically secure, attackers cannot guess the outputs, unlike standard math-based random functions.
//like password reset tokens, API keys, session identifiers, and other sensitive data that require a high level of randomness to prevent unauthorized access or attacks.

const resetToken = crypto.randomBytes(32).toString("hex");
console.log(`Password Reset Token: ${resetToken}`);

//crypto.createHash(algorithm) is a method used to create a Hash instance
//Data Integrity Checks: Verifying that a file has not been corrupted or altered during download. You hash the downloaded file and compare it to the provider's official hash checksum.
const data = 'Hello, world!';
// 1. Initialize the hash instance with SHA-256
const hash = crypto.createHash('sha256');
// 2. Pass data into the hash stream
hash.update(data);
// 3. Generate the final output as a hex string
const result = hash.digest('hex');
console.log(`SHA-256 Hash of "${data}": ${result}`);