# Muliplayer Tetris
Moi!

## Konfiguration
### Systemvoraussetzungen des Servers 
Um das Projekt starten zu können, benötigen Sie <strong>Node.js</strong>, sowie eine laufende <strong>mySQL-Datenbank.</strong>

### Datenbank
Die Konfigurationsdatei der Datenbank befindet sich im Verzeichnis <code>Development/public/global/db.js</code>. Hier kann auch angegeben werden, ob die Datenbank inkl. einiger vieler Beispieldatensätzten, beim Serverstart, erstellt werden soll. </p><p>Auch wenn man es an dem Pfad denken könnte, is die Datei über den Server von außern nicht aufrufbar. Die Benennung des Verzeichnisses <code>public</code> hat allein historische Gründe.

### Weitere Konfigurationsmöglichkeiten
Weitere Möglichkeiten der Konfiguration des Projekt, bietet die Datei <code>config.js</code> im Verzeichnis <code>/Development/public/global/config.js</code>

## Start
### Der Server
Zum starten des Server, die <code>start.sh</code> im Verzeichnis <code>/Development/public</code> ausführen.
Falls Sie den Server beenden möchten, können Sie einfach <code>stop</code> in der Konsole Eingeben.

### Die Ein- /Ausgabegeräte
Bitte starten Sie den Browser Ihres Vertrauens. <i>Falls dieser der <strong>IE</strong> von MS sein sollte, fahren Sie bitte den Rechner herunter und überdenken Sie Ihre Wahl</i>. Falls dies aber, wie zu Erwarten, nicht der Fall ist, können Sie, nach des starten des Server natürlich, über Ihre IP + den Port 1337 auf die Startseite des Projekts zugreifen. Wenn Ihre IP z.B. 192.168.1.100 lautet, würde die korrekte Adresse zu Ansprechen des Server wie folgt lauten: 192.168.1.100:1337. Bitte verwenden Sie die <strong>aktuellste Version</strong>. Ihres Browsers

## Verzeichnisse

### /Development
In diesem Verzeichnis befinden sich alle Quelltext inkl. aller Node-Module.

#### /Development/node_modules
Alle extern geladenen Node-Module befinden sich hier.

#### /Development/public
Alle Daten des Projektes.

### /Dokumente
In diesem Verzeichnis befinden sich alle Dokumente, die mit der Dokumentation des Projektes zu tuen haben.
Zum neuerstellen der Dokumentation, die <code>create_doc.sh</code> ausführen.

#### /Dokumente/Abgabe
Alle Dokumentationen, außer die JS-Doc, befinden sich hier, wie das ER-Diagramm, die Beschreibung des RESTFUL-Services, das Dateiendiagramm und das Klassendiagramm.

#### /Dokumente/JS-Dokumentation
Die mit <code>create_doc.sh</code> erstellte Dokumentation befindet sich in diesem Verzeichnis.

#### /Dokumente/Präsentation
Alle Daten, die zur Präsentation erstellt wurden und die Presäntation selbst befinden sich hier.

### /Layouts
Alle Layoutdateien des Projektes, die mit Photoshop oder Indesign erstellt worden, sind hier zu finden.

## Entwicklung
### Software und Hardware
Entwicklet wurde dieses Projekt auf Unix-Systemen. Als Testbrowser wurden die aktuellsten Version (Stand 01.07.14) der Browser Chrome, Chromium und Firefox verwendet. Als Mobile-Devices kam ein iPhone 5s mit Safarie, sowie ein Android mit Firefox zum Einsatz.
