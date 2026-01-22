# Coderichtlinie Project-X 

## Table of Contents
1. [Sprache und Benennung (Naming)]()
2. [TypeScript & Qualität (ESLint & Prettier)]()
3. [Git-Workflow & Zusammenarbeit]()
4. [Sicherheit & Umgebungsvariablen]()


## Sprache und Benennung (Naming)
- **Sprache:** Wir schreiben Code (Variablen, Funktionen, Klassen) auf **Englisch**. (Kommentare dürfen auf Deutsch sein, wenn es hilft aber Englisch ist Standard.)
- **Variablen & Funktionen:** Wir nutzen `camelCase` (z.B. `const userLoginCount = 5;`)
- **Komponenten (Nuxt):** Wir nutzen `PascalCase` für Dateinamen (z.B. `UserProfile.vue`)
- **Aussagekraft:** Keine Namen wie `a`, `b` oder `data1`. Nutze `userList` statt `list`

## TypeScript & Qualität (ESLint & Prettier)
- **Kein `any`:** Wir versuchen, den Typ immer anzugeben. Wenn wir ihn nicht wissen, fragen wir in der Gruppe oder nutzen `unknown`.
- **Interfaces:** Für Datenobjekte (z.B. ein User oder ein Produkt) erstellen wir immmer ein `interface`.
- **ESLint-Prüfung vor jedem Push:** Bevor Code zu GitHub hochgeladen (gepusht) wird, muss lokal eine Prüfung mit ESLint durchgeführt werden.
    - Regel: Es darf kein Code gepusht werden, der ESLint-Fehler (rote Markierungen) enthält.
    - Ziel: Wir verhindern, dass Fehler von einer Person das gesamte Projekt für alle anderen blockieren.
- **Automatisches Formatieren:** Wir nutzen die VS Code Erweiterung „Prettier“. Jeder stellt in seinen VS Code Settings **Format on Save** ein, damit der Code beim Speichern automatisch nach unseren Regeln formatiert wird.

## Git-Workflow & Zusammenarbeit
- **Keine Arbeit auf `main`:** Der main-Branch enthält nur stabilen, funktionierenden Code.

- **Feature-Branches:** Für jede neue Aufgabe erstellen wir einen eigenen Branch (z. B. feature/UserStoryNumber(#4) oder fix/UserStoryNumber(#4)).

- **Pull Requests (PR):** Bevor Code in den main-Branch kommt, wird ein PR erstellt. Mindestens eine andere Person aus dem Team schaut kurz drüber (Vier-Augen-Prinzip).

- **Aussagekräftige Commits:** Wir schreiben kurz, was gemacht wurde (z. B. feat: Login-Validierung hinzugefügt).

## Sicherheit & Umgebungsvariablen (`.env`)
- **Geheimnisse schützen:** Passwörter, API-Keys oder Datenbank-URLs dürfen **niemals** direkt im Code stehen.

- **Nutzung von .env:** Alle sensiblen Daten werden in einer .env-Datei gespeichert.

- **Git-Sicherheit:** Die Datei .env wird niemals hochgeladen (sie steht in der .gitignore).

- **Beispiel-Datei:** Wir pflegen eine .env.example mit Platzhaltern, damit jeder weiß, welche Variablen konfiguriert werden müssen.