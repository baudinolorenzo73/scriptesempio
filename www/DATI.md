# Fonti geografiche di LolloGpx

## Filtro per zona

I limiti amministrativi provengono da [ISTAT, confini a fini statistici del 1° gennaio 2026](https://www.istat.it/notizia/confini-delle-unita-amministrative-a-fini-statistici-al-1-gennaio-2018-2/), [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/deed.it). Le geometrie sono semplificate e convertite in coordinate WGS84.

Le valli sono raggruppamenti pratici di comuni. Per la Val di Susa il riferimento sono le [Unioni montane](https://www.cittametropolitana.torino.it/urp/comuni-e-unioni-di-comuni/unioni-montane), con l’inclusione della Via Lattea in Alta Val di Susa (Pragelato è in Val Chisone e Sestriere è vicino allo spartiacque). I limiti comunali non seguono sempre il bacino della valle. Il filtro include un GPX quando almeno un punto registrato o un waypoint ricade nella zona. Una traccia può quindi comparire in più zone.

## Catasto Sentieri Valle d’Aosta

Dati forniti dalla Struttura Forestazione e Sentieristica della Regione Autonoma Valle d’Aosta. [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/deed.it).

- **Archivio locale**. Elaborazione dello shapefile `sentieri.shp` del [download ufficiale Rete Sentieristica](https://geoportale.regione.vda.it/download/rete-sentieristica/), file datati 17 novembre 2026. I 1.100 itinerari pubblicati usano una selezione dei campi originali, coordinate convertite in WGS84 e arrotondate a cinque decimali. I GPX creati da queste geometrie non includono quote puntuali.
- **Rete regionale sulla mappa**. Collegamento al [servizio WMS del Catasto](https://catastosentieri.regione.vda.it/interoperabilita/) e alla sua cartografia online.
- **Sentieri CAI sulla mappa**. Richiesta distinta dei sentieri OSM2CAI nell’area visibile. Le due fonti hanno coperture diverse.

## Rete del Patrimonio Escursionistico del Piemonte

Fonte: [Regione Piemonte, Rete del Patrimonio Escursionistico (RPE), percorsi](https://www.geoportale.piemonte.it/geonetwork/serv/api/records/r_piemon:77e9d108-c291-4fcf-ba5b-12c1b3251558), [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/deed.it).

La ricerca online usa il servizio WFS ufficiale e filtra i percorsi per coordinate, codice o descrizione disponibile. I GPX esportati contengono la geometria WGS84 e l’attribuzione. Le quote puntuali non sono presenti nella geometria restituita. Il livello RPE online usa il WMS ufficiale. Il pulsante Sentieri CAI qui consulta OSM2CAI nell’area visibile.
