// Aetherium Vault browser cryptography demo.
// Uses the Web Crypto API. This is an educational prototype, not an audited vault.
class AetheriumCryptoEngine {
  generateSalt() { return window.crypto.getRandomValues(new Uint8Array(16)); }
  async deriveKey(passphrase, salt) {
    if (typeof passphrase !== "string" || passphrase.length === 0) throw new TypeError("A non-empty passphrase is required.");
    if (!(salt instanceof Uint8Array) || salt.length !== 16) throw new TypeError("Salt must be a 16-byte Uint8Array.");
    const keyMaterial = await window.crypto.subtle.importKey("raw", new TextEncoder().encode(passphrase), { name: "PBKDF2" }, false, ["deriveKey"]);
    return window.crypto.subtle.deriveKey({ name: "PBKDF2", salt, iterations: 310000, hash: "SHA-256" }, keyMaterial, { name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]);
  }
  async encryptData(plaintext, key, salt) {
    if (typeof plaintext !== "string") throw new TypeError("Plaintext must be a string.");
    if (!(salt instanceof Uint8Array) || salt.length !== 16) throw new TypeError("Salt must be a 16-byte Uint8Array.");
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const ciphertext = await window.crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, new TextEncoder().encode(plaintext));
    return { version: 1, algorithm: "AES-256-GCM", salt: new Uint8Array(salt), iv, ciphertext: new Uint8Array(ciphertext) };
  }
  async decryptData(payload, key) {
    if (!payload || payload.version !== 1 || payload.algorithm !== "AES-256-GCM" ||
        !(payload.salt instanceof Uint8Array) || payload.salt.length !== 16 ||
        !(payload.iv instanceof Uint8Array) || payload.iv.length !== 12 ||
        !(payload.ciphertext instanceof Uint8Array)) throw new TypeError("Invalid encrypted payload.");
    const plaintext = await window.crypto.subtle.decrypt({ name: "AES-GCM", iv: payload.iv }, key, payload.ciphertext);
    return new TextDecoder().decode(plaintext);
  }
}
