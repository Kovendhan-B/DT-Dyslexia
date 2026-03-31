# 🚀 Dys-Learn — Dyslexia Learning Platform

A child-facing, accessibility-first web application designed to help kids with dyslexia improve English literacy through guided lessons, interactive games, and formal tests — all wrapped in a fun **space exploration** theme.

---

## ✨ Features

### 🔐 Auth & User Management
- **One user per device** — simple register/login backed by `localStorage`
- Username pre-filled on return visits for ease of use
- No backend server required — fully client-side

### 🌍 Bilingual UI (EN / தமிழ்)
- Toggle between **English** and **Tamil** UI from the Dashboard at any time
- All chrome (labels, navigation, zone headers, buttons, feedback messages) switches instantly
- **Taught content stays in English** — Tamil is the language of instruction, not the subject
- Tamil text rendered via **Noto Sans Tamil** font

### 🎮 Gamified Dashboard ("My Learning Planet")
The 4-zone dashboard makes learning feel like an adventure:

| Zone | Description |
|------|-------------|
| **Identity Bar** | Avatar, username, rank badge, day streak counter, language toggle |
| **Hero Planet** | Animated planet that evolves visually as tasks are completed (4 stages) |
| **Today's Quests** | Clickable task checklist with XP rewards, burst animation on completion |
| **Progress Vault** | Alphabet (A–Z) and Number (1–10) tiles that unlock as you learn |
| **Navigation Portals** | Cards to enter Lessons, Games, Tests, and the Parents Portal |

**Rank progression:** ⭐ Star Cadet → 🚀 Galaxy Explorer → 🌌 Cosmic Master

### 📚 Lessons (9 modules)
| Module | Type | Description |
|--------|------|-------------|
| Alphabets | Sequential unlock | A–Z with tracing canvas (hit-detection progress bar) |
| Numbers | Sequential unlock | 1–10 with visual counting |
| Phonics Basics | Lesson | Letter-sound associations |
| Simple Words | Lesson | 2–3 letter word recognition |
| Sight Words | Lesson | Common word flashcards |
| Word Building | Lesson | Combine letters to form words |
| Sentences | Lesson | Simple sentence construction |
| Reading Practice | Lesson | Short sentence reading with word-by-word highlight + TTS |
| Listening & Matching | Lesson | Audio-driven image matching |

- **Sequential unlock** — each alphabet/number unlocks after completing the previous one
- **Alphabet Tracing** — interactive canvas with real hit-detection; 40% coverage = pass
- Completed lessons tracked with ⭐ badge and persisted across sessions

### 🎮 Games (6 mini-games)
| Game | Description |
|------|-------------|
| Memory Match | Match words to pictures |
| Letter Match | Match uppercase to lowercase |
| Sound Match | Listen and pick the right letter |
| Word Builder | Unscramble mixed-up words |
| Missing Letter | Fill in the blank |
| Quick Tap | Tap the matching picture as fast as you can |

### 📝 Tests (7 formal tests)
All tests open immediately (no lock) to reduce friction for young learners.
- Alphabet Test, Phonics Test, Simple Words, Sight Words, Word Building, Sentences, Reading Comprehension
- Each test tracks **score (pts) + date** — replaying updates the score
- Cumulative **XP** counter visible at the top of the Test Room

### 👨‍👩‍👧 Parents Portal (PIN-gated)
Accessible via the dashboard portal card (PIN: **1234**).

| Section | What it shows |
|---------|---------------|
| **Stats cards** | Total XP, Lessons completed, Games played, Tests mastered, Day streak |
| **Skill bars** | Real percentages computed from actual test scores and unlock progress |
| **Test History** | Table with test name, score, and date for every attempted test |
| **Insights** | Rule-based strength identification and recommended focus area |
| **Activity Timeline** | Timestamped log of up to 50 recent events (logins, completions, unlocks) |
| **Weekly Stars** | Stars earned from daily task completions in the current week |

### 🔊 Text-to-Speech (TTS)
- Every label, lesson card, task, and navigation item has a 🔊 button
- Prefers `en-IN Female` voice → Google UK English Female → Zira
- **Speed control**: 🐇 Normal (0.85×) / 🐢 Slow (0.6×)
- **Replay** last spoken text at any time from the floating controls

### 💾 Persistent Progress
All data is stored in `localStorage` via a centralised `storage.js` service:
- Daily tasks auto-reset each new calendar day
- Day streak increments on consecutive daily logins
- Weekly stars reset every Monday
- Alphabet/number unlock indices persist across sessions
- Session activity log maintained (up to 50 entries)

### 🎨 Design
- **Nunito** font — rounded letterforms with clear `b/d/p/q` distinction, ideal for dyslexia
- **Noto Sans Tamil** — proper Tamil script rendering
- Space theme: animated star field, flying rockets, launch transition animation
- Responsive sidebar navigation with hamburger menu

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 |
| Build tool | Vite 8 |
| Icons | Lucide React |
| Styling | Vanilla CSS (no Tailwind) |
| Fonts | Google Fonts — Nunito + Noto Sans Tamil |
| Persistence | `localStorage` (no backend) |
| Language | JavaScript (JSX) |

---

## 📁 Project Structure

```
src/
├── main.jsx                    # Entry point
├── App.jsx                     # Root: auth shell, TTS engine, sidebar, routing
├── App.css                     # All component styles (~45 KB)
├── index.css                   # Base reset, CSS variables, font config
│
├── services/
│   └── storage.js              # Central localStorage service (all data ops)
│
├── i18n/
│   └── translations.js         # EN + Tamil strings for all UI chrome
│
└── components/
    ├── Dashboard.jsx           # 4-zone gamified home screen
    ├── Lessons.jsx             # Lesson hub + alphabet/number viewer
    ├── Games.jsx               # Game hub
    ├── Tests.jsx               # Test hub
    ├── ParentsPortal.jsx       # Analytics & activity log
    │
    ├── lessons/                # 9 lesson sub-components
    │   ├── AlphabetTracing.jsx
    │   ├── PhonicsBasics.jsx
    │   ├── SimpleWords.jsx
    │   ├── SightWords.jsx
    │   ├── WordBuilding.jsx
    │   ├── SentenceFormation.jsx
    │   ├── ReadingPractice.jsx
    │   ├── ListeningMatching.jsx
    │   └── FunLearningGames.jsx
    │
    ├── games/                  # 6 mini-game sub-components
    │   ├── MemoryMatch.jsx
    │   ├── LetterMatch.jsx
    │   ├── SoundMatch.jsx
    │   ├── WordBuilderGame.jsx
    │   ├── MissingLetter.jsx
    │   └── QuickTap.jsx
    │
    └── tests/                  # 7 test sub-components
        ├── AlphabetTest.jsx
        ├── PhonicsTest.jsx
        ├── SimpleWordsTest.jsx
        ├── SightWordsTest.jsx
        ├── WordBuildingTest.jsx
        ├── SentenceTest.jsx
        └── ReadingComprehensionTest.jsx
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18 or higher
- **npm** v9 or higher

### Installation

```bash
# Clone the repository
git clone https://github.com/Kovendhan-B/DT-Dyslexia.git
cd DT-Dyslexia

# Install dependencies
npm install
```

### Running locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Building for production

```bash
npm run build
```

Output is in the `dist/` folder.

---

## 🧭 Usage Guide

### First Time Setup
1. Open the app — you'll see the **registration** screen
2. Enter a **Learner Name** and **Secret Code** (password)
3. Click **JOIN CREW!** → rocket launches → you land on the Dashboard

### Returning Users
1. Open the app — your name is pre-filled (one user per device)
2. Enter your Secret Code and click **BLAST OFF!**

### Navigation
- Use the **☰ hamburger menu** (top-left) to open the sidebar
- Navigate between **Dashboard**, **Lessons**, **Games**, **Tests**, and **Parents Portal**
- Or tap the **portal cards** at the bottom of the Dashboard

### Parents Portal Access
- Click the 👨‍👩‍👧 **Parents Portal** card on the Dashboard
- Enter PIN: **1234**
- View your child's full progress — skills, test history, and activity timeline

### Language Toggle
- In the identity bar (top of Dashboard), click the **EN / தமிழ்** pill
- The entire UI switches to Tamil instantly
- Click again to switch back

### TTS Controls (floating, top-right)
- **🔄 Replay** — replays the last spoken phrase
- **🐇 Normal / 🐢 Slow** — toggles speech speed

---

## 📦 localStorage Keys

All data persists in the browser's `localStorage` under these keys:

| Key | Contents |
|-----|----------|
| `dys_user` | `{ username, password }` |
| `dys_progress` | Full progress object (tasks, streak, unlocks, XP, scores, activity log) |

> To reset all data: open browser DevTools → Application → Local Storage → clear `dys_user` and `dys_progress`.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "Add your feature"`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

This project was built as part of the **DTI (Design Thinking & Innovation)** programme.
