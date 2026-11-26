# Aetherium Vault

**Browser Cryptography Prototype — PBKDF2 + AES-256-GCM**

[![Browser tests](https://github.com/tanvirsparklegifts/aetherium-vault/actions/workflows/ci.yml/badge.svg)](https://github.com/tanvirsparklegifts/aetherium-vault/actions/workflows/ci.yml)

Aetherium Vault is an educational browser-side cryptography prototype with a cyberpunk dashboard. It demonstrates passphrase-based key derivation and authenticated encryption using the browser Web Crypto API.

[Open the live demo](https://tanvirsparklegifts.github.io/aetherium-vault/)

## Implemented cryptography

- PBKDF2 with SHA-256 derives a non-extractable 256-bit AES-GCM key from a passphrase.
- Each encryption operation uses a fresh 16-byte cryptographically random salt.
- Each encryption operation uses a fresh 12-byte cryptographically random AES-GCM IV.
- AES-GCM authenticated decryption rejects an incorrect key or modified ciphertext.
- The current encrypted payload is held in page memory for the demo session.

## Browser test suite

Playwright tests cover:
- Successful encryption and decryption of a sample message.
- Rejection of a wrong passphrase.
- Required-input validation.
- Accurate demo-status labeling.

Run locally:

```bash
npm install
npx playwright install chromium
npm run test:browser
```

The test runner starts a local HTTP server on port 4173. The browser Web Crypto API is available on localhost.

## Security scope and limitations

This is not an audited password manager, hardware enclave, zero-knowledge proof implementation, custody product, or production security boundary.

- The encrypted payload is held in page memory only; there is no durable encrypted storage or key recovery.
- The passphrase is entered into a browser page. Do not use a production, reused, or personally important password.
- ZK proof, hardware guard, bit-flip, integrity, and latency panels are UI simulations only. They do not execute a real ZK circuit, access hardware enclaves, detect physical faults, or establish performance guarantees.
- The project has not undergone an independent security audit or penetration test.
- Use a modern browser in a secure context (HTTPS or localhost).

See [SECURITY.md](SECURITY.md) for implementation details, limitations, and responsible disclosure guidance.

## Development

The core browser cryptography implementation is in `crypto.js`; the demo page is `index.html`. Changes to cryptographic behavior should include reproducible tests.

## License

See [LICENSE](LICENSE).
