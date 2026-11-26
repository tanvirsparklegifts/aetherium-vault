# Security notes and threat model

Aetherium Vault is an educational browser-side cryptography prototype. It is not an audited password manager, custody product, hardware enclave, zero-knowledge proof system, or production security boundary.

## Implemented cryptography

- A fresh 16-byte cryptographically random salt is generated for every encryption operation.
- PBKDF2-HMAC-SHA-256 with 310,000 iterations derives a non-extractable 256-bit AES-GCM key.
- A fresh 12-byte random IV is generated for every AES-GCM encryption operation.
- The payload contains version, algorithm, salt, IV, and ciphertext.
- AES-GCM authentication rejects a wrong key or modified ciphertext.
- The demo payload is held in page memory only.

## Threat model

**In scope:** accidental ciphertext modification and attempts to decrypt a payload with an incorrect passphrase/key. AES-GCM authentication detects ciphertext or authentication-tag modification. Fresh random salts make independently encrypted payloads derive distinct keys from the same passphrase; fresh IVs avoid nonce reuse under a given key, assuming the browser CSPRNG behaves correctly.

**Out of scope:** a compromised browser/device, malicious extensions, XSS or compromised hosting, keylogging, memory inspection, weak or guessed passphrases, phishing, denial of service, traffic analysis, and recovery after page reload. This demo does not protect against an attacker who can read the passphrase or plaintext while the page is in use.

## Important limitations

- The encrypted payload is not persisted and cannot be recovered after the page session ends.
- The passphrase is entered into a browser page. Do not use a production, reused, or personally important password.
- The UI's ZK proof, hardware guard, bit-flip, integrity, and latency panels are visual simulations. They do not execute or verify a real ZK circuit, access hardware enclaves, detect physical faults, or establish a performance guarantee.
- No independent security audit or penetration test has been performed.
- Use a modern browser in a secure context (HTTPS or localhost). Do not deploy this prototype for real secrets or regulated data.

## Reporting an issue

Please do not publish exploitable vulnerabilities or secrets in public issues. Contact the maintainer privately before disclosing a security-sensitive finding.
