# Fallstudien "Capital Markets and Risk Management"

Interaktive Fallstudien für die Vorlesung. Reine statische Webseite: kein Login, keine KI, keine externen Bibliotheken oder Schriften.

## Inhalt

| Datei | Zweck |
|---|---|
| `index.html` | Startseite mit Liste der Fallstudien |
| `ch3/` | Fallstudie Kapitel 3 "A million for Elena" (Daten, Diagramm) |
| `ch4/` | Fallstudie Kapitel 4 "The battery bet" (Daten, Deal Sheet) |
| `assets/` | Gemeinsame Logik und Gestaltung für alle Fallstudien |
| `dashboard.html` | Dozentenansicht: gestartete Teams und gelöste Teilaufgaben |
| `config.js` | Adresse der Datenbank für die Live-Übersicht |
| `firebase-rules.json` | Zugriffsregeln für die Datenbank |

## Lokal testen

`ch3/index.html` im Browser öffnen. Ohne Eintrag in `config.js` läuft alles, es wird nur nichts gezählt.
Mit `?reset=1` am Ende der Adresse beginnt die Fallstudie von vorn.

## Auf GitHub veröffentlichen

1. Das Repository `ffm777/Capital-Markets-and-Risk-Management-Cases` öffnen (es muss öffentlich sein).
2. Den Inhalt dieses Ordners hochladen (uploading an existing file; die Ordner `assets` und `ch3` mit hineinziehen).
3. Settings > Pages > "Deploy from a branch", Branch `main`, Ordner `/ (root)`.
4. Die Seite ist danach unter `https://ffm777.github.io/Capital-Markets-and-Risk-Management-Cases/` erreichbar,
   die Fallstudie unter `.../ch3/`, die Dozentenansicht unter `.../dashboard.html`.

## Live-Übersicht einrichten (Firebase, kostenloser Spark-Tarif)

1. Auf console.firebase.google.com ein Projekt anlegen (Google Analytics wird nicht gebraucht).
2. Im Projekt eine **Realtime Database** erstellen, Standort Europa (Belgien), im gesperrten Modus.
3. Im Reiter "Regeln" den Inhalt von `firebase-rules.json` einfügen und veröffentlichen.
4. Die Adresse der Datenbank kopieren (endet auf `.firebasedatabase.app`) und in `config.js` eintragen.
5. Geänderte `config.js` ins Repository hochladen.

Gespeichert wird pro Team nur eine zufällige ID und der Zeitpunkt, zu dem eine Teilaufgabe gelöst wurde.
Die Regeln erlauben jedem das Lesen dieser Zählwerte und das einmalige Schreiben eines Eintrags; mehr nicht.

## In der Vorlesung

- Studenten öffnen `.../ch3/` bzw. `.../ch4/`. Die Sitzung ist automatisch das Tagesdatum.
- Für zwei Gruppen am selben Tag einen Code anhängen: `.../ch3/?run=gruppeA`
  und in der Dozentenansicht denselben Code eintragen.
- Nach drei Fehlversuchen erscheint "Show the approach", nach sechs "Show the solution".
  Eine so aufgedeckte Teilaufgabe zählt in der Übersicht als gelöst.

## Zahlen ändern

Die Lösungen stehen in `ch3/case-data.js` Base64-kodiert, damit sie im Quelltext nicht auf einen Blick lesbar sind.
Einen neuen Wert erzeugt die Browser-Konsole mit `btoa("22.36")`.
Die Kurven im Diagramm rechnet `ch3/chart.js` aus den Aktiendaten am Anfang der Datei.
