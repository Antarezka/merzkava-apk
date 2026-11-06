import { Capacitor } from "@capacitor/core";
import { SecureStorage } from "@aparajita/capacitor-secure-storage";

const DATABASE_NAME="merzkava-augusto-pxl-cache-v1";
const STORE_NAME="encrypted-assets";
const KEY_NAME="merzkava.augusto-pxl.cache-key.v1";

type StoredAsset={id:string;iv:number[];ciphertext:ArrayBuffer;mimeType:string;storedAt:number};
let databasePromise:Promise<IDBDatabase>|null=null;
let keyPromise:Promise<CryptoKey>|null=null;

function assertNativeEncryptedStorage():void {
  if(!Capacitor.isNativePlatform()||Capacitor.getPlatform()!=="android")
    throw new Error("Encrypted Augusto PXL cache is available only in the Android APK. Bundled assets remain available without it.");
  if(!globalThis.crypto?.subtle)throw new Error("Web Crypto AES-GCM is unavailable in this Android WebView.");
}
function toBase64(bytes:Uint8Array):string {
  let binary="";
  for(const value of bytes)binary+=String.fromCharCode(value);
  return btoa(binary);
}
function fromBase64(value:string):Uint8Array {
  const binary=atob(value),bytes=new Uint8Array(binary.length);
  for(let i=0;i<binary.length;i++)bytes[i]=binary.charCodeAt(i);
  return bytes;
}
async function getInstallKey():Promise<CryptoKey> {
  assertNativeEncryptedStorage();
  if(!keyPromise){
    keyPromise=(async()=>{
      let encoded=await SecureStorage.getItem(KEY_NAME);
      if(!encoded){
        const raw=crypto.getRandomValues(new Uint8Array(32));
        encoded=toBase64(raw);
        // SecureStorage uses the Android Keystore and AES-GCM for its own persisted value.
        await SecureStorage.setItem(KEY_NAME,encoded);
      }
      return crypto.subtle.importKey("raw",fromBase64(encoded),{name:"AES-GCM"},false,["encrypt","decrypt"]);
    })();
  }
  return keyPromise;
}
function openDatabase():Promise<IDBDatabase> {
  if(!databasePromise){
    databasePromise=new Promise((resolve,reject)=>{
      const request=indexedDB.open(DATABASE_NAME,1);
      request.onupgradeneeded=()=>{if(!request.result.objectStoreNames.contains(STORE_NAME))request.result.createObjectStore(STORE_NAME,{keyPath:"id"});};
      request.onsuccess=()=>resolve(request.result);
      request.onerror=()=>reject(request.error??new Error("Could not open the local PXL asset cache."));
    });
  }
  return databasePromise;
}
async function readRecord(id:string):Promise<StoredAsset|null> {
  const db=await openDatabase();
  return new Promise((resolve,reject)=>{
    const request=db.transaction(STORE_NAME,"readonly").objectStore(STORE_NAME).get(id);
    request.onsuccess=()=>resolve((request.result as StoredAsset|undefined)??null);
    request.onerror=()=>reject(request.error??new Error("Could not read the local PXL asset cache."));
  });
}
export async function cacheAugustoPxlAsset(id:string,blob:Blob):Promise<void> {
  if(!id.trim())throw new Error("An asset ID is required.");
  const key=await getInstallKey();
  const iv=crypto.getRandomValues(new Uint8Array(12));
  const ciphertext=await crypto.subtle.encrypt({name:"AES-GCM",iv},key,await blob.arrayBuffer());
  const record:StoredAsset={id,iv:Array.from(iv),ciphertext,mimeType:blob.type||"application/octet-stream",storedAt:Date.now()};
  const db=await openDatabase();
  await new Promise<void>((resolve,reject)=>{
    const request=db.transaction(STORE_NAME,"readwrite").objectStore(STORE_NAME).put(record);
    request.onsuccess=()=>resolve();
    request.onerror=()=>reject(request.error??new Error("Could not save the encrypted PXL asset."));
  });
}
export async function readCachedAugustoPxlAsset(id:string):Promise<Blob|null> {
  const record=await readRecord(id);
  if(!record)return null;
  const key=await getInstallKey();
  const plain=await crypto.subtle.decrypt({name:"AES-GCM",iv:new Uint8Array(record.iv)},key,record.ciphertext);
  return new Blob([plain],{type:record.mimeType});
}
export async function removeCachedAugustoPxlAsset(id:string):Promise<void> {
  const db=await openDatabase();
  await new Promise<void>((resolve,reject)=>{
    const request=db.transaction(STORE_NAME,"readwrite").objectStore(STORE_NAME).delete(id);
    request.onsuccess=()=>resolve();
    request.onerror=()=>reject(request.error??new Error("Could not remove the cached PXL asset."));
  });
}
export async function clearCachedAugustoPxlAssets():Promise<void> {
  const db=await openDatabase();
  await new Promise<void>((resolve,reject)=>{
    const request=db.transaction(STORE_NAME,"readwrite").objectStore(STORE_NAME).clear();
    request.onsuccess=()=>resolve();
    request.onerror=()=>reject(request.error??new Error("Could not clear the cached PXL assets."));
  });
}
export async function cacheBundledAugustoPxlAsset(id:string,localPath:string):Promise<void> {
  if(!localPath.startsWith("/assets/augusto-pxl/")||localPath.includes(".."))
    throw new Error("Only app-bundled Augusto PXL assets may be copied into the offline cache.");
  const response=await fetch(localPath,{cache:"force-cache"});
  if(!response.ok)throw new Error("Bundled PXL asset is unavailable: "+id);
  await cacheAugustoPxlAsset(id,await response.blob());
}
export async function createCachedAugustoPxlObjectUrl(id:string):Promise<string|null> {
  const blob=await readCachedAugustoPxlAsset(id);
  return blob?URL.createObjectURL(blob):null;
}
