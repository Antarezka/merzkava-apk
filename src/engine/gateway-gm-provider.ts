import { getValidAccessToken } from "../auth/supabase-auth";
import type { GMProvider } from "./gm-engine";

const gatewayUrl = import.meta.env.VITE_GM_GATEWAY_URL?.replace(/\/+$/, "") ?? "";

export function isGMGatewayConfigured(): boolean { return Boolean(gatewayUrl); }

export class GatewayGMProvider implements GMProvider {
  async generate(prompt: string): Promise<string> {
    if (!gatewayUrl) throw new Error("AI Gateway belum dikonfigurasi. Isi VITE_GM_GATEWAY_URL.");
    const snapshotMatch = prompt.match(/"snapshot":\s*"([a-f0-9]{7,40})"/i);
    const versionMatch = prompt.match(/"version":\s*"([^"]{1,80})"/);
    if (!snapshotMatch || !versionMatch) {
      throw new Error("Prompt tidak memuat hash snapshot dan versi canon.");
    }
    const token = await getValidAccessToken();
    const response = await fetch(gatewayUrl + "/v1/gm", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + token,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        prompt,
        snapshot: snapshotMatch[1],
        version: versionMatch[1]
      })
    });
    const payload = await response.json() as Record<string, unknown>;
    if (!response.ok) {
      throw new Error(typeof payload.error === "string" ? payload.error : "AI Gateway request failed.");
    }
    if (payload.snapshot !== snapshotMatch[1] || payload.version !== versionMatch[1]) {
      throw new Error("AI Gateway mengembalikan snapshot atau versi yang berbeda.");
    }
    if (typeof payload.response !== "string") throw new Error("AI Gateway tidak mengembalikan teks GM.");
    return payload.response;
  }
}
