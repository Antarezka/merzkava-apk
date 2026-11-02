/**
 * Offline-game HP rules.
 *
 * Source: Antarezka/merzkava-universe/core/HP_SYSTEM.md
 * Upstream commit: 2f76a864150528afb0e3d26cb16f9396ce610ff6
 * Upstream blob: efef616efa7ad9c44c81470da6dc52bddc813204
 *
 * Scope is deliberately limited to maximum HP and state consistency.
 * Damage and recovery are not defined by this source module.
 */

export const SPIRIT_REALM_HP = {
  "Spirit Initiate": [150, 200, 250, 300],
  "Spirit Adept": [375, 450, 525, 600],
  "Spirit Elder": [700, 800, 900, 1000],
  "Spirit Monarch": [1150, 1300, 1450, 1600],
  "Spirit King": [1825, 2050, 2275, 2500],
  "Spirit Ancestor": [2800, 3100, 3400, 3700],
  "Spirit Emperor": [4075, 4450, 4825, 5200],
  "Spirit Sovereign": [5650, 6100, 6550, 7000],
  "Spirit Primordial": [7488, 7975, 8463, 8950]
} as const;

export type SpiritRealmName = keyof typeof SPIRIT_REALM_HP;
export type HpStage = 0 | 1 | 2 | 3 | 4;
export type HpSessionMode = "NEW_SESSION" | "CONTINUING_SESSION";
export type HpStateStatus = "ALIVE" | "DEAD" | "UNRESOLVED";

export interface HpState {
  current: number;
  maximum: number;
  status: HpStateStatus;
  currentValueKnown: boolean;
}

export type HpResolution =
  | { valid: true; state: HpState }
  | { valid: false; error: "INVALID_REALM_STAGE" | "INVALID_CURRENT_HP" | "CURRENT_HP_EXCEEDS_MAXIMUM" };

export function getMaximumHp(realm: string, stage: number): number | null {
  if (realm === "Mortal") return stage === 0 ? 100 : null;
  if (!Number.isInteger(stage) || stage < 1 || stage > 4) return null;
  if (!Object.prototype.hasOwnProperty.call(SPIRIT_REALM_HP, realm)) return null;
  return SPIRIT_REALM_HP[realm as SpiritRealmName][stage - 1] ?? null;
}

/**
 * New-session bootstrap: missing current HP starts at the applicable maximum.
 * Continuing-session bootstrap: missing current HP is represented as numeric
 * zero but remains UNRESOLVED, not a confirmed death.
 */
export function initializeHpState(
  realm: string,
  stage: number,
  currentHp: number | null | undefined,
  mode: HpSessionMode
): HpResolution {
  const maximum = getMaximumHp(realm, stage);
  if (maximum === null) {
    if (currentHp !== null && currentHp !== undefined) return { valid: false, error: "INVALID_REALM_STAGE" };
    return {
      valid: true,
      state: { current: 0, maximum: 0, status: "UNRESOLVED", currentValueKnown: false }
    };
  }

  const currentValueKnown = currentHp !== null && currentHp !== undefined;
  const current = currentValueKnown
    ? currentHp
    : mode === "NEW_SESSION" ? maximum : 0;

  if (!Number.isInteger(current) || current < 0) {
    return { valid: false, error: "INVALID_CURRENT_HP" };
  }
  if (current > maximum) {
    return { valid: false, error: "CURRENT_HP_EXCEEDS_MAXIMUM" };
  }

  return {
    valid: true,
    state: {
      current,
      maximum,
      status: currentValueKnown ? (current === 0 ? "DEAD" : "ALIVE") : mode === "NEW_SESSION" ? "ALIVE" : "UNRESOLVED",
      currentValueKnown: currentValueKnown || mode === "NEW_SESSION"
    }
  };
}

/**
 * Updates the maximum after a realm/stage change without healing the character.
 * A current HP value above the new maximum is a conflict, never silently clamped.
 */
export function updateHpMaximum(
  previous: HpState,
  nextRealm: string,
  nextStage: number
): HpResolution {
  const maximum = getMaximumHp(nextRealm, nextStage);
  if (maximum === null) {
    return { valid: true, state: { current: 0, maximum: 0, status: "UNRESOLVED", currentValueKnown: false } };
  }
  if (!Number.isInteger(previous.current) || previous.current < 0) {
    return { valid: false, error: "INVALID_CURRENT_HP" };
  }
  if (previous.current > maximum) {
    return { valid: false, error: "CURRENT_HP_EXCEEDS_MAXIMUM" };
  }
  return {
    valid: true,
    state: {
      current: previous.current,
      maximum,
      status: previous.currentValueKnown
        ? previous.current === 0 ? "DEAD" : "ALIVE"
        : "UNRESOLVED",
      currentValueKnown: previous.currentValueKnown
    }
  };
}
