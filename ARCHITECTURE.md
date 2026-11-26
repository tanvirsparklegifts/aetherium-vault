# Aetherium Vault — implemented architecture

Aetherium Vault is a browser-side cryptography learning prototype. The implementation consists of:

1. UI layer (index.html): collects demo plaintext and a passphrase, then displays status messages.
2. Key derivation (crypto.js): derives a non-extractable 256-bit AES key with PBKDF2-HMAC-SHA-256 (310,000 iterations) and a fresh 16-byte random salt for each encryption.
3. Authenticated encryption (crypto.js): encrypts UTF-8 plaintext with AES-256-GCM and a fresh 12-byte random IV for each encryption.
4. Session payload: keeps version, algorithm, salt, IV, and ciphertext in page memory so the key can be derived again for decryption.

```text
Passphrase + fresh random salt
          |
          v
PBKDF2-HMAC-SHA-256 (310,000 iterations)
          |
          v
Non-extractable AES-256-GCM key
          |
Plaintext + fresh 96-bit IV
          |
          v
Authenticated ciphertext + {version, algorithm, salt, IV}
          |
          v
In-memory demo payload (not durable storage)
```

## Verification

- Node's built-in test runner exercises encryption/decryption, wrong-passphrase rejection, malformed input, and ciphertext tampering.
- Playwright exercises the browser UI flow on localhost.
- GitHub Actions runs the browser and crypto test workflows.

## Explicit non-goals and limitations

- No zero-knowledge circuit or proof verification is implemented.
- No hardware enclave, secure element, trusted execution environment, or physical fault detection is implemented.
- No persistent encrypted storage, backup, key recovery, account system, or server-side vault exists.
- The UI's ZK, hardware, integrity, bit-flip, and latency panels are simulations only.
- This is not an audited password manager, custody system, or production security boundary.
