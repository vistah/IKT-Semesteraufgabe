# Progressive Web Apps

Diese PWA dient dazu die eigene Bibliothek mit den Lieblingsbüchern zu pflegen.

## Allgemeines

####Die Bibliothek

- ist installierbar,
- kann offline gepflegt werden,
- wird mit der IndexedDB verwendet,
- verwendet ein Formular, welches mit der IndexedDB synchronisiert wird.

####Die Anwendung verfügt über

- ein responsives Frontend,
- ein Backend,
- eine Datenbank (MariaDB) zur persistenten Speicherung von den eingetragenen Daten.


##Beschreibung

###Installation
Mit dem Download des Codes muss zunächst in den Ordner `IKT-PWA-01` gewechselt werden.
Danach kann der Code mit `npm install` installiert und mit `npm start` ausgeführt werden.

Wenn die Installation erfolgreich war, ist die im unteren Abschnitt **App** beschriebene Webseite unter `localhost:8080` vorzufinden.

###App

#####Startseite
Es öffnet sich eine Website, die die im Abschnitt **Allgemeines** aufgelisteten Kriterien erfüllt.

Auf der Startseite werden die Objekte abgebildet, die zuvor durch das Formular hinzugefügt wurden.


#####Formular
Das Formular kann über den **'Hinzufügen'- Button** aufgerufen werden. Um es zu schließen, klicke auf **Schließen**.
Alle abgebildeten Felder müssen befüllt werden, ansonsten erscheint eine Fehlermeldung.

Hier kann der *Titel, der Autor, der Veröffentlichungsort, das Genre, der Verlag und das Veröffentlichungsjahr* angegeben werden.
Außerdem kann ein *Foto* aufgenommen beziehungsweise ein Bild hochgeladen werden.

Wenn der Kamerazugriff gewährt wird, kann ein Foto aufgenommen und mit dem Abschicken des Formulars gespeichert werden.
Wird der Zugriff verweigert, kann ein Bild hochgeladen werden.

Nachdem das Formular ausgefüllt wurde, kann dieses mit **Speichern** in die Datenbank geschickt werden.
Danach muss die Startseite aktualisiert werden. Der Eintrag wird ebenda abgebildet.

#####Hilfe
Auf der Hilfe-Seite kann über den Reiter **Hilfe** oder über http://localhost:8080/help/ aufgerufen werden.
Dort kann man nachgelesen, wie das Formular auszufüllen ist.



