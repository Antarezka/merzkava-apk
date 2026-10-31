import { Capacitor, registerPlugin } from "@capacitor/core";

export interface FloatingWindowPlugin {
  checkPermission(): Promise<{ granted: boolean }>;
  requestPermission(): Promise<void>;
  show(): Promise<void>;
  restore(): Promise<void>;
}

const FloatingWindow = registerPlugin<FloatingWindowPlugin>("FloatingWindow");

export async function startFloatingMode(): Promise<void> {
  if (!Capacitor.isNativePlatform()) {
    throw new Error("Floating Mode lintas aplikasi hanya tersedia di APK Android.");
  }
  const permission = await FloatingWindow.checkPermission();
  if (!permission.granted) {
    await FloatingWindow.requestPermission();
    throw new Error("Izinkan Merzkava tampil di atas aplikasi lain, lalu tekan Start Floating Mode sekali lagi.");
  }
  await FloatingWindow.show();
}

export async function restoreFullMode(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;
  await FloatingWindow.restore();
}
