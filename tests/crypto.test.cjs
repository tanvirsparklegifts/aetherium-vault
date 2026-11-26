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
  assert.equal(payload.version, 1);
  assert.equal(payload.algorithm, "AES-256-GCM");
  assert.equal(payload.salt.length, 16);
  assert.equal(payload.iv.length, 12);
  assert.equal(await engine.decryptData(payload, key), "vault test payload");
});

test("generates independent random salts and IVs for separate encryptions", async () => {
  const engine = new AetheriumCryptoEngine();
  const saltA = engine.generateSalt(), saltB = engine.generateSalt();
  const keyA = await engine.deriveKey("same-passphrase", saltA);
  const keyB = await engine.deriveKey("same-passphrase", saltB);
  const payloadA = await engine.encryptData("same message", keyA, saltA);
  const payloadB = await engine.encryptData("same message", keyB, saltB);
  assert.notDeepEqual(payloadA.salt, payloadB.salt);
  assert.notDeepEqual(payloadA.iv, payloadB.iv);
  assert.notDeepEqual(payloadA.ciphertext, payloadB.ciphertext);
});

test("rejects a wrong passphrase during authenticated decryption", async () => {
  const engine = new AetheriumCryptoEngine(), salt = engine.generateSalt();
  const correctKey = await engine.deriveKey("correct-passphrase", salt);
  const wrongKey = await engine.deriveKey("wrong-passphrase", salt);
  const payload = await engine.encryptData("private text", correctKey, salt);
  await assert.rejects(() => engine.decryptData(payload, wrongKey));
});

test("rejects invalid salt and malformed encrypted payload", async () => {
  const engine = new AetheriumCryptoEngine();
  await assert.rejects(() => engine.deriveKey("passphrase", new Uint8Array(8)), /16-byte/);
  await assert.rejects(() => engine.encryptData("text", {}, new Uint8Array(8)), /16-byte/);
  await assert.rejects(() => engine.encryptData({}, {}, new Uint8Array(16)), /Plaintext/);
  await assert.rejects(() => engine.decryptData({ version: 1 }, {}), /Invalid encrypted payload/);
  await assert.rejects(() => engine.decryptData({ version: 1, algorithm: "AES-256-GCM", salt: new Uint8Array(8), iv: new Uint8Array(12), ciphertext: new Uint8Array(16) }, {}), /Invalid encrypted payload/);
});

test("detects ciphertext tampering", async () => {
  const engine = new AetheriumCryptoEngine(), salt = engine.generateSalt();
  const key = await engine.deriveKey("test-passphrase", salt);
  const payload = await engine.encryptData("tamper-evident", key, salt);
  payload.ciphertext[0] ^= 1;
  await assert.rejects(() => engine.decryptData(payload, key));
});
