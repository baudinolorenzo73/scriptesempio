# Simulatore GEA PWA — versione 5.13

Banca JSON esterna inclusa nel pacchetto: **454 domande chiuse** e **123 domande aperte**, per un totale di **577 quesiti**.

## Pubblicazione su GitHub Pages

1. Crea un repository GitHub oppure apri quello destinato al simulatore.
2. Carica **il contenuto di questa cartella nella radice del repository**: `index.html`, `manifest.webmanifest`, `sw.js` e le cartelle `icons` e `data`.
3. In GitHub apri **Settings → Pages**.
4. In **Build and deployment** scegli **Deploy from a branch**.
5. Seleziona il branch `main`, cartella `/ (root)`, quindi **Save**.
6. Apri l’indirizzo fornito da GitHub Pages. In Chrome/Android sono disponibili i pulsanti **Installa** e **Aggiorna**. Installa aggiunge la PWA al dispositivo; Aggiorna controlla e ricarica la versione pubblicata più recente.

La PWA richiede HTTPS o `localhost`. Non aprire direttamente `index.html` con `file://`: il caricamento del JSON e la cache offline possono essere bloccati dal browser.

## Aggiornamenti

Quando modifichi i file, cambia `CACHE_NAME` in `sw.js` (per esempio `simulatore-gea-v5.8.1`) per forzare il rinnovo della cache sui dispositivi.

## Banca JSON esterna

Le domande sono nel file `data/domande.json`, che normalmente viene pubblicato insieme agli altri file. Se manca, l’app chiede l’indirizzo HTTPS del JSON su GitHub e può usarlo online in sola lettura. È accettato sia l’indirizzo `raw.githubusercontent.com` sia quello GitHub con `/blob/`, che viene convertito automaticamente.

Dopo il caricamento online, **Salva offline e scarica JSON** conserva una copia operativa nella memoria della PWA, abilita l’editor e scarica anche un backup. Il browser sceglie la destinazione del backup secondo le proprie impostazioni. La copia operativa non dipende dalla posizione del file scaricato.

## Modalità del test

È possibile scegliere **Completo**, **Solo chiuse** o **Solo aperte**, il numero di domande e l’estrazione **proporzionale alle ore**, **RND** oppure **per argomento**. Ogni domanda può essere lasciata vuota; i pulsanti **Precedente** e **Successiva** consentono di tornare indietro e modificare le risposte prima della conclusione.

Tutte le opzioni secondarie sono raccolte in **Configurazione del test**. Ogni domanda mostra inoltre il proprio numero nella banca, per esempio `25/428` per le chiuse; lo stesso riferimento appare nella correzione e nell’editor. Nell’editor è possibile cercare direttamente il numero `25` oltre al testo.

La versione 5.6 distingue le domande **sicure** dalle **quasi sicure**. Quando le prioritarie sono abilitate, la domanda sicura di sintesi sull'ecologia viene sempre inserita nel test aperto; le altre completano il limite configurato di otto prioritarie.

## Banca dati modificabile

In **Banca dati, editor e importazione** puoi aggiungere o correggere domande a mano, importare JSON e scaricare un backup completo. Il file esportato può sostituire `data/domande.json` nel repository: in questo modo le modifiche diventano permanenti per tutti. Le modifiche non ancora pubblicate restano nel browser; il backup è consigliato prima di cambiare dispositivo, browser o cancellare i dati del sito.

## Percentuali e test mirato

La schermata iniziale mostra percentuale di risposte corrette, risposte date e quota da recuperare, oltre al dettaglio per argomento. Da qui è possibile avviare un test mirato sugli errori oppure azzerare percentuali e storico locale.

## Controllo delle ripetizioni

In **Configurazione del test** si può scegliere di evitare le domande già utilizzate nelle ultime 0–8 sessioni; il valore predefinito è 5. La sessione viene registrata appena le domande sono estratte, quindi anche un test interrotto viene conteggiato. Il controllo confronta sia l’identificativo sia il testo normalizzato, così intercetta anche un eventuale doppione salvato con un altro ID. Se non rimangono abbastanza quesiti, riutilizza solo quelli strettamente necessari partendo dai meno recenti. Il test mirato può riproporre intenzionalmente le domande sbagliate. Il pulsante **Azzera memoria ripetizioni** non modifica percentuali e risultati.

## Novità 5.6 — 9 ottobre 2026

- DB normalizzato: 374 chiuse + 107 aperte = 481 quesiti; conservati gli ID e l'ordine precedente. I record grezzi che la versione 5.5 già escludeva non fanno più parte del JSON operativo; l'archivio precedente resta recuperabile dalla cronologia.
- Versione DB indipendente dalla versione app: 2026.10.09-1, con data aggiornamento.
- Copia offline prioritaria all'avvio. Il pulsante Aggiorna banca dati scarica dal JSON GitHub configurato, oppure dal JSON del progetto, mantenendo le modifiche locali.
- In caso di errore di rete o JSON non valido, la banca già caricata non viene svuotata.
- Aggiornamento PWA: vengono eliminate soltanto le vecchie cache del simulatore; la cache utente e le altre app non vengono cancellate.
- Il JSON è opzionale per l'installazione. Se manca, puoi configurare GitHub oppure importare un JSON completo dalla sezione banca dati.
- Pulsanti Configura JSON GitHub e Come pubblicare le modifiche: lettura pubblica senza token; modifica remota dal proprio account GitHub, non dalla PWA.
- Fonti: 213 chiuse e 71 aperte hanno almeno una pagina PDF. Le pagine mancanti non sono state ricostruite o inventate. Il frammento #page può non essere rispettato da tutti i visualizzatori Drive.

La normalizzazione è un controllo strutturale, non una verifica scientifica di tutte le risposte. Nessuna nuova domanda è stata aggiunta in questo aggiornamento.

Prima di aggiornare, esporta banca JSON e storico: le cache del browser possono essere eliminate dal sistema o dall'utente. Le correzioni locali sovrascrivono la versione pubblica della stessa domanda finché non sono pubblicate o rimosse; sono conservate in questo browser, non sincronizzate automaticamente.

Verifiche eseguite: sintassi JavaScript, JSON, risposta corretta unica, unicità ID, controllo doppioni con l'algoritmo dell'app; test automatici dei percorsi di caricamento e del service worker. Non eseguita una prova d'installazione su dispositivo Android reale.

## Novità 5.7 — ripresa di una sessione sospesa

Domande estratte, ordine delle opzioni, risposte chiuse, testo aperto, posizione, modalità e tempo residuo vengono salvati automaticamente in questo browser. Il salvataggio avviene a ogni risposta e navigazione, periodicamente durante il timer e quando si lascia la pagina.

Alla riapertura scegli **Riprendi test** oppure **Ricomincia con un nuovo test**. Riprendi non estrae nuove domande e non registra una nuova sessione nella memoria antiripetizione. Ricomincia chiede conferma prima di cancellare il test sospeso e torna alla configurazione; lo storico precedente resta disponibile. La schermata di correzione intermedia viene ripristinata. Al completamento il salvataggio provvisorio viene eliminato.

Il tempo va in pausa quando l'app passa in secondo piano o viene chiusa; riprende tornando al test. Anche le risposte aperte vengono conservate temporaneamente per questa funzione, indipendentemente dall'opzione per salvarle nello storico finale. Non viene inviato nulla online.

Il ripristino vale per lo stesso browser, dispositivo e indirizzo del sito. Non recupera test chiusi nelle versioni precedenti, che non salvavano la sessione. Cancellazione dati del browser o modalità privata possono impedire il recupero. Se il salvataggio fallisce, l'app mostra un avviso. In caso di arresto improvviso il timer può perdere gli ultimi cinque secondi di aggiornamento.

Verifiche 5.7: sintassi, validazione snapshot, ripresa di risposta chiusa e testo aperto, posizione, ordine opzioni, ID sessione, tempo in pausa, correzione intermedia e scarto di salvataggi corrotti. Prova browser automatica non eseguita: il browser di test non è installato nell'ambiente.

## Novità 5.8 — materiale Classroom/Aggiunti2

66 nuovi quesiti: 54 chiusi (tre opzioni, una corretta) e 12 aperti. Argomenti: ecologia, zoologia, storia e folclore, comunicazione commerciale. Ogni aggiunta ha una spiegazione o una traccia di risposta e almeno una pagina PDF di riferimento. L’elenco con numeri, ID e fonti è in `AGGIORNAMENTO_5.8.md`.

Gli ID, i testi e l’ordine delle 481 domande precedenti sono conservati. Le nuove chiuse occupano le posizioni 375–428; le nuove aperte 108–119. La modalità con domanda sicura di ecologia conserva la traccia già presente: le nuove aperte non vengono dichiarate sicure automaticamente.

DB: `2026.10.11-1`. Per vedere le nuove domande su un’installazione esistente, pubblica anche `data/domande.json`, aggiorna la PWA e premi **Aggiorna banca dati**. Se hai configurato un JSON GitHub diverso, quel pulsante legge tale indirizzo: aggiorna anche quel file. In alternativa importa il JSON di questo pacchetto. Esporta prima un backup delle tue modifiche locali.

La consultazione dei PDF richiede accesso a Drive e connessione; il test può funzionare offline dopo il primo caricamento. L’apertura alla pagina indicata dipende dal visualizzatore PDF/Drive.

Verifiche 5.8: schema e conteggi JSON, ID unici, una risposta corretta per quesito chiuso, confronto dei nuovi quesiti con la banca esistente, caricamento e deduplicazione usando le funzioni dell’app, riferimenti e pagine delle fonti, sintassi degli script e del service worker. Non è una verifica scientifica completa delle domande pregresse né una prova d’installazione su Android.

## Novità 5.9 — tanatosi e consultazione delle prioritarie

- Nuova domanda aperta di fauna sulla tanatosi, indicata come sicura dall’utente. ID `GEA-O-20261011-TANATOSI`, numero `120/120`. Esempio: natrice dal collare; possibile autoemorrea, senza generalizzare a tutti i serpenti. Fonte: I RETTILI - LEZIONE 5.pdf, pagina 28.
- Totale 548 domande: 428 chiuse e 120 aperte. Conteggio visibile vicino alla versione e aggiornato in base alla banca effettivamente caricata, comprese importazioni e modifiche.
- Pulsante Vedi domande probabili nella prima pagina: elenco delle aperte sicure/quasi sicure, filtro, ricerca, numeri, ID, punti chiave e fonti. Utilizzabile anche con una banca online in sola lettura; non avvia una sessione.
- Con le prioritarie attive e almeno due domande aperte, in un test generale le sicure di ecologia e fauna hanno precedenza sulle quasi sicure. I test per argomento rispettano il filtro; con un solo posto non possono essere inserite entrambe. Con prioritarie disattivate sono escluse.

DB `2026.10.11-2`. Pubblicare anche il JSON e poi usare Aggiorna e Aggiorna banca dati. Se il JSON GitHub configurato è diverso, aggiornare quel file. Esportare prima le modifiche locali.

Verifiche 5.9: sintassi JavaScript e service worker, struttura JSON, 548 ID unici, risposta corretta unica, elenco prioritarie con filtri e ricerca, conteggio dinamico, inclusione delle sicure, esclusione con prioritarie disattivate e selezione per argomento. Controlli eseguiti sulle funzioni dell'app; non eseguita una prova visiva o d'installazione su dispositivo Android.

## Novità 5.10 — gestione delle aperte

Nell’editor scegli Domanda aperta: Nuova domanda aggiunge il quesito; selezionare un quesito permette di correggere testo, argomento e punti chiave della risposta di riferimento, aggiungendo o eliminando righe. Elimina domanda aperta rimuove il quesito dopo conferma. Annulla ultima eliminazione ripristina l’ultima rimozione finché l’app resta aperta. Dal pannello delle probabili puoi entrare direttamente con Gestisci domande aperte.

Le cancellazioni sono salvate nel browser per ID: un aggiornamento della banca non le fa ricomparire. Il JSON esportato comprende soltanto le domande ancora presenti. Reimportare un record con lo stesso ID lo ripristina. Per rendere permanenti le modifiche condivise, pubblica il JSON esportato su GitHub. La banca online in sola lettura va prima salvata offline.

Durante il test aperto, Cancella la mia risposta svuota il testo dopo conferma e mantiene la posizione. Le risposte restano modificabili prima di concludere. Le modifiche alla banca non alterano le domande già estratte in un test sospeso.

Il pacchetto mantiene 548 quesiti: 428 chiusi e 120 aperti. Il conteggio visibile cambia in base alle modifiche locali. Verifiche: cancellazione persistente, esportazione senza record rimossi, ripristino, protezione della sola lettura e rollback se il salvataggio fallisce; sintassi JavaScript e service worker. Nessuna prova di installazione su Android.

## Novità 5.11 — accesso editor in prima pagina

Il pulsante Aggiungi, modifica o elimina domande è subito sotto Vedi domande probabili nella pagina iniziale. Apre l’editor sulle aperte; il selettore Tipo permette di passare alle chiuse. L’accesso precedente in configurazione e nel pannello delle probabili è stato spostato qui. Restano le funzioni della 5.10 e i 548 quesiti.


## Novità 5.12 — 13 ottobre 2026

Letto `Classroom/Aggiunti2/GAE_x5f_GEOLOGIA_x5f_SOLO_x5f_TESTO_x5f_COMPLETO.pdf` (172 pagine). Aggiunte **26 chiuse** e **3 aperte** di geologia. La domanda chiusa sulla diorite (210/428 nella v5.11) e la traccia aperta sui processi endogeni ed esogeni (47/120) erano già presenti e mantengono ID e posizione: non sono state duplicate. Nel nuovo totale sono rispettivamente 210/454 e 47/123.

La condotta freatica non compare nel PDF nuovo: la spiegazione usa il riferimento scientifico USGS ([Cave Development](https://pubs.usgs.gov/wsp/1837/report.pdf)); nell'app non le viene attribuita una pagina di corso inventata. Le altre nuove domande riportano le pagine fisiche del PDF nel collegamento di correzione. Alcune parti della dispensa si ripetono: è stata usata una sola copia del contenuto. Le nuove domande aperte non sono marcate sicure o probabili.

DB: `2026.10.13-1`. Pubblica anche `data/domande.json` e `sw.js`, premi **Aggiorna** e poi **Aggiorna banca dati**. Se è configurato un JSON remoto diverso, aggiorna quel file oppure importa il JSON del pacchetto. Prima di aggiornare, esporta le modifiche locali.


## Novità 5.13 — revisione linguistica

Corretti apostrofi, accenti, maiuscole, refusi OCR, concordanze e formulazioni tronche, soprattutto nelle prime 160 domande importate. Rese più leggibili le opzioni e alcune tracce aperte. Identificativi, ordine, argomenti e posizione della risposta corretta restano invariati. Le domande tratte da leggi sono ancora presentate come riferimento storico del corso: questa versione esegue una revisione linguistica, non un aggiornamento normativo o una validazione scientifica generale.

DB `2026.10.13-2`. Prima di pubblicare esporta le eventuali modifiche locali; poi carica anche `data/domande.json` e `sw.js`, usa **Aggiorna** e **Aggiorna banca dati**.
