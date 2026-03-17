# Project-x 🐦
 
Eine moderne Micro-Blogging Plattform inspiriert von Twitter — gebaut mit Nuxt 4, Node.js/Express, PostgreSQL und KI-gestützter Inhaltsmoderation via Ollama.
 
---
 
## 📖 Was ist Project-x?
 
Project-x ist eine Full-Stack Micro-Blogging Applikation wo Benutzer kurze Posts (Tweets) erstellen, liken und kommentieren können. Die Plattform verfügt über eine integrierte KI-Inhaltsmoderation die Hassrede automatisch erkennt und entsprechende Posts entfernt.
 
### Features
 
- **Authentifizierung** — Registrierung & Login mit JWT Token
- **Posts erstellen** — Tweets mit max. 255 Zeichen
- **KI-Moderation** — Automatische Erkennung von Hassrede via Ollama
- **Profil** — Eigene Posts & Avatar (Initialen-basiert)
- **Dark/Light Mode** — Theme Toggle
- **Echtzeit-Updates** — Automatisches Polling alle 5 Sekunden
 
### Tech Stack
 
| Bereich | Technologie |
|---|---|
| Frontend | Nuxt 4, Vue 3, TypeScript, TailwindCSS, DaisyUI |
| Backend | Node.js, Express, TypeScript |
| Datenbank | PostgreSQL, Drizzle ORM |
| KI | Ollama (granite4:1b) |
| Message Broker | BullMQ, Redis |
| Infrastruktur | Docker, Nginx |
 
---
 
## 🚀 Installation & Setup
 
### Voraussetzungen
 
- [Docker](https://www.docker.com/) & Docker Compose
- [Bun](https://bun.sh/) (für lokale Entwicklung)
 
### Docker Setup (empfohlen)
 
**1. Repository klonen**
 
```bash
git clone https://github.com/dein-user/project-x.git
cd project-x
```
 
**2. Environment Variables konfigurieren**
 
```bash
cp .env.example .env
```
 
`.env` Datei anpassen:
 
```env
# Datenbank
POSTGRES_USER=postgres
POSTGRES_PASSWORD=deinpasswort
POSTGRES_DB=projectx
 
# JWT
JWT_SECRET=dein-geheimer-schluessel
 
# Redis
REDIS_HOST=redis
REDIS_PORT=6379
 
# Ollama
OLLAMA_HOST=http://ollama:11434
```
 
**3. Docker Container starten**
 
```bash
docker compose up --build
```
 
**4. Ollama Modell laden**
 
```bash
docker exec ollama ollama pull granite4:1b
```
 
**5. Applikation aufrufen**
 
| Service | URL |
|---|---|
| Frontend | http://localhost:4000 |
| Backend API | http://localhost/api |
 
---
 
## 🔌 API Endpoints
 
### Authentifizierung
 
| Method | Endpoint | Beschreibung | Auth |
|---|---|---|---|
| `POST` | `/api/auth/register` | Neuen Benutzer registrieren | ❌ |
| `POST` | `/api/auth/login` | Einloggen, JWT erhalten | ❌ |
 
**Register Request:**
```json
{
  "username": "max",
  "email": "max@example.com",
  "password": "passwort123"
}
```
 
**Login Request:**
```json
{
  "username": "max",
  "password": "passwort123",
  "remember": 0
}
```
 
**Login Response:**
```json
{
  "message": "Login successful",
  "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```
 
---
 
### Posts
 
| Method | Endpoint | Beschreibung | Auth |
|---|---|---|---|
| `GET` | `/api/posts` | Alle Posts abrufen | ❌ |
| `POST` | `/api/posts` | Neuen Post erstellen | ✅ |
| `PUT` | `/api/posts/:id` | Post bearbeiten | ✅ |
| `DELETE` | `/api/posts/:id` | Post löschen | ✅ |
 
**Post erstellen Request:**
```json
{
  "tweet": "Hallo Welt!",
  "userId": 1
}
```
 
**Post Response:**
```json
{
  "id": 1,
  "tweet": "Hallo Welt!",
  "userId": 1,
  "username": "max",
  "created": "2026-03-17T10:00:00.000Z",
  "sentiment": "ok",
  "correction": "",
  "likes": [],
  "comments": []
}
```
 
---
 
### Likes & Kommentare
 
| Method | Endpoint | Beschreibung | Auth |
|---|---|---|---|
| `POST` | `/api/posts/:id/like` | Post liken | ✅ |
| `POST` | `/api/posts/:id/comments` | Kommentar hinzufügen | ✅ |
 
**Kommentar Request:**
```json
{
  "userId": 1,
  "content": "Toller Post!"
}
```
 
---
 
## 📸 Screenshots
 
### Login & Registrierung
![Login Page](./docs/screenshots/login.png)
 
### Feed / Hero Page
![Hero Page](./docs/screenshots/hero.png)
 
### Post Modal
![Post Modal](./docs/screenshots/modal.png)
 
### Profil
![Profil Page](./docs/screenshots/profile.png)
 
---
 
## 🏗️ Architektur
 
```
Browser
  └── Nuxt Frontend (Port 4000)
        └── Nginx Loadbalancer (Port 80)
              └── Express Backend (Port 3000)
                    ├── PostgreSQL (Datenbank)
                    ├── Redis + BullMQ (Message Broker)
                    └── Ollama (KI Moderation)
```
 
### KI-Moderation Flow
 
```
Post erstellen
  └── In DB speichern
  └── Job an BullMQ Queue
        └── Worker analysiert mit Ollama
              ├── ok        → sentiment in DB updaten
              └── dangerous → Post automatisch löschen
```
 
---
 
## 🐳 Docker Services
 
| Service | Beschreibung | Port |
|---|---|---|
| `webserver` | Nginx Loadbalancer | 80 |
| `frontend-demo-api` | Nuxt Frontend | 4000 |
| `api` | Express Backend (2 Replicas) | 3000 |
| `worker` | BullMQ Worker | — |
| `database` | PostgreSQL | 5432 |
| `redis` | Redis Stack | 6379 |
| `ollama` | Ollama KI | 12434 |
 
---
 
## 👥 Team
 
Project-x — entwickelt im Rahmen des Moduls Software- und Plattformarchitektur.
 
---
 
*Letzte Aktualisierung: März 2026*