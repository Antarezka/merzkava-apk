import { describe, expect, it } from "vitest";
import worker, { type Env } from "../../gateway/worker";

const env:Env={
  SUPABASE_URL:"https://project.supabase.co",
  SUPABASE_ANON_KEY:"public-anon-key",
  AI_API_KEY:"unused-in-route-boundary-tests",
  AI_MODEL:"test-model",
  AI_BASE_URL:"https://provider.example/v1",
  ALLOWED_ORIGINS:"https://app.example"
};
function request(path:string,method="GET",body?:unknown):Request {
  const headers=new Headers({Origin:"https://app.example"});
  if(body!==undefined)headers.set("Content-Type","application/json");
  return new Request("https://gateway.example"+path,{method,headers,body:body===undefined?undefined:JSON.stringify(body)});
}
describe("World Atlas reset route boundary",()=>{
  it("does not expose Atlas account routes from the GM gateway",async()=>{
    for(const [path,method] of [
      ["/v1/atlas/reset-status?player=Nafila","GET"],
      ["/v1/atlas/master-reset","POST"],
      ["/v1/atlas/developer-reset","POST"]
    ] as const){
      const result=await worker.fetch(request(path,method,{playerName:"Nafila"}),env);
      expect(result.status).toBe(404);
    }
  });
});
