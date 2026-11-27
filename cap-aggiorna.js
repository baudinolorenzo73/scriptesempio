// Pulsante «Aggiornamenti» dentro l'APK. Generato da Crea APK · by Lollo ®2026
(function capAggiorna() {
  const C = window.__CREA_APK;
  if (window.__creaApkAgg || !C || !C.repo || window.top !== window) return;
  window.__creaApkAgg = true;
  const nativo = () => window.Capacitor && typeof window.Capacitor.nativePromise === "function";
  const nat = (metodo, par) => window.Capacitor.nativePromise("CreaApkUpdater", metodo, par || {});
  let trovato = null, occupato = false;
  const memo = {
    leggi() { try { return Number(localStorage.getItem("creaapk.agg.ultimo")) || 0; } catch (e) { return 0; } },
    scrivi() { try { localStorage.setItem("creaapk.agg.ultimo", String(Date.now())); } catch (e) {} }
  };
  function monta() {
    if (!nativo() || document.getElementById("crea-apk-agg")) return;
    const host = document.createElement("div");
    host.id = "crea-apk-agg";
    host.style.cssText = "position:fixed;right:10px;bottom:10px;z-index:2147483647;font:14px/1.35 system-ui,sans-serif";
    const r = host.attachShadow({mode: "open"});
    r.innerHTML = '<style>*{box-sizing:border-box}'
      + '.b{width:38px;height:38px;border-radius:50%;border:0;background:#1d3a2e;color:#fff;font-size:20px;opacity:.55;position:relative;float:right}'
      + '.b.nuovo{opacity:1;background:#c0392b}'
      + '.p{display:none;clear:both;width:min(300px,calc(100vw - 20px));margin-bottom:8px;padding:12px;border-radius:12px;background:#fff;color:#222;box-shadow:0 4px 18px rgba(0,0,0,.35)}'
      + '.p.on{display:block}.p b{display:block;margin-bottom:4px}.p small{color:#666}'
      + '.p button{margin:8px 6px 0 0;padding:8px 12px;border:0;border-radius:8px;background:#1d3a2e;color:#fff;font:inherit}'
      + '.p button.n{background:#e5e5e5;color:#222}</style>'
      + '<div class="p" id="p"><b id="t"></b><div id="m"></div><div id="az"></div></div>'
      + '<button class="b" id="b" title="Aggiornamenti">&#8635;</button>';
    document.body.appendChild(host);
    const $ = id => r.getElementById(id);
    function mostra(titolo, testo, azioni) {
      $("t").textContent = titolo; $("m").textContent = testo;
      const az = $("az"); az.innerHTML = "";
      for (const [etichetta, fn, sec] of azioni || []) {
        const b = document.createElement("button"); b.textContent = etichetta; if (sec) b.className = "n";
        b.onclick = fn; az.appendChild(b);
      }
      $("p").classList.add("on");
    }
    const chiudi = () => $("p").classList.remove("on");
    async function controlla(silenzioso) {
      if (occupato) return;
      occupato = true;
      if (!silenzioso) mostra("Aggiornamenti", "Controllo in corso…", []);
      try {
        const ris = await nat("controlla", {url: "https://api.github.com/repos/" + C.repo + "/releases/latest"});
        memo.scrivi();
        if (ris.stato === 404) throw new Error("Non vedo versioni pubblicate: il repository dev'essere pubblico e avere almeno una Release.");
        if (ris.stato === 403) throw new Error("GitHub ha limitato le richieste, riprova tra un po'.");
        if (ris.stato !== 200) throw new Error("GitHub ha risposto con il codice " + ris.stato + ".");
        const rel = JSON.parse(ris.corpo);
        const n = parseInt(String(rel.tag_name || "").replace(/^apk-/, ""), 10);
        const apk = (rel.assets || []).filter(a => /\.apk$/i.test(a.name))[0];
        if (!n || !apk) throw new Error("L'ultima Release non contiene un APK riconoscibile.");
        if (n > C.build) {
          trovato = {n, url: apk.browser_download_url, nome: apk.name, mb: (apk.size / 1048576).toFixed(1)};
          $("b").classList.add("nuovo");
          if (!silenzioso) mostraNuovo();
        } else {
          trovato = null; $("b").classList.remove("nuovo");
          if (!silenzioso) mostra("Sei aggiornato", "Hai già l'ultima versione (build " + C.build + ").", [["Chiudi", chiudi, true]]);
        }
      } catch (e) {
        if (!silenzioso) mostra("Controllo non riuscito", String((e && e.message) || e), [["Riprova", () => controlla(false)], ["Chiudi", chiudi, true]]);
      }
      occupato = false;
    }
    function mostraNuovo() {
      mostra("Nuova versione disponibile", "Build " + trovato.n + " (hai la " + C.build + ") · " + trovato.mb + " MB. I tuoi dati restano. Alla fine Android ti chiede di confermare l'installazione.",
        [["Scarica e installa", installa], ["Più tardi", chiudi, true]]);
    }
    async function installa() {
      if (occupato || !trovato) return;
      occupato = true;
      mostra("Download in corso…", "Sto scaricando " + trovato.nome + " (" + trovato.mb + " MB). Non chiudere l'app.", []);
      try {
        await nat("scarica", {url: trovato.url});
        await nat("installa");
        mostra("Pronto", "Conferma l'installazione nella schermata di Android. Se non compare, premi di nuovo.", [["Installa ancora", installa], ["Chiudi", chiudi, true]]);
      } catch (e) {
        const msg = String((e && e.message) || e);
        if (/permesso/i.test(msg)) mostra("Serve un permesso", "Si è aperta la schermata di Android: attiva «Consenti da questa fonte», poi torna qui e premi di nuovo «Scarica e installa».", [["Scarica e installa", installa], ["Chiudi", chiudi, true]]);
        else mostra("Non riuscito", msg, [["Riprova", installa], ["Chiudi", chiudi, true]]);
      }
      occupato = false;
    }
    $("b").onclick = () => {
      if ($("p").classList.contains("on")) return chiudi();
      if (trovato) mostraNuovo(); else controlla(false);
    };
    if (Date.now() - memo.leggi() > 6 * 3600 * 1000) setTimeout(() => controlla(true), 4000);   // controllo silenzioso all'avvio
  }
  if (document.body) monta(); else document.addEventListener("DOMContentLoaded", monta);
})();
