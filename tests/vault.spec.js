const { test, expect } = require("@playwright/test");

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("encrypts and decrypts a sample message in the browser", async ({ page }) => {
  await page.locator("#secret-input").fill("portfolio demo message");
  await page.locator("#passkey-input").fill("correct-horse-battery-staple-demo");
  await page.getByRole("button", { name: "ENCRYPT (AES-256-GCM)" }).click();

  await expect(page.locator("#console-log")).toContainText("[SUCCESS] Ciphertext");
  await page.getByRole("button", { name: "DECRYPT DATA" }).click();
  await expect(page.locator("#console-log")).toContainText(
    '[DECRYPTED SUCCESS] Result: "portfolio demo message"'
  );
});

test("rejects a wrong passphrase during authenticated decryption", async ({ page }) => {
  await page.locator("#secret-input").fill("message that must not be recovered with a wrong key");
  await page.locator("#passkey-input").fill("first-demo-passphrase");
  await page.getByRole("button", { name: "ENCRYPT (AES-256-GCM)" }).click();
  await expect(page.locator("#console-log")).toContainText("[SUCCESS] Ciphertext");

  await page.locator("#passkey-input").fill("different-demo-passphrase");
  await page.getByRole("button", { name: "DECRYPT DATA" }).click();
  await expect(page.locator("#console-log")).toContainText(
    "Decryption failed! Invalid key or corrupted payload."
  );
});

test("shows a validation message when encryption inputs are missing", async ({ page }) => {
  await page.locator("#secret-input").fill("");
  await page.locator("#passkey-input").fill("");
  await page.getByRole("button", { name: "ENCRYPT (AES-256-GCM)" }).click();
  await expect(page.locator("#console-log")).toContainText(
    "Input string and passphrase are required."
  );
});

test("labels the initial state as a demo, not a security certification", async ({ page }) => {
  await expect(page.locator("#sys-status")).toHaveText("DEMO READY");
});
