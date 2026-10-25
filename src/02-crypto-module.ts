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

UUID        → Unique identifier
randomBytes → Secret random value
Hash        → Fingerprint of data
HMAC        → Authenticated fingerprint (data + secret key)

*/

/* =========================================================
   4. crypto.createHmac()
   ========================================================= */

/*
 * HMAC stands for:
 * Hash-based Message Authentication Code
 *
 * An HMAC is like a hash, but combined with a SECRET KEY.
 *
 * Difference:
 *
 * Regular Hash:
 *     data  →  hash
 *     (Anyone who has the data can compute the exact same hash)
 *
 * HMAC:
 *     data + secret key  →  HMAC signature
 *     (Only someone who knows the secret key can compute
 *      or verify this signature)
 *
 * Why is HMAC used?
 * 1. Data Integrity: Proves the data has NOT been modified or tampered with.
 * 2. Authenticity: Proves the message actually came from someone who holds the secret key.
 *
 * Common real-world examples:
 * - Webhook signatures (e.g., Stripe, GitHub, Razorpay, Shopify)
 * - API request signing (e.g., AWS Signature v4)
 * - JWT (JSON Web Tokens) with HMAC-SHA256 (HS256)
 * - Tamper-proof URLs and signed cookies
 */

/* ---------------------------------------------------------
   Example A: Generating an HMAC signature
   --------------------------------------------------------- */

const secretKey = "super-secret-api-key";
const payload = JSON.stringify({
  orderId: "ord_99812",
  amount: 49.99,
  currency: "USD",
  status: "paid",
});

// Step 1: Create an HMAC instance using an algorithm and your secret key
const hmac = crypto.createHmac("sha256", secretKey);

// Step 2: Feed the payload into the HMAC
hmac.update(payload);

// Step 3: Get the resulting signature as a hexadecimal string
const signature = hmac.digest("hex");

console.log("HMAC Signature:", signature);

/* ---------------------------------------------------------
   Example B: Real-world Webhook Verification
   --------------------------------------------------------- */

/*
 * Imagine your server receives an incoming webhook from a payment
 * provider (like Stripe or GitHub).
 *
 * The provider sends:
 * 1. The raw payload in the request body
 * 2. A signature in the request headers (e.g. 'x-signature')
 *
 * To verify the webhook is legitimate and untampered:
 * You recompute the HMAC using your shared secret and compare it.
 *
 * NOTE: Always use `crypto.timingSafeEqual()` instead of `===`
 * when comparing signatures to prevent timing attacks!
 */

function verifyWebhookSignature(
  rawBody: string,
  receivedSignature: string,
  secret: string,
): boolean {
  // Compute expected signature
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");

  // Convert hex strings to raw byte Buffers:
  // 1. `crypto.timingSafeEqual()` only accepts Buffers/TypedArrays, not plain strings.
  // 2. Comparing with regular `===` exits early on the first wrong character,
  //    leaking timing clues that attackers can exploit (timing attack).
  const expectedBuffer = Buffer.from(expectedSignature, "utf8");
  const receivedBuffer = Buffer.from(receivedSignature, "utf8");

  // `timingSafeEqual` throws a RangeError if byte lengths differ,
  // so check lengths first.
  if (expectedBuffer.length !== receivedBuffer.length) {
    return false;
  }

  // Compare in constant time (checks every byte, no early exit)
  return crypto.timingSafeEqual(expectedBuffer, receivedBuffer);
}

// Test webhook verification:
const incomingPayload = payload;
const incomingSignatureHeader = signature;

const isValid = verifyWebhookSignature(
  incomingPayload,
  incomingSignatureHeader,
  secretKey,
);

console.log("Is Webhook Signature Valid?", isValid); // true

// Test with tampered payload:
const tamperedPayload = JSON.stringify({
  orderId: "ord_99812",
  amount: 0.99, // tampered amount!
  currency: "USD",
  status: "paid",
});

const isTamperedValid = verifyWebhookSignature(
  tamperedPayload,
  incomingSignatureHeader,
  secretKey,
);

console.log("Is Tampered Payload Valid?", isTamperedValid); // false
