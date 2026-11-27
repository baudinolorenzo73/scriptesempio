/* pwa.js — installazione e aggiornamento dell'app. by Lollo ®2026
   Costruisce da solo i suoi pulsanti (nessun markup richiesto nella pagina):
   - «📲 Installa» quando Chrome permette l'installazione;
   - «⬆ Aggiorna alla X» quando è pronta una versione nuova (cambia versione.js).
   Funziona solo da https:// (GitHub Pages); aperta come file resta una pagina normale. */
(function () {
  'use strict';
  var VERSIONE = self.VERSIONE || '?';
  var barra = null;

  function creaBarra() {
    if (barra) return barra;
    barra = document.createElement('div');
    barra.setAttribute('role', 'status');
    barra.style.cssText = 'position:fixed;left:12px;right:12px;bottom:12px;z-index:99999;display:none;' +
      'gap:8px;flex-wrap:wrap;justify-content:center;font:600 16px system-ui,sans-serif';
    document.body.appendChild(barra);
    return barra;
  }
  function pulsante(testo, azione) {
    var b = document.createElement('button');
    b.type = 'button'; b.textContent = testo;
    b.style.cssText = 'min-height:48px;padding:10px 18px;border:0;border-radius:12px;' +
      'background:#1c3270;color:#fff;font:inherit;box-shadow:0 2px 10px rgba(0,0,0,.35)';
    b.addEventListener('click', azione);
    creaBarra().appendChild(b); barra.style.display = 'flex';
    return b;
  }

  // Installazione: al posto del banner di Chrome si mostra un pulsante nostro.
  var richiesta = null, btnInstalla = null;
  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault(); richiesta = e;
    if (!btnInstalla) btnInstalla = pulsante('📲 Installa', async function () {
      richiesta.prompt(); await richiesta.userChoice;
      richiesta = null; btnInstalla.remove(); btnInstalla = null;
    });
  });
  window.addEventListener('appinstalled', function () {
    if (btnInstalla) { btnInstalla.remove(); btnInstalla = null; }
  });

  // Il numero di versione, dove la pagina ha un elemento con classe «num-versione».
  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.num-versione').forEach(function (e) { e.textContent = VERSIONE; });
  });

  if (!('serviceWorker' in navigator) || location.protocol === 'file:') return;

  var btnAggiorna = null, ricaricato = false;
  function offriAggiornamento(sw) {
    if (btnAggiorna || !sw) return;
    var canale = new MessageChannel();
    var mostra = function (v) {
      if (btnAggiorna) return;
      btnAggiorna = pulsante('⬆ Aggiorna' + (v ? ' alla ' + v : ''), function () {
        btnAggiorna.textContent = 'Aggiorno…';
        sw.postMessage({ tipo: 'attiva' });
      });
    };
    var scadenza = setTimeout(function () { mostra(''); }, 2000);
    canale.port1.onmessage = function (e) { clearTimeout(scadenza); mostra(String(e.data || '')); };
    try { sw.postMessage({ tipo: 'versione' }, [canale.port2]); } catch (x) { clearTimeout(scadenza); mostra(''); }
  }

  var controllata = !!navigator.serviceWorker.controller;
  navigator.serviceWorker.addEventListener('controllerchange', function () {
    if (!controllata) { controllata = true; return; }
    if (ricaricato) return; ricaricato = true; location.reload();
  });

  navigator.serviceWorker.register('sw.js', { updateViaCache: 'none' }).then(function (reg) {
    // Versione già scaricata e in attesa (es. alla riapertura dell'app).
    if (reg.waiting && navigator.serviceWorker.controller) offriAggiornamento(reg.waiting);
    reg.addEventListener('updatefound', function () {
      var nuovo = reg.installing;
      if (!nuovo) return;
      nuovo.addEventListener('statechange', function () {
        if (nuovo.state === 'installed' && navigator.serviceWorker.controller) offriAggiornamento(nuovo);
      });
    });
    // Controlla all'apertura e quando l'app torna in primo piano.
    reg.update().catch(function () {});
    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'visible') reg.update().catch(function () {});
    });
  }).catch(function () {});
})();
