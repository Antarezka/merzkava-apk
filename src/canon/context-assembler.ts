import type { Character } from "../characters/character-repository";
import type { CanonDocument } from "./canon-loader";
import type { CanonRouteResult } from "./canon-router";

export interface GameplayContext {
  snapshot: string;
  version: string;
  character: Character | null;
  activity: string;
  documents: CanonDocument[];
  prompt: string;
  omittedModules: string[];
}

/**
 * Assemble a deterministic, read-only context packet.
 * This does not resolve actions, mutate character state, or call an AI provider.
 */
export function assembleGameplayContext(
  route: CanonRouteResult,
  character: Character | null,
  snapshot: string,
  version: string,
  maxCharacters = 48000
): GameplayContext {
  const sections: string[] = [
    "# MERZKAVA GAMEPLAY CONTEXT",
    "",
    `Canon snapshot: ${snapshot || "UNVERIFIED"}`,
    `Canon version: ${version || "UNVERIFIED"}`,
    "Authority: official canon documents below; do not invent missing rules.",
    "Boundary: context only. No action has been validated and no game state may be changed from this packet.",
    "",
    "## Player activity",
    route.query,
    "",
    "## Character state",
    character
      ? [
          `Name: ${character.name}`,
          `Age: ${character.age}`,
          `Origin: ${character.origin}`,
          `Realm: ${character.realm}`,
          `Cultivation level: ${character.cultivationLevel}`,
          `Awakened: ${character.awakened ? "Yes" : "No"}`,
          `Background: ${character.background || "Not recorded"}`
        ].join("\n")
      : "No character selected. Do not assume a player character.",
    "",
    "## Official canon modules"
  ];
  let prompt = sections.join("\n");
  const included: CanonDocument[] = [];
  const omitted: string[] = [];
  for (const document of route.loaded) {
    const section = `\n\n### ${document.path} [${document.commitSha}]\n\n${document.content}`;
    if (prompt.length + section.length > maxCharacters) {
      omitted.push(document.path);
      continue;
    }
    prompt += section;
    included.push(document);
  }
  if (omitted.length) {
    prompt += `\n\n[Context limit reached. Not loaded into this packet: ${omitted.join(", ")}]`;
  }
  return {
    snapshot,
    version,
    character,
    activity: route.query,
    documents: included,
    prompt,
    omittedModules: omitted
  };
}
