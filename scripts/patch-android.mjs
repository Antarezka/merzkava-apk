import { cp, readFile, readdir, writeFile } from "node:fs/promises";
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

let patchedActivity = await readFile(mainActivityPath, "utf8");
if (!patchedActivity.includes("FloatingWindowPlugin.class")) {
  patchedActivity = patchedActivity.replace(
    /^package\s+[\w.]+;/m,
    match => match + "\n\nimport android.os.Bundle;\nimport " + packageName + ".FloatingWindowPlugin;"
  );
  patchedActivity = patchedActivity.replace(
    /public class MainActivity extends BridgeActivity\s*\{/,
    match => match + "\n    @Override\n    public void onCreate(Bundle savedInstanceState) {\n        registerPlugin(FloatingWindowPlugin.class);\n        super.onCreate(savedInstanceState);\n    }\n"
  );
  await writeFile(mainActivityPath, patchedActivity);
}

let manifest = await readFile(manifestPath, "utf8");
const permissions = [
  "android.permission.SYSTEM_ALERT_WINDOW",
  "android.permission.FOREGROUND_SERVICE",
  "android.permission.FOREGROUND_SERVICE_SPECIAL_USE",
  "android.permission.POST_NOTIFICATIONS"
];
for (const permission of permissions) {
  const declaration = \`    <uses-permission android:name="\${permission}" />\`;
  if (!manifest.includes(\`android:name="\${permission}"\`)) {
    manifest = manifest.replace("<application", declaration + "\n    <application");
  }
}
if (!manifest.includes("FloatingKeepAliveService")) {
  const service = \`
        <service
            android:name=".FloatingKeepAliveService"
            android:exported="false"
            android:foregroundServiceType="specialUse">
            <property
                android:name="android.app.PROPERTY_SPECIAL_USE_FGS_SUBTYPE"
                android:value="interactive overlay window for user-requested multitasking" />
        </service>
\`;
  manifest = manifest.replace("</application>", service + "    </application>");
}
await writeFile(manifestPath, manifest);
console.log("Patched generated Android project with Merzkava Floating Mode plugin and foreground service.");
