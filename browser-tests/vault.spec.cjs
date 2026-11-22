const { test, expect } = require("@playwright/test");

test("vault page loads and completes browser encryption/decryption", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "AZK-HG PROTOCOL" })).toBeVisible();
  await page.locator("#secret-input").fill("Playwright vault integration check");
  await page.locator("#passkey-input").fill("browser-test-passphrase-2026");

  await page.getByRole("button", { name: "ENCRYPT (AES-256-GCM)" }).click();
  await expect(page.locator("#console-log")).toContainText("[SUCCESS] Ciphertext");

  await page.getByRole("button", { name: "DECRYPT DATA" }).click();
  await expect(page.locator("#console-log")).toContainText(
    '[DECRYPTED SUCCESS] Result: "Playwright vault integration check"'
  );
});

test("vault rejects decryption before any payload exists", async ({ page }) => {
  await page.goto("/");
  await page.locator("#passkey-input").fill("browser-test-passphrase-2026");
  await page.getByRole("button", { name: "DECRYPT DATA" }).click();

  await expect(page.locator("#console-log")).toContainText(
    "No encrypted payload found. Encrypt first!"
  );
});
