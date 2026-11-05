import { cp, mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const androidRoot = path.join(root, "android");
const javaRoot = path.join(androidRoot, "app", "src", "main", "java");
const manifestPath = path.join(androidRoot, "app", "src", "main", "AndroidManifest.xml");

async function findFile(directory, filename) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      const match = await findFile(full, filename);
      if (match) return match;
    } else if (entry.name === filename) return full;
  }
  return null;
}

const mainActivityPath = await findFile(javaRoot, "MainActivity.java");
if (!mainActivityPath) throw new Error("Generated Capacitor MainActivity.java was not found.");
const packageDirectory = path.dirname(mainActivityPath);
const mainActivity = await readFile(mainActivityPath, "utf8");
const packageName = mainActivity.match(/^package\s+([\w.]+);/m)?.[1];
if (!packageName) throw new Error("Could not determine Android application package.");

for (const filename of ["FloatingWindowPlugin.java", "FloatingKeepAliveService.java"]) {
  await cp(path.join(root, "native", "android", filename), path.join(packageDirectory, filename));
}

const kittyDrawableRoot = path.join(androidRoot, "app", "src", "main", "res", "drawable-nodpi");
await mkdir(kittyDrawableRoot, { recursive: true });
for (const [source, target] of [
  ["shadow/kitty-shadow.png", "kitty_shadow.png"],
  ["ekor/kitty-tail.png", "kitty_tail.png"],
  ["body/kitty-body.png", "kitty_body.png"],
  ["kepala/kitty-head.png", "kitty_head.png"]
]) {
  await cp(path.join(root, "public", "kitty", source), path.join(kittyDrawableRoot, target));
}

let patchedActivity = await readFile(mainActivityPath, "utf8");
if (!patchedActivity.includes("FloatingWindowPlugin.class")) {
  patchedActivity = patchedActivity.replace(
    /^package\s+[\w.]+;/m,
    match => match + "\n\nimport android.os.Bundle;\nimport android.content.Intent;\nimport " + packageName + ".FloatingWindowPlugin;"
  );
  patchedActivity = patchedActivity.replace(
    /public class MainActivity extends BridgeActivity\s*\{/,
    match => match + "\n    @Override\n    public void onCreate(Bundle savedInstanceState) {\n        registerPlugin(FloatingWindowPlugin.class);\n        super.onCreate(savedInstanceState);\n    }\n    @Override\n    public void onResume() {\n        super.onResume();\n        Intent intent = getIntent();\n        if (intent != null && FloatingKeepAliveService.ACTION_OPEN_WINDOW.equals(intent.getAction())) {\n            FloatingWindowPlugin.onBubbleTapped(this);\n            intent.setAction(null);\n            setIntent(intent);\n        } else {\n            FloatingWindowPlugin.restoreForForeground();\n        }\n    }\n"
  );
  await writeFile(mainActivityPath, patchedActivity);
}


let lifecycleActivity = await readFile(mainActivityPath, "utf8");
if (!lifecycleActivity.includes("public void onNewIntent(Intent intent)")) {
  if (!lifecycleActivity.includes("import android.content.Intent;")) {
    lifecycleActivity = lifecycleActivity.replace(/^package\s+[\w.]+;/m, match => match + "\n\nimport android.content.Intent;");
  }
  lifecycleActivity = lifecycleActivity.replace(/\n}\s*$/, `
    @Override
    public void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
    }
}
`);
  await writeFile(mainActivityPath, lifecycleActivity);
}

let manifest = await readFile(manifestPath, "utf8");
if (!manifest.includes("android:launchMode=")) {
  manifest = manifest.replace(/<activity\b([^>]*)>/, (match, attributes) =>
    '<activity' + attributes + ' android:launchMode="singleTop">'
  );
}
const permissions = [
  "android.permission.SYSTEM_ALERT_WINDOW",
  "android.permission.ACCESS_NETWORK_STATE",
  "android.permission.FOREGROUND_SERVICE",
  "android.permission.FOREGROUND_SERVICE_SPECIAL_USE",
  "android.permission.POST_NOTIFICATIONS",
  "android.permission.REQUEST_IGNORE_BATTERY_OPTIMIZATIONS"
];
for (const permission of permissions) {
  const declaration = '    <uses-permission android:name="' + permission + '" />';
  if (!manifest.includes('android:name="' + permission + '"')) {
    manifest = manifest.replace("<application", declaration + "\n    <application");
  }
}
if (!manifest.includes("FloatingKeepAliveService")) {
  const service = "\n        <service\n" +
    '            android:name=".FloatingKeepAliveService"\n' +
    '            android:exported="false"\n' +
    '            android:foregroundServiceType="specialUse">\n' +
    "            <property\n" +
    '                android:name="android.app.PROPERTY_SPECIAL_USE_FGS_SUBTYPE"\n' +
    '                android:value="interactive overlay window for user-requested multitasking" />\n' +
    "        </service>\n";
  manifest = manifest.replace("</application>", service + "    </application>");
}
await writeFile(manifestPath, manifest);
console.log("Patched generated Android project with Merzkava Floating Mode plugin and foreground service.");


let backCallbackActivity = await readFile(mainActivityPath, "utf8");
if (!backCallbackActivity.includes("MerzkavaAndroidBackCallback")) {
  if (!backCallbackActivity.includes("import androidx.activity.OnBackPressedCallback;")) {
    backCallbackActivity = backCallbackActivity.replace(
      /^package\s+[\w.]+;/m,
      match => match + "\n\nimport androidx.activity.OnBackPressedCallback;"
    );
  }
  const callback = `
        // MerzkavaAndroidBackCallback: keep navigation inside the WebView until Home confirms exit.
        getOnBackPressedDispatcher().addCallback(this, new OnBackPressedCallback(true) {
            @Override
            public void handleOnBackPressed() {
                WebView currentWebView = getBridge() == null ? null : getBridge().getWebView();
                if (currentWebView == null) {
                    setEnabled(false);
                    MainActivity.this.finishAndRemoveTask();
                    return;
                }
                currentWebView.evaluateJavascript(
                    "window.dispatchEvent(new Event('merzkava:android-back'))",
                    null
                );
            }
        });
`;
  if (!backCallbackActivity.includes("super.onCreate(savedInstanceState);")) {
    throw new Error("Cannot attach Back callback: generated MainActivity onCreate shape changed.");
  }
  backCallbackActivity = backCallbackActivity.replace(
    "super.onCreate(savedInstanceState);",
    "super.onCreate(savedInstanceState);\n" + callback
  );
  await writeFile(mainActivityPath, backCallbackActivity);
}
