# 🚀 DT-Dyslexia (Dys-Learn) — Dyslexia Learning Platform

A child-facing, accessibility-first web application designed to help kids with dyslexia improve English literacy through guided lessons, interactive games, and formal tests — all wrapped in a fun **space exploration** theme. 

The project features a **React/Vite** frontend, a **Django REST Framework** backend, **Supabase** for authentication/database, and an **XGBoost Machine Learning model** for dyslexia risk prediction.

---

## ✨ Features

### 🔐 Auth & User Management
- Integrated with **Supabase Authentication**
- JWT-based authentication
- Secure profiles per learner with individual tracking

### 🌍 Bilingual UI (EN / தமிழ்)
- Toggle between **English** and **Tamil** UI from the Dashboard at any time
- All chrome (labels, navigation, zone headers, buttons, feedback messages) switches instantly
- **Taught content stays in English** — Tamil is the language of instruction, not the subject
- Tamil text rendered via **Noto Sans Tamil** font

### 🤖 ML-Powered Dyslexia Risk Prediction
- **XGBoost Model** analyzes learner performance (test scores, game completion rates, activity logs).
- Predicts risk levels (Low, Moderate, High) and generates actionable recommendations for parents.

### 🎮 Gamified Dashboard ("My Learning Planet")
- **Identity Bar**: Avatar, username, rank badge, day streak counter, language toggle
- **Hero Planet**: Animated planet that evolves visually as tasks are completed (4 stages)
- **Today's Quests**: Clickable task checklist with XP rewards, burst animation on completion
- **Progress Vault**: Alphabet (A–Z) and Number (1–10) tiles that unlock as you learn
- **Rank progression:** ⭐ Star Cadet → 🚀 Galaxy Explorer → 🌌 Cosmic Master

### 📚 Lessons (9 modules)
- Modules include: Alphabets, Numbers, Phonics Basics, Simple Words, Sight Words, Word Building, Sentences, Reading Practice, Listening & Matching.
- **Alphabet Tracing** — interactive canvas with real hit-detection; 40% coverage = pass

### 🎮 Games (6 mini-games)
- Memory Match, Letter Match, Sound Match, Word Builder, Missing Letter, Quick Tap.

### 📝 Tests (7 formal tests)
- Evaluates skills across alphabets, phonics, words, and reading comprehension.
- Scores are saved to the backend database to track progression over time.

### 👨‍👩‍👧 Parents Portal (PIN-gated)
- Accessible via the dashboard portal card.
- Displays computed analytics from actual user activity, test history, and AI-driven insights.

### 🔊 Text-to-Speech (TTS)
- Every label, lesson card, task, and navigation item has a 🔊 button with adjustable speeds.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 + Vite 8
- **Styling**: Vanilla CSS (No Tailwind)
- **Icons**: Lucide React
- **Fonts**: Google Fonts (Nunito + Noto Sans Tamil)

### Backend
- **Framework**: Django 5.0.4 + Django REST Framework
- **Database / Auth**: Supabase (PostgreSQL)
- **Machine Learning**: XGBoost, Pandas, Scikit-learn (Dyslexia Risk Prediction)

---

## 📁 Project Structure

```text
DT-Dyslexia/
├── backend/                    # Django REST API Backend
│   ├── apps/                   # Django apps
│   │   ├── activities/         # Handles test results, game stats, logs
│   │   ├── authentication/     # Supabase JWT Auth
│   │   ├── dashboard/          # Dashboard analytics APIs
│   │   ├── ml_service/         # ML Prediction views & XGBoost integration
│   │   └── profiles/           # User profiles & progress
│   ├── dyslearn/               # Django core settings
│   ├── ml_pipeline/            # Scripts to train the ML model
│   │   ├── data_gen.py         # Synthetic data generator
│   │   └── train.py            # XGBoost model training script
│   ├── manage.py
│   └── requirements.txt        # Python dependencies
│
├── src/                        # React Frontend
│   ├── components/             # React UI components (Lessons, Games, Tests)
│   ├── services/               # API & Storage services
│   ├── i18n/                   # Translations
│   ├── App.jsx                 # Root Component
│   └── main.jsx                # Entry point
│
├── package.json                # Frontend dependencies
└── vite.config.js              # Vite configuration
```

---

## 🚀 Quick Start Guide

### 1. Clone & Setup the Database
First, clone the repository to your computer:
```bash
git clone https://github.com/Kovendhan-B/DT-Dyslexia.git
cd DT-Dyslexia
```

Next, you need to connect the database. Create a `.env` file inside the `backend` directory.
*(Ask the repository owner for these keys, or create your own free project at [Supabase.com](https://supabase.com))*

```env
# backend/.env
DJANGO_SECRET_KEY=your_secret_key
SUPABASE_URL=your_supabase_project_url
SUPABASE_JWT_SECRET=your_supabase_jwt_secret
```

### 2. Run the Backend (Django)
Open a terminal in the `backend` folder:
```bash
# Activate virtual environment (Windows)
venv\Scripts\activate

# Install dependencies (first time only)
pip install -r requirements.txt

# Start the server
python manage.py runserver
```

### 3. Run the Frontend (React)
Open a **new** terminal in the main project folder:
```bash
# Install dependencies (first time only)
npm install

# Start the app
npm run dev
```

### 4. Play!
For the best experience (including high-quality Indian English Text-to-Speech), open **Microsoft Edge** and navigate to:
👉 **[http://localhost:5173](http://localhost:5173)**

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
