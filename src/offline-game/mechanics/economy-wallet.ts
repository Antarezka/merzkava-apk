/**
 * Canon wallet arithmetic.
 * Source: core/10_ECONOMY_SYSTEM.md at Universe pin
 * 2f76a864150528afb0e3d26cb16f9396ce610ff6 (blob 0cc74b40d07ad8b2fe9fd2e4c37cdad1c0269456).
 */
export interface Wallet {
  xc: number;
  xs: number;
  xg: number;
  zj: number;
  az: number;
}

export type WalletResult =
  | { valid: true; totalCopper: number; wallet: Wallet }
  | { valid: false; error: "INVALID_WALLET_AMOUNT" | "WALLET_OVERFLOW" };

export function normalizeCopper(totalCopper: number): Wallet | null {
  if (!Number.isSafeInteger(totalCopper) || totalCopper < 0) return null;
  let n = BigInt(totalCopper);
  const az = n / 100_000_000n; n %= 100_000_000n;
  const zj = n / 10_000_000n; n %= 10_000_000n;
  const xg = n / 10_000n; n %= 10_000n;
  const xs = n / 100n;
  const xc = n % 100n;
  return { az: Number(az), zj: Number(zj), xg: Number(xg), xs: Number(xs), xc: Number(xc) };
}

export function walletToCopper(wallet: Wallet): WalletResult {
  const values = [wallet.xc, wallet.xs, wallet.xg, wallet.zj, wallet.az];
  if (values.some(x => !Number.isSafeInteger(x) || x < 0)) {
    return { valid: false, error: "INVALID_WALLET_AMOUNT" };
  }
  const total = BigInt(wallet.xc) + BigInt(wallet.xs) * 100n +
    BigInt(wallet.xg) * 10_000n + BigInt(wallet.zj) * 10_000_000n +
    BigInt(wallet.az) * 100_000_000n;
  if (total > BigInt(Number.MAX_SAFE_INTEGER)) {
    return { valid: false, error: "WALLET_OVERFLOW" };
  }
  return {
    valid: true,
    totalCopper: Number(total),
    wallet: normalizeCopper(Number(total))!
  };
}
