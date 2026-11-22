const { test } = require("node:test");
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { runInThisContext } = require("node:vm");
const { webcrypto } = require("node:crypto");

globalThis.window = { crypto: webcrypto };
const source = readFileSync(new URL("../crypto.js", `file://${__filename}`), "utf8");
runInThisContext(source + "\nglobalThis.AetheriumCryptoEngine = AetheriumCryptoEngine;");

test("encrypts and decrypts with the derived AES-GCM key", async () => {
  const engine = new AetheriumCryptoEngine();
  const salt = engine.generateSalt();
  const key = await engine.deriveKey("test-passphrase", salt);
  const payload = await engine.encryptData("vault test payload", key, salt);

  assert.equal(payload.algorithm, "AES-256-GCM");
  assert.equal(payload.salt.length, 16);
  assert.equal(payload.iv.length, 12);
  assert.equal(await engine.decryptData(payload, key), "vault test payload");
});

test("rejects a wrong passphrase during authenticated decryption", async () => {
  const engine = new AetheriumCryptoEngine();
  const salt = engine.generateSalt();
  const correctKey = await engine.deriveKey("correct-passphrase", salt);
  const wrongKey = await engine.deriveKey("wrong-passphrase", salt);
  const payload = await engine.encryptData("private text", correctKey, salt);

  await assert.rejects(() => engine.decryptData(payload, wrongKey));
});

test("rejects invalid salt and malformed encrypted payload", async () => {
  const engine = new AetheriumCryptoEngine();

  assert.throws(() => engine.deriveKey("passphrase", new Uint8Array(8)), /16-byte/);
  assert.throws(() => engine.encryptData("text", {}, new Uint8Array(16)), /encrypt/);
  await assert.rejects(() => engine.decryptData({ version: 1 }, {}), /Invalid encrypted payload/);
});

test("detects ciphertext tampering", async () => {
  const engine = new AetheriumCryptoEngine();
  const salt = engine.generateSalt();
  const key = await engine.deriveKey("test-passphrase", salt);
  const payload = await engine.encryptData("tamper-evident", key, salt);
  payload.ciphertext[0] ^= 1;

  await assert.rejects(() => engine.decryptData(payload, key));
});
