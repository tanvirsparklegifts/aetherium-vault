# Aetherium Vault — Project Brief

**Project type:** Browser-side cryptography demonstration  
**Maintainer:** Md Tanvir Ahammed Tonmoy  
**Status:** Educational prototype; not a production security product

## Purpose

Aetherium Vault explores a privacy-conscious browser interface for passphrase-based encryption. The current implementation demonstrates key derivation and authenticated encryption using the browser Web Crypto API.

## Implemented in this repository

- PBKDF2 with SHA-256 derives an AES-256-GCM key from a passphrase.
- A fresh random 16-byte salt and 12-byte IV are generated for each encryption operation.
- The encrypted payload is retained in page memory for the current session's decryption flow.
- The interface contains illustrative panels for zero-knowledge, hardware integrity, and latency concepts. Those panels are simulations, not working cryptographic or hardware modules.

## Research directions (not implemented)

- Formal zero-knowledge proof circuits and independent proof verification.
- Hardware enclave integration and fault-injection resistance.
- Secure persistent encrypted storage and key lifecycle design.
- Benchmarking under a documented threat model and reproducible test conditions.

## Intended audience

This prototype may be useful for learning, UI experimentation, and discussing browser cryptography. It is not suitable for aerospace, medical, financial, custody, or other safety-critical or regulated deployments.

## Security

Do not enter real credentials, reused passwords, or sensitive data. The project has not undergone an independent security audit. See [SECURITY.md](SECURITY.md).

## License

See [LICENSE](LICENSE).
