import { normalizeCopper, type Wallet } from "./economy-wallet";

export const TIER_MULTIPLIER = [1, 1.3, 1.7, 2.2, 2.9, 3.8, 5, 6.6, 8.5] as const;
const CONDITION = { damaged: 0.7, worn: 0.85, ordinary: 1, preserved: 1.1 } as const;
const DEMAND = { weak: 0.8, ordinary: 1, high: 1.2, veryHigh: 1.5, exceptional: 2 } as const;
const SUPPLY = { normal: 1, mild: 1.4, moderate: 1.8, severe: 2.4 } as const;
const DISASTER = { minor: [1.1, 1.25], moderate: [1.3, 1.6], major: [1.7, 2.2], catastrophic: [2.3, 3] } as const;

export type DisasterImpact = keyof typeof DISASTER;
export function disasterMultiplierAllowed(level: DisasterImpact, value: number): boolean {
  const [min, max] = DISASTER[level];
  return Number.isFinite(value) && value >= min && value <= max;
}
export type PriceInput = {
  tier: number; baseCopper: number;
  condition: keyof typeof CONDITION;
  supply: keyof typeof SUPPLY | "extreme" | "custom";
  effectiveScarcity: number; scarcityEvidence?: string;
  demand: keyof typeof DEMAND; demandEvidence?: string;
  distributionCopper: number; localMarketCopper: number;
};
export type PriceResult = {
  tierMultiplier: number; conditionMultiplier: number; scarcityMultiplier: number;
  demandMultiplier: number; subtotalCopper: number; distributionCopper: number;
  localMarketCopper: number; rawCopper: number; finalCopper: number;
  walletEquivalent: Wallet;
};
export type PriceError = "INVALID_TIER" | "INVALID_BASE" | "INVALID_CONDITION" |
  "INVALID_SUPPLY" | "INVALID_SCARCITY" | "SCARCITY_EVIDENCE_REQUIRED" |
  "INVALID_DEMAND" | "DEMAND_EVIDENCE_REQUIRED" | "INVALID_ADJUSTMENT" |
  "NEGATIVE_PRICE" | "OVERFLOW";

export function calculateItemPrice(input: PriceInput):
  { valid: true; result: PriceResult } | { valid: false; error: PriceError } {
  if (!Number.isInteger(input.tier) || input.tier < 1 || input.tier > 9) return { valid: false, error: "INVALID_TIER" };
  if (!Number.isFinite(input.baseCopper) || input.baseCopper < 0) return { valid: false, error: "INVALID_BASE" };
  if (!(input.condition in CONDITION)) return { valid: false, error: "INVALID_CONDITION" };
  if (!(input.supply in { ...SUPPLY, extreme: 1, custom: 1 })) return { valid: false, error: "INVALID_SUPPLY" };
  if (!Number.isFinite(input.effectiveScarcity) || input.effectiveScarcity <= 0) return { valid: false, error: "INVALID_SCARCITY" };
  if (input.supply in SUPPLY && input.effectiveScarcity !== SUPPLY[input.supply as keyof typeof SUPPLY]) return { valid: false, error: "INVALID_SCARCITY" };
  if ((input.supply === "extreme" || input.supply === "custom") && !input.scarcityEvidence?.trim()) return { valid: false, error: "SCARCITY_EVIDENCE_REQUIRED" };
  if (!(input.demand in DEMAND)) return { valid: false, error: "INVALID_DEMAND" };
  if (input.demand === "exceptional" && !input.demandEvidence?.trim()) return { valid: false, error: "DEMAND_EVIDENCE_REQUIRED" };
  if (!Number.isFinite(input.distributionCopper) || !Number.isFinite(input.localMarketCopper)) return { valid: false, error: "INVALID_ADJUSTMENT" };
  const tierMultiplier = TIER_MULTIPLIER[input.tier - 1];
  const conditionMultiplier = CONDITION[input.condition];
  const demandMultiplier = DEMAND[input.demand];
  const subtotalCopper = input.baseCopper * tierMultiplier * conditionMultiplier * input.effectiveScarcity * demandMultiplier;
  const rawCopper = subtotalCopper + input.distributionCopper + input.localMarketCopper;
  if (!Number.isFinite(rawCopper) || rawCopper > Number.MAX_SAFE_INTEGER) return { valid: false, error: "OVERFLOW" };
  if (rawCopper < 0) return { valid: false, error: "NEGATIVE_PRICE" };
  const finalCopper = Math.floor(rawCopper + 0.5);
  const walletEquivalent = normalizeCopper(finalCopper);
  if (!walletEquivalent) return { valid: false, error: "OVERFLOW" };
  return { valid: true, result: { tierMultiplier, conditionMultiplier, scarcityMultiplier: input.effectiveScarcity, demandMultiplier, subtotalCopper, distributionCopper: input.distributionCopper, localMarketCopper: input.localMarketCopper, rawCopper, finalCopper, walletEquivalent } };
}
