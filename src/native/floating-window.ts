import { Capacitor, registerPlugin } from "@capacitor/core";

export interface FloatingReadiness {
  displayOverApps: boolean;
  notifications: boolean;
  batteryExemption: boolean;
  serviceRunning: boolean;
}

export interface FloatingWindowPlugin {
  getReadiness(): Promise<FloatingReadiness>;
  requestNotifications(): Promise<void>;
  requestBatteryExemption(): Promise<void>;
  startService(): Promise<void>;
  showBubble(): Promise<void>;
  stop(): Promise<void>;
  checkPermission(): Promise<{ granted: boolean }>;
  requestPermission(): Promise<void>;
  show(): Promise<void>;
  restore(): Promise<void>;
  exitApp(): Promise<void>;
}

const FloatingWindow = registerPlugin<FloatingWindowPlugin>("FloatingWindow");

export async function requestFloatingOverlayPermission(): Promise<void> {
  if (!Capacitor.isNativePlatform()) throw new Error("Floating Mode hanya tersedia di APK Android.");
  const permission = await FloatingWindow.checkPermission();
  if (!permission.granted) await FloatingWindow.requestPermission();
}

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

export async function getFloatingReadiness(): Promise<FloatingReadiness> {
  if (!Capacitor.isNativePlatform()) {
    return { displayOverApps: false, notifications: false, batteryExemption: false, serviceRunning: false };
  }
  return FloatingWindow.getReadiness();
}

export async function requestFloatingNotifications(): Promise<void> {
  if (!Capacitor.isNativePlatform()) throw new Error("Izin notifikasi hanya tersedia di APK Android.");
  await FloatingWindow.requestNotifications();
}

export async function requestFloatingBatteryExemption(): Promise<void> {
  if (!Capacitor.isNativePlatform()) throw new Error("Pengaturan baterai hanya tersedia di APK Android.");
  await FloatingWindow.requestBatteryExemption();
}

export async function startFloatingService(): Promise<void> {
  if (!Capacitor.isNativePlatform()) throw new Error("Service floating hanya tersedia di APK Android.");
  await FloatingWindow.startService();
}

export async function showFloatingBubble(): Promise<void> {
  if (!Capacitor.isNativePlatform()) throw new Error("Bubble hanya tersedia di APK Android.");
  await FloatingWindow.showBubble();
}

export async function stopFloatingService(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;
  await FloatingWindow.stop();
}

export async function restoreFullMode(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;
  await FloatingWindow.restore();
}

export async function exitMerzkavaApplication(): Promise<void> {
  if (Capacitor.isNativePlatform()) {
    await FloatingWindow.exitApp();
    return;
  }
  try { window.close(); } catch { /* Web browsers may deny script-initiated close. */ }
}
