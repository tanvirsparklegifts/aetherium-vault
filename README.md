# Aetherium Vault

**Browser Cryptography Demo — PBKDF2 + AES-256-GCM**

Aetherium Vault is an educational browser-side cryptography prototype with a cyberpunk dashboard. It demonstrates passphrase-based key derivation and authenticated encryption using the browser Web Crypto API.

[Open the live demo](https://tanvirsparklegifts.github.io/aetherium-vault/)

## Current implementation

- PBKDF2 with SHA-256 derives a 256-bit AES-GCM key from a passphrase.
- Each encryption operation generates a fresh 16-byte random salt.
- Each encryption operation generates a fresh 12-byte random AES-GCM IV.
- The encrypted payload is held in page memory and includes the salt, IV, and ciphertext for the current session's decrypt action.
- The UI includes illustrative panels for ZK, hardware-guard, integrity, and latency concepts. These panels are simulations only.

## Run locally

Serve the repository over HTTPS or localhost so the Web Crypto API is available. For example, with Python:

    python -m http.server 8000

Then open http://localhost:8000.

## Security scope

This is not an audited password manager, hardware enclave, zero-knowledge proof implementation, custody product, or production security boundary. Do not enter real secrets, reused passwords, or regulated data. The project has not undergone an independent security audit.

Read [SECURITY.md](SECURITY.md) for the implementation details, limitations, and responsible disclosure guidance.

## Development

The core browser cryptography implementation is in crypto.js. The demo page is index.html. Changes to cryptographic behavior should be reviewed carefully and accompanied by reproducible test evidence.

## License

See [LICENSE](LICENSE).
