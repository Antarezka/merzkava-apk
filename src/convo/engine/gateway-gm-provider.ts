import { getValidAccessToken } from "../auth/supabase-auth";
import type { GMProvider } from "./gm-engine";

const gatewayUrl = import.meta.env.VITE_GM_GATEWAY_URL?.replace(/\/+$/, "") ?? "";

export function isGMGatewayConfigured(): boolean { return Boolean(gatewayUrl); }

export class GatewayGMProvider implements GMProvider {
  async generate(prompt: string, metadata: { snapshot: string; version: string }): Promise<string> {
    if (!gatewayUrl) throw new Error("AI Gateway belum dikonfigurasi. Isi VITE_GM_GATEWAY_URL.");
    const token = await getValidAccessToken();
    const response = await fetch(gatewayUrl + "/v1/gm", {
      method: "POST",
      headers: { "Authorization": "Bearer " + token, "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, snapshot: metadata.snapshot, version: metadata.version })
    });
    const payload = await response.json() as Record<string, unknown>;
    if (!response.ok) throw new Error(typeof payload.error === "string" ? payload.error : "AI Gateway request failed.");
    if (payload.snapshot !== metadata.snapshot || payload.version !== metadata.version) {
      throw new Error("AI Gateway mengembalikan snapshot atau versi yang berbeda.");
    }
    if (typeof payload.response !== "string") throw new Error("AI Gateway tidak mengembalikan teks GM.");
    return payload.response;
  }
}
