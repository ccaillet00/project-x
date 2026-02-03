# Step by Step guide when working on this project

## Das erste mal
Falls das Projekt aktuell noch nicht auf dem eigenen Gerät sich befindet sieht der Ablauf wie folgt aus: 
1. `git clone https://github.com/ccaillet00/project-x.git`
2. `cd project-x`
3. Umgebungsvariablen erstellen gemäss `.env.example` file 
4. Führe folgenden Befehl im Terminal aus: `cd /backend && bun install && cd ../frontend && bun install` somit werden die dependecies installiert im frontend und backend Ordner. 
5. `git checkout -b feature:#4` branch erstellen mit der User Story Number
6. Führe die Arbeits gemäss Story aus. 

## Projekt schon auf dem Gerät vorhanden
Falls das Projekt schon auf dem Gerät vorhanden haben, also das Repository wurde schon einmal gecloned sieht der Ablauf wie folgt aus: 
1. `git pull` um alle Änderungen im main und neu erstellten branches zu ziehen. Dein Projekt ist nun wieder aktuell gemäss Github Repository.
2. `git checkout -b feature:#4` branch erstellen mit der User Story Number. 
3. `.env` File sollte schon vorhanden sein. Allenfalls kurz `.env.example` öffnen ob man eine neue Variabel hinzufügen muss von einer Änderung. Darauf achten welches .env File angedacht ist ob im Backend oder im Frontend. 

## Arbeiten sind erledigt
Wenn du deine Arbeit gemacht hast gemäss User Story deine Änderung geprüft hast ob sie funktioniert sieht der Ablauf wie folgt aus:
1. Wir möchten prüfen, ob unser geschriebener Code unserer Code Guidline entspricht. Dafür führen wir folgenden command aus im frontend oder backend Ordner aus
```bash
bun lint 
bun lint:fix
```
Falls ein Fehler auftritt beim linten diesen beheben. Falls ihr den Fehler nicht versteht fragt im Chat oder KI. 

2. Wenn wir uns entweder im backend Ordner oder im Frontend Ordner befinden können wir mit dem folgendem Command die Formatierung für unseren Code vereinheitlichen.
```bash
bun format
```
3. Wenn der linter und die formatierung erfolgreich ausgeführt wurden können wir den Code nun in unser github repository stellen. Der Ablauf sieht wie folgt aus: 
```bash
cd.. # Damit wir uns wieder im root Folder befinden
git add .
git commit -m "feature,fix...:#4"
git push origin {#4} # Beim Wert in den geschweiften Klammern {} handelt es sich um den Branch Name der den Namen der User Story hat. Es kann einfach git push origin #4 geschrieben werden!
```
