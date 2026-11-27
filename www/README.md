# LolloGpx

Libreria GPX: catasto sentieri CAI, rete RPE Piemonte, difficoltà T/E/EE/EEA, mappe offline by Lollo ®2026

Versione: **2.5.0**.

Per creare una raccolta, combina i filtri della libreria e tocca **Salva filtri**. Apri la raccolta dal menu **Raccolte salvate**. La mappa segue i filtri selezionati e il backup JSON include le raccolte.

Correzioni: segmenti GPX separati, validazione ZIP/CRC, controllo URL e foto importate.
Nota: l’esportazione GPX ricrea tracce e waypoint; le estensioni proprietarie (es. navigazione OsmAnd, frequenza cardiaca) non sono conservate. I segmenti separati sono esportati come tracce separate.

In Modifica: Controlla registrazione e quote, Normalizza traccia, Comprimi traccia, Correggi altitudine e Controlla / aggiorna quote online. Le modifiche interessano la traccia selezionata e si possono annullare con Annulla. Il confronto online campiona fino a 100 punti e usa il modello del terreno Open-Meteo (90 m).
Tocca la freccia della mappa e scegli Nord magnetico automatico. Il calcolo offline usa geomagnetism 0.2.0 (Apache-2.0) con modelli WMM, coordinate del primo punto GPX, livello del mare e data odierna modificabile. Le date fuori validità del modello sono segnalate. Nella mappa generale usa la traccia selezionata, oppure la prima visualizzata. Il riferimento cartografico non usa il sensore del telefono.

In Libreria seleziona una zona geografica, anche senza compilare il campo Luogo. In Cerca in rete cerca gli itinerari regionali della Valle d’Aosta o apri Mappa dei sentieri per consultare anche la rete regionale e i sentieri CAI. Vedi [fonti geografiche](DATI.md).

In Cerca in rete, Sentieri del Piemonte consulta i percorsi RPE per valle, codice o descrizione. Puoi aprirli in anteprima, importarli come GPX o consultare la mappa RPE e CAI.
