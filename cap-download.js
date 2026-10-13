// Download → «Salva o condividi» dentro l'APK. Generato da Crea APK · by Lollo ®2026
(function capDownload() {
  if (window.__creaApkDownload) return;
  window.__creaApkDownload = true;
  const nativo = () => window.Capacitor && typeof window.Capacitor.nativePromise === "function";
  const nomeFile = a => {
    let n = a.getAttribute("download");
    if (!n) { try { n = decodeURIComponent(new URL(a.href, location.href).pathname.split("/").pop()); } catch (e) { n = ""; } }
    return (n || "file").replace(/[\\/:*?"<>|]/g, "_");
  };
  const base64 = blob => new Promise((ok, ko) => {
    const r = new FileReader(); r.onload = () => ok(String(r.result).split(",")[1] || ""); r.onerror = () => ko(r.error); r.readAsDataURL(blob);
  });
  function salva(a) {
    const nome = nomeFile(a);
    const dati = fetch(a.href).then(r => r.blob());       // subito: molte pagine revocano il blob appena dopo il clic
    (async () => {
      try {
        const scritto = await window.Capacitor.nativePromise("Filesystem", "writeFile",
          { path: "download/" + nome, data: await base64(await dati), directory: "CACHE", recursive: true });
        await window.Capacitor.nativePromise("Share", "share", { title: nome, files: [scritto.uri], dialogTitle: "Salva o condividi " + nome });
      } catch (e) {
        const msg = String((e && e.message) || e);
        if (!/cancel|annull/i.test(msg)) alert("Non riesco a salvare " + nome + ": " + msg);
      }
    })();
  }
  const daGestire = a => nativo() && a && a.hasAttribute && a.hasAttribute("download") && a.href && !/^javascript:/i.test(a.href);
  window.addEventListener("click", e => {                     // dopo i gestori della pagina (fase di risalita)
    const a = e.target && e.target.closest && e.target.closest("a[download]");
    if (e.defaultPrevented || !daGestire(a)) return;
    e.preventDefault(); salva(a);
  });
  const clic = HTMLAnchorElement.prototype.click;               // link creati al volo e mai aggiunti alla pagina
  HTMLAnchorElement.prototype.click = function () {
    if (!this.isConnected && daGestire(this)) { salva(this); return; }
    return clic.call(this);
  };
  const invia = HTMLAnchorElement.prototype.dispatchEvent;      // FileSaver.js e simili
  HTMLAnchorElement.prototype.dispatchEvent = function (ev) {
    if (ev && ev.type === "click" && !this.isConnected && daGestire(this)) { salva(this); return false; }
    return invia.call(this, ev);
  };
})();
