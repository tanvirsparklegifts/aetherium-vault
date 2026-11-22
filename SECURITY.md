# Security Notes

Aetherium Vault is an educational browser-side cryptography prototype. It is not an audited password manager, custody product, hardware enclave, zero-knowledge proof system, or production security boundary.

## Current browser cryptography flow

- A fresh 16-byte random salt is generated for each encryption operation.
- PBKDF2 with SHA-256 and 310,000 iterations derives an AES-256-GCM key from the passphrase.
- A fresh 12-byte random IV is generated for each encryption operation.
- The in-memory payload contains the salt, IV, algorithm/version metadata, and ciphertext so the same browser session can derive the key again for decryption.
- AES-GCM authentication detects tampering during decryption.

## Important limitations

- The demo keeps the encrypted payload in page memory only; it does not provide durable encrypted storage or key recovery.
- The passphrase is entered into a browser page. Do not use a production, reused, or personally important password in this demo.
- The UI's ZK proof, hardware guard, bit-flip, integrity, and latency panels are visual simulations. They do not execute or verify a real ZK circuit, access hardware enclaves, detect cosmic-ray faults, or establish a performance guarantee.
- The code has not undergone an independent security audit or penetration test.
- Use a modern browser in a secure context (HTTPS or localhost). Do not deploy this prototype for real secrets or regulated data.

## Reporting an issue

Please do not publish exploitable vulnerabilities or secrets in public issues. Contact the maintainer privately before disclosing a security-sensitive finding.
