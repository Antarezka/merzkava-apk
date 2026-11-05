import { beforeEach, describe, expect, it, vi } from "vitest";

const secureStorage = vi.hoisted(() => ({
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn()
}));

vi.mock("@capacitor/core", () => ({
  Capacitor: { isNativePlatform: () => true }
}));
vi.mock("@aparajita/capacitor-secure-storage", () => ({
  SecureStorage: secureStorage
}));

import { restoreDeveloperSession, signOutDeveloper } from "../../src/security/developer-access";

const SESSION_KEY = "merzkava.developer-session.v1";

describe("Developer Lock persistence", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    secureStorage.getItem.mockResolvedValue("authorized");
    secureStorage.setItem.mockResolvedValue(undefined);
    secureStorage.removeItem.mockResolvedValue(undefined);
  });

  it("removes the active authorization marker while preserving credentials", async () => {
    await signOutDeveloper();

    expect(secureStorage.removeItem).toHaveBeenCalledWith(SESSION_KEY);
    expect(secureStorage.removeItem).toHaveBeenCalledTimes(1);
    expect(secureStorage.removeItem).not.toHaveBeenCalledWith("merzkava.developer-credentials.v1");
  });

  it("writes a durable locked marker when secure deletion fails", async () => {
    secureStorage.removeItem.mockRejectedValueOnce(new Error("Keychain delete failed"));
    secureStorage.getItem.mockResolvedValue("locked");

    await signOutDeveloper();

    expect(secureStorage.setItem).toHaveBeenCalledWith(SESSION_KEY, "locked");
    expect(await restoreDeveloperSession()).toBe(false);
  });

  it("reports failure when neither deletion nor locked-marker write is possible", async () => {
    secureStorage.removeItem.mockRejectedValueOnce(new Error("Keychain delete failed"));
    secureStorage.setItem.mockRejectedValueOnce(new Error("Keychain write failed"));

    await expect(signOutDeveloper()).rejects.toThrow("Could not securely lock the Developer session");
  });
});
