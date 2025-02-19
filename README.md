# 🎓 PaperCraft - Ihr digitaler Assistent für akademisches Schreiben


PaperCraft ist eine moderne Webanwendung, die Studenten und Akademiker beim Verfassen wissenschaftlicher Arbeiten unterstützt. Mit KI-gestützten Funktionen, Echtzeit-Grammatikprüfung und integrierter Literaturverwaltung macht PaperCraft das akademische Schreiben effizienter und professioneller.

## 🌟 Hauptfunktionen

### 📝 Intelligenter Editor
- **Rich-Text-Editor** mit TipTap
  - Akademische Formatierungsoptionen
  - Automatische Speicherung
  - Tabellen, Bilder, und Formeln
  - Dokumentenstrukturierung
- **Inhaltsverzeichnis** mit automatischer Aktualisierung
- **Split-View** für paralleles Arbeiten

### 🤖 KI-Assistent
- **Google Gemini Integration**
  - Formulierungshilfen
  - Strukturierungsvorschläge
  - Akademischer Stil-Check
- **Kontextsensitive Vorschläge**
- **Markdown-Unterstützung**

### ✍️ Grammatik & Rechtschreibung
- **LanguageTool Integration**
  - Echtzeit-Prüfung
  - Kontextbasierte Vorschläge
  - Akademischer Schreibstil
- **Mehrsprachige Unterstützung**
- **Interaktive Korrekturvorschläge**

### 📚 Literaturverwaltung
- **Cloud-basierte Bibliothek**
  - Zentrale Quellenverwaltung
  - Projektübergreifende Nutzung
  - Automatische Synchronisation
- **Zitierfunktionen**
  - Multiple Zitierstile
  - Automatisches Literaturverzeichnis
  - Zitat-Import

## 🛠️ Technischer Stack

### Frontend
- **Framework**: Next.js 14 mit App Router
- **Sprache**: TypeScript
- **Styling**: 
  - Tailwind CSS
  - shadcn/ui Komponenten
  - Responsive Design
- **Editor**: TipTap

### Backend
- **Firebase Suite**
  - Authentication
  - Firestore Database
  - Cloud Storage
- **APIs**
  - Google Gemini
  - LanguageTool

## 📦 Installation

1. **Repository klonen**
```bash
git clone https://github.com/yourusername/papercraft.git
cd papercraft
```

2. **Abhängigkeiten installieren**
```bash
npm install
```

3. **Umgebungsvariablen einrichten**
```bash
cp .env.example .env.local
```

4. **Firebase konfigurieren**
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

5. **Gemini API Key einrichten**
```env
GEMINI_API_KEY=your_gemini_api_key
```

6. **Entwicklungsserver starten**
```bash
npm run dev
```

## 📁 Projektstruktur

```
papercraft/
├── app/
│   ├── api/                 # API Routes
│   ├── components/
│   │   ├── dashboard/       # Dashboard Komponenten
│   │   ├── editor/         # Editor Komponenten
│   │   └── ui/             # UI Komponenten
│   ├── context/            # React Context
│   ├── dashboard/          # Dashboard Routen
│   └── lib/               # Utilities
├── public/                # Statische Assets
└── styles/               # Globale Styles
```

## 🔑 Hauptkomponenten

### Editor
- `TextEditor.tsx`: Haupteditor-Komponente
- `EditorSidebar.tsx`: Seitenleiste mit Tools
- `GrammarChecker.tsx`: Grammatikprüfung
- `CitationManager.tsx`: Literaturverwaltung
- `AIAssistant.tsx`: KI-Assistent

### Dashboard
- `ProjectForm.tsx`: Projekt erstellen/bearbeiten
- `UserNav.tsx`: Benutzernavigation
- `ProjectList.tsx`: Projektübersicht

## 🚀 Features im Detail

### Projektmanagement
- Projekte erstellen und organisieren
- Automatische Speicherung
- Versionierung
- Exportfunktionen

### Editorfunktionen
- Formatierungswerkzeuge
- Zitierfunktionen
- Grammatikprüfung
- KI-Unterstützung

### Benutzerverwaltung
- Authentifizierung
- Profilmanagement
- Projektfreigaben
- Einstellungen

## 📈 Roadmap

- [ ] Kollaborative Bearbeitung
- [ ] Erweiterte Export-Optionen
- [ ] Plagiatsprüfung
- [ ] Mobile App
- [ ] API für Erweiterungen

## 🤝 Contributing

Beiträge sind willkommen! Bitte beachten Sie:

1. Fork des Repositories
2. Feature Branch erstellen
3. Änderungen committen
4. Pull Request erstellen

## 📄 Lizenz

Dieses Projekt ist unter der MIT-Lizenz lizenziert.
