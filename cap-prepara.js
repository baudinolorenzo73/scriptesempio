// Rifinisce il progetto Android generato da Capacitor (nome, versione, permessi, orientamento, icona).
// Generato da Crea APK · by Lollo ®2026
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
  fs.writeFileSync(man, m);
  // download → «Salva o condividi»: lo script va solo nelle copie dentro l'APK, non nei tuoi file
  const pub = "android/app/src/main/assets/public";
  if (fs.existsSync("cap-download.js") && fs.existsSync(pub)) {
    fs.copyFileSync("cap-download.js", pub + "/crea-apk-download.js");
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
      if (h.includes("crea-apk-download.js")) continue;
      const tag = '<script src="' + "../".repeat(rel.split("/").length - 1) + 'crea-apk-download.js"><' + '/script>';
      h = /<head[^>]*>/i.test(h) ? h.replace(/<head[^>]*>/i, m => m + tag) : tag + h;
      fs.writeFileSync(p, h);
    }
    console.log("Salvataggio dei download attivo in " + pagine.length + " pagine");
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
