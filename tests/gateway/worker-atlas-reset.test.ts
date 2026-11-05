import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import worker, { type Env } from "../../gateway/worker";

class MemoryKV {
  values = new Map<string,string>();
  async get(key:string):Promise<string|null>{return this.values.get(key)??null;}
  async put(key:string,value:string):Promise<void>{this.values.set(key,value);}
}

function environment(overrides:Partial<Env>={}):Env {
  return {
    SUPABASE_URL:"https://project.supabase.co",
    SUPABASE_ANON_KEY:"public-anon-key",
    AI_API_KEY:"not-used-in-reset-tests",
    AI_MODEL:"test-model",
    AI_BASE_URL:"https://provider.example/v1",
    ALLOWED_ORIGINS:"https://app.example",
    ATLAS_MASTER_RESET_PASSWORD:"test-only-master-reset-secret",
    ATLAS_DEVELOPER_EMAILS:"owner@example.com",
    ATLAS_RESET_KV:new MemoryKV(),
    ATLAS_RESET_LIMITER:{limit:async()=>({success:true})},
    ...overrides
  };
}

function request(path:string,method="GET",body?:unknown,token?:string):Request {
  const headers=new Headers({Origin:"https://app.example"});
  if(body!==undefined)headers.set("Content-Type","application/json");
  if(token)headers.set("Authorization","Bearer "+token);
  return new Request("https://gateway.example"+path,{
    method,headers,body:body===undefined?undefined:JSON.stringify(body)
  });
}

describe("World Atlas server reset authority",()=>{
  beforeEach(()=>{vi.restoreAllMocks();});
  afterEach(()=>{vi.unstubAllGlobals();});

  it("returns revision zero for new and future player accounts",async()=>{
    const env=environment();
    const response=await worker.fetch(request("/v1/atlas/reset-status?player=NewPlayer"),env);
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({resetRevision:"0"});
  });

  it("validates the master credential on the server and rotates the player's revision",async()=>{
    const env=environment();
    const denied=await worker.fetch(request("/v1/atlas/master-reset","POST",{
      playerName:"Nafila",masterPassword:"wrong-secret"
    }),env);
    expect(denied.status).toBe(403);

    const accepted=await worker.fetch(request("/v1/atlas/master-reset","POST",{
      playerName:"Nafila",masterPassword:"test-only-master-reset-secret"
    }),env);
    expect(accepted.status).toBe(200);
    const result=await accepted.json() as {resetRevision:string};
    expect(result.resetRevision).toBeTruthy();
    const status=await worker.fetch(request("/v1/atlas/reset-status?player=nafila"),env);
    expect(await status.json()).toEqual(result);
    expect((env.ATLAS_RESET_KV as MemoryKV).values.size).toBeGreaterThan(1);
  });

  it("requires an allowlisted Supabase identity for Developer reset",async()=>{
    const env=environment();
    vi.stubGlobal("fetch",vi.fn(async()=>new Response(JSON.stringify({
      id:"developer-user",email:"intruder@example.com"
    }),{status:200,headers:{"Content-Type":"application/json"}})));
    const denied=await worker.fetch(request("/v1/atlas/developer-reset","POST",{
      playerName:"Nafila"
    },"valid-user-token"),env);
    expect(denied.status).toBe(403);

    vi.stubGlobal("fetch",vi.fn(async()=>new Response(JSON.stringify({
      id:"developer-user",email:"owner@example.com"
    }),{status:200,headers:{"Content-Type":"application/json"}})));
    const accepted=await worker.fetch(request("/v1/atlas/developer-reset","POST",{
      playerName:"Nafila"
    },"valid-user-token"),env);
    expect(accepted.status).toBe(200);
    expect(await accepted.json()).toEqual(expect.objectContaining({resetRevision:expect.any(String)}));
  });

  it("fails closed when the reset store or rate limiter is missing",async()=>{
    const env=environment({ATLAS_RESET_KV:undefined,ATLAS_RESET_LIMITER:undefined});
    const response=await worker.fetch(request("/v1/atlas/master-reset","POST",{
      playerName:"Nafila",masterPassword:"test-only-master-reset-secret"
    }),env);
    expect(response.status).toBe(503);
  });
});
