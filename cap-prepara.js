// Rifinisce il progetto Android generato da Capacitor (nome, versione, permessi, orientamento, icona).
// Generato da Crea APK · by Lollo ®2026
const JAVA_UPDATER = "package __PKG__;\n\nimport android.content.Context;\nimport android.content.Intent;\nimport android.net.Uri;\nimport android.os.Build;\nimport android.provider.Settings;\nimport androidx.core.content.FileProvider;\nimport com.getcapacitor.JSObject;\nimport com.getcapacitor.Plugin;\nimport com.getcapacitor.PluginCall;\nimport com.getcapacitor.PluginMethod;\nimport com.getcapacitor.annotation.CapacitorPlugin;\nimport java.io.ByteArrayOutputStream;\nimport java.io.File;\nimport java.io.FileOutputStream;\nimport java.io.InputStream;\nimport java.io.OutputStream;\nimport java.net.HttpURLConnection;\nimport java.net.URL;\n\n@CapacitorPlugin(name = \"CreaApkUpdater\")\npublic class CreaApkUpdater extends Plugin {\n\n    private HttpURLConnection apri(String indirizzo) throws Exception {\n        HttpURLConnection c = (HttpURLConnection) new URL(indirizzo).openConnection();\n        c.setConnectTimeout(15000);\n        c.setReadTimeout(30000);\n        c.setInstanceFollowRedirects(true);\n        c.setRequestProperty(\"User-Agent\", \"CreaAPK-aggiornamenti\");\n        c.setRequestProperty(\"Accept\", \"application/vnd.github+json\");\n        return c;\n    }\n\n    private File fileAggiornamento() {\n        File cartella = new File(getContext().getCacheDir(), \"update\");\n        cartella.mkdirs();\n        return new File(cartella, \"aggiornamento.apk\");\n    }\n\n    @PluginMethod\n    public void controlla(final PluginCall call) {\n        final String indirizzo = call.getString(\"url\");\n        new Thread(new Runnable() {\n            public void run() {\n                try {\n                    HttpURLConnection c = apri(indirizzo);\n                    int codice = c.getResponseCode();\n                    InputStream in = codice >= 400 ? c.getErrorStream() : c.getInputStream();\n                    ByteArrayOutputStream out = new ByteArrayOutputStream();\n                    if (in != null) {\n                        byte[] buf = new byte[8192];\n                        int n;\n                        while ((n = in.read(buf)) > 0) out.write(buf, 0, n);\n                        in.close();\n                    }\n                    JSObject r = new JSObject();\n                    r.put(\"stato\", codice);\n                    r.put(\"corpo\", out.toString(\"UTF-8\"));\n                    call.resolve(r);\n                } catch (Exception e) {\n                    call.reject(String.valueOf(e.getMessage()));\n                }\n            }\n        }).start();\n    }\n\n    @PluginMethod\n    public void scarica(final PluginCall call) {\n        final String indirizzo = call.getString(\"url\");\n        new Thread(new Runnable() {\n            public void run() {\n                try {\n                    HttpURLConnection c = apri(indirizzo);\n                    c.setRequestProperty(\"Accept\", \"application/octet-stream\");\n                    int codice = c.getResponseCode();\n                    if (codice != 200) {\n                        call.reject(\"Download rifiutato (codice \" + codice + \")\");\n                        return;\n                    }\n                    long atteso = c.getContentLengthLong();\n                    File f = fileAggiornamento();\n                    long totale = 0;\n                    InputStream in = c.getInputStream();\n                    OutputStream out = new FileOutputStream(f);\n                    byte[] buf = new byte[65536];\n                    int n;\n                    while ((n = in.read(buf)) > 0) {\n                        out.write(buf, 0, n);\n                        totale += n;\n                    }\n                    out.close();\n                    in.close();\n                    if (atteso > 0 && totale != atteso) {\n                        f.delete();\n                        call.reject(\"Download interrotto: \" + totale + \" byte su \" + atteso);\n                        return;\n                    }\n                    if (totale < 100000) {\n                        f.delete();\n                        call.reject(\"File troppo piccolo per essere un APK (\" + totale + \" byte)\");\n                        return;\n                    }\n                    JSObject r = new JSObject();\n                    r.put(\"byte\", totale);\n                    call.resolve(r);\n                } catch (Exception e) {\n                    call.reject(String.valueOf(e.getMessage()));\n                }\n            }\n        }).start();\n    }\n\n    @PluginMethod\n    public void installa(PluginCall call) {\n        try {\n            Context ctx = getContext();\n            if (Build.VERSION.SDK_INT >= 26 && !ctx.getPackageManager().canRequestPackageInstalls()) {\n                Intent imp = new Intent(Settings.ACTION_MANAGE_UNKNOWN_APP_SOURCES, Uri.parse(\"package:\" + ctx.getPackageName()));\n                imp.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);\n                ctx.startActivity(imp);\n                call.reject(\"permesso\");\n                return;\n            }\n            File f = fileAggiornamento();\n            if (!f.exists()) {\n                call.reject(\"Nessun file scaricato\");\n                return;\n            }\n            Uri uri = FileProvider.getUriForFile(ctx, ctx.getPackageName() + \".fileprovider\", f);\n            Intent i = new Intent(Intent.ACTION_VIEW);\n            i.setDataAndType(uri, \"application/vnd.android.package-archive\");\n            i.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION | Intent.FLAG_ACTIVITY_NEW_TASK);\n            ctx.startActivity(i);\n            call.resolve();\n        } catch (Exception e) {\n            call.reject(String.valueOf(e.getMessage()));\n        }\n    }\n}\n";
const JAVA_MAIN = "package __PKG__;\n\nimport android.os.Bundle;\nimport com.getcapacitor.BridgeActivity;\n\npublic class MainActivity extends BridgeActivity {\n    @Override\n    public void onCreate(Bundle savedInstanceState) {\n        registerPlugin(CreaApkUpdater.class);\n        super.onCreate(savedInstanceState);\n    }\n}\n";
(function capPrepara() {
  const fs = require("fs");
  const app = JSON.parse(fs.readFileSync("app.json", "utf8"));
  const run = parseInt(process.env.RUN_NUMBER || "1", 10) || 1;
  // nome, numero e permessi
  const gradle = "android/app/build.gradle";
  fs.writeFileSync(gradle, fs.readFileSync(gradle, "utf8")
    .replace(/versionCode \d+/, "versionCode " + run)
    .replace(/versionName "[^"]*"/, 'versionName "' + String(app.versione).replace(/[^0-9.]/g, "") + '"'));
  const man = "android/app/src/main/AndroidManifest.xml";
  let m = fs.readFileSync(man, "utf8");
  for (const p of app.permessi || []) {
    if (!/^[A-Z0-9_]+$/.test(p)) continue;
    const nome = "android.permission." + p;
    if (!m.includes('"' + nome + '"')) m = m.replace("</manifest>", '    <uses-permission android:name="' + nome + '" />\n</manifest>');
  }
  if (app.orientamento === "portrait" || app.orientamento === "landscape")
    m = m.replace('android:name=".MainActivity"', 'android:name=".MainActivity"\n            android:screenOrientation="' + app.orientamento + '"');
  const agg = app.aggiornamenti !== false;
  if (agg && !m.includes("REQUEST_INSTALL_PACKAGES"))
    m = m.replace("</manifest>", '    <uses-permission android:name="android.permission.REQUEST_INSTALL_PACKAGES" />\n</manifest>');
  fs.writeFileSync(man, m);
  // aggiornamento dall'app: plugin nativo che scarica l'APK dalle Releases e apre l'installazione
  if (agg) {
    const appId = JSON.parse(fs.readFileSync("capacitor.config.json", "utf8")).appId;
    const cartella = "android/app/src/main/java/" + appId.split(".").join("/");
    fs.mkdirSync(cartella, {recursive: true});
    fs.writeFileSync(cartella + "/CreaApkUpdater.java", JAVA_UPDATER.split("__PKG__").join(appId));
    fs.writeFileSync(cartella + "/MainActivity.java", JAVA_MAIN.split("__PKG__").join(appId));
    console.log("Aggiornamento dall'app attivo (" + appId + ")");
  }
  // script che girano dentro le pagine: vanno solo nelle copie dentro l'APK, non nei tuoi file
  const pub = "android/app/src/main/assets/public";
  const script = [];
  if (fs.existsSync("cap-download.js")) script.push(["cap-download.js", "crea-apk-download.js", ""]);
  if (agg && fs.existsSync("cap-aggiorna.js")) {
    const config = "window.__CREA_APK = " + JSON.stringify({repo: process.env.GITHUB_REPOSITORY || "", build: run, nome: app.titolo}) + ";\n";
    script.push(["cap-aggiorna.js", "crea-apk-aggiorna.js", config]);
  }
  if (script.length && fs.existsSync(pub)) {
    for (const [da, a, testa] of script) fs.writeFileSync(pub + "/" + a, testa + fs.readFileSync(da, "utf8"));
    const pagine = [];
    const giro = (dir, rel) => {
      for (const n of fs.readdirSync(dir)) {
        const p = dir + "/" + n;
        if (fs.statSync(p).isDirectory()) giro(p, rel + n + "/");
        else if (/\.html?$/i.test(n)) pagine.push([p, rel]);
      }
    };
    giro(pub, "");
    for (const [p, rel] of pagine) {
      let h = fs.readFileSync(p, "utf8");
      let tag = "";
      for (const [, a] of script)
        if (!h.includes(a)) tag += '<script src="' + "../".repeat(rel.split("/").length - 1) + a + '"><' + '/script>';
      if (!tag) continue;
      h = /<head[^>]*>/i.test(h) ? h.replace(/<head[^>]*>/i, m => m + tag) : tag + h;
      fs.writeFileSync(p, h);
    }
    console.log("Script aggiunti in " + pagine.length + " pagine: " + script.map(x => x[1]).join(", "));
  }
  // icona: sostituisce quella standard di Capacitor
  if (fs.existsSync("icon.png")) {
    const res = "android/app/src/main/res";
    fs.rmSync(res + "/mipmap-anydpi-v26", {recursive: true, force: true});
    for (const d of ["mdpi", "hdpi", "xhdpi", "xxhdpi", "xxxhdpi"])
      for (const n of ["ic_launcher", "ic_launcher_round", "ic_launcher_foreground"])
        fs.copyFileSync("icon.png", res + "/mipmap-" + d + "/" + n + ".png");
    console.log("Icona personalizzata applicata");
  }
  console.log("Progetto Android preparato: versione " + app.versione + " (build " + run + ")");
})();
