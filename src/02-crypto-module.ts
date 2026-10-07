import crypto from "crypto";

/*
 * `crypto` is a built-in Node.js module.
 *
 * It provides cryptographic functionality such as:
 * - generating secure random values
 * - generating UUIDs
 * - hashing data
 * - encryption/decryption
 * - creating digital signatures
 *
 * You don't need to install it with npm.
 */


/* =========================================================
   1. crypto.randomUUID()
   ========================================================= */

/*
 * Generates a random UUID (Universally Unique Identifier).
 *
 * Example:
 *   550e8400-e29b-41d4-a716-446655440000
 *
 * A UUID is useful when we need a unique identifier for
 * something in our application.
 *
 * Common examples:
 * - user ID
 * - order ID
 * - transaction ID
 * - request ID
 * - session ID
 *
 * IMPORTANT:
 * UUIDs are primarily for IDENTIFICATION, not for storing
 * secret/sensitive information.
 */

const randomUUID = crypto.randomUUID();

console.log(`Random UUID: ${randomUUID}`);


/* =========================================================
   2. crypto.randomBytes()
   ========================================================= */

/*
 * Generates cryptographically secure random bytes.
 *
 * `32` means:
 *     Generate 32 bytes of random data.
 *
 * 1 byte = 8 bits
 * 32 bytes = 256 bits of randomness
 *
 * `.toString("hex")` converts those bytes into a readable
 * hexadecimal string.
 *
 * 32 bytes become 64 hexadecimal characters because
 * every byte is represented by 2 hex characters.
 *
 * Example:
 *   8f3a9c... (64 characters)
 *
 * This is useful when we need a SECRET, unpredictable value.
 *
 * Examples:
 * - password reset tokens
 * - email verification tokens
 * - API secrets
 * - session-related secrets
 * - temporary authentication tokens
 *
 * The important difference from randomUUID():
 *
 * randomUUID()
 *     -> "I need a unique identifier"
 *
 * randomBytes()
 *     -> "I need an unpredictable secret value"
 */

const resetToken = crypto.randomBytes(32).toString("hex");

console.log(`Password Reset Token: ${resetToken}`);


/* =========================================================
   3. crypto.createHash()
   ========================================================= */

/*
 * A HASH is a one-way transformation of data.
 *
 * Input:
 *     "Hello, world!"
 *
 * SHA-256
 *     ↓
 *
 * Output:
 *     256-bit hash
 *
 * The same input will ALWAYS produce the same hash.
 *
 * Example:
 *
 *     "Hello"
 *        ↓ SHA-256
 *     185f8db32271fe25...
 *
 * Important properties of a cryptographic hash:
 *
 * 1. Same input → same output
 * 2. Small input change → completely different output
 * 3. You cannot practically reverse the hash to get the
 *    original data
 * 4. SHA-256 always produces 256 bits of output
 */


/*
 * Example: hashing some data
 */

const data = "Hello, world!";

/*
 * Step 1:
 * Create a SHA-256 hash object.
 */

const hash = crypto.createHash("sha256");


/*
 * Step 2:
 * Give the data to the hash.
 *
 * `update()` can also be called multiple times:
 *
 * hash.update("Hello");
 * hash.update(", world!");
 *
 * This would produce the same result as:
 *
 * hash.update("Hello, world!");
 */

hash.update(data);


/*
 * Step 3:
 * Generate the final hash.
 *
 * `digest("hex")` means:
 * "Give me the resulting hash as a hexadecimal string."
 */

const result = hash.digest("hex");

console.log(`SHA-256 Hash of "${data}": ${result}`);


/* =========================================================
   IMPORTANT: HASHING ≠ ENCRYPTION
   ========================================================= */

/*
 * Hashing:
 *
 *     data → hash
 *
 * It is designed to be one-way.
 *
 * Encryption:
 *
 *     data → encrypted data → original data
 *
 * Encryption is reversible when you have the correct key.
 *
 * Therefore, don't think of SHA-256 as "encrypting" data.
 */


/* =========================================================
   IMPORTANT: DON'T USE SHA-256 DIRECTLY FOR PASSWORDS
   ========================================================= */

/*
 * Although you CAN technically do:
 *
 *     crypto.createHash("sha256")
 *
 * for a password, you SHOULD NOT use plain SHA-256
 * to store user passwords.
 *
 * Passwords should use a password-hashing algorithm
 * specifically designed to be slow and resistant to
 * brute-force attacks, such as:
 *
 * - Argon2
 * - bcrypt
 * - scrypt
 *
 * These algorithms also use a salt.
 *
 * Example concept:
 *
 *     password
 *        +
 *      random salt
 *        ↓
 *     password hashing algorithm
 *        ↓
 *     stored password hash
 *
 * When the user logs in, the password is hashed again
 * and compared with the stored result.
 */


/* =========================================================
   EASY WAY TO REMEMBER
   ========================================================= */

/*

randomUUID()
    ↓
"I need an ID."

Example:
    user ID
    order ID


randomBytes()
    ↓
"I need a secret random value."

Example:
    password reset token
    verification token
    API secret


createHash()
    ↓
"I need a fingerprint of some data."

Example:
    file integrity
    data integrity
    checksums
    deterministic fingerprints


So:

UUID       → Unique identifier
randomBytes → Secret random value
Hash       → Fingerprint of data

*/