# Dys-Learn (DT-Dyslexia) Project Documentation

## 1. Executive Summary
Dys-Learn (DT-Dyslexia) is a comprehensive, accessibility-first web application designed specifically for children with dyslexia to improve their English literacy. Built as a dual-language (English and Tamil) platform, the system uses an engaging "Space Exploration" theme to gamify learning and reduce cognitive load. The platform integrates a modern React frontend with a Django REST backend, featuring an XGBoost Machine Learning pipeline that predicts dyslexia risk levels based on learning patterns. This documentation provides a deep dive into the engineering, pedagogical, and accessibility dimensions of the platform, serving as a comprehensive context for research in Inclusive Education.

## 2. Project Context & Motivation
### 2.1 The Problem: Dyslexia in Children
Dyslexia is a specific learning disability that is neurobiological in origin. It is characterized by difficulties with accurate and/or fluent word recognition and by poor spelling and decoding abilities. Traditional learning management systems (LMS) often exacerbate these issues by presenting text-heavy interfaces, tight time constraints, and lack of auditory feedback.

### 2.2 Inclusive Education Focus
The core motivation of Dys-Learn is to provide an inclusive educational environment. By tailoring the user interface and learning pathways to accommodate neurodivergent needs, Dys-Learn bridges the gap between conventional educational tools and accessible design.

### 2.3 Design Thinking & Innovation (DTI) Origin
The project originated within the Design Thinking & Innovation (DTI) programme. The approach involved empathizing with dyslexic learners, defining their core struggles (e.g., visual crowding, phonological processing), and ideating a solution that masks rigorous learning behind a playful, low-pressure gamified interface.

## 3. Product Description
### 3.1 Target Users
- **Primary Users:** Children aged 5–12 with dyslexia or early signs of reading difficulties.
- **Secondary Users:** Parents and educators who monitor progress and receive actionable, data-driven insights.

### 3.2 Core Product Philosophy (Accessibility-First)
The platform is designed to minimize visual stress and maximize engagement. Text is spaced comfortably, colors are chosen for high contrast without being harsh, and every text element is accompanied by a Text-to-Speech (TTS) option.

### 3.3 Pedagogical Approach
Dys-Learn employs a multi-sensory learning approach:
- **Visual:** Image-word associations and tracing.
- **Auditory:** Pronunciation guides and TTS support.
- **Kinesthetic:** Interactive games like tracing, dragging, and tapping.

### 3.4 Space Exploration Theme
To alleviate the anxiety typically associated with testing and learning, the platform is framed as a "Space Exploration" mission. Users are "Space Explorers," tests are "Quests," and progression is visually represented by a dynamic "Hero Planet" that evolves as tasks are completed.

## 4. Full Feature Inventory
### 4.1 Authentication & User Management
- Secure authentication via Supabase (JWT-based).
- Individual learner profiles that track specific progress metrics, streaks, and XP independently.

### 4.2 Bilingual Interface
- Real-time toggling between English (EN) and Tamil (TA) UI via an intuitive language switcher.
- **Pedagogical rule:** The UI chrome (buttons, instructions) translates to Tamil, but the core subject matter (English letters/words) remains in English to ensure learning objectives are met.

### 4.3 Dashboard — "My Learning Planet"
- **Identity Bar:** Displays the user's avatar, rank (Star Cadet -> Galaxy Explorer -> Cosmic Master), and daily streak.
- **XP Ring & Hero Planet:** A dynamic ring chart and planet graphic that fill up based on the completion of daily tasks.
- **Today's Quests:** A checklist of 3 daily tasks with XP/star rewards and burst animations upon completion.
- **Progress Vault:** A grid of A-Z alphabets and 1-10 numbers that physically unlock as the user progresses through modules.

### 4.4 Lessons (9 Modules)
1. **Alphabets:** A-Z with visual associations. Includes an interactive Alphabet Tracing canvas with hit-detection.
2. **Numbers:** Counting 1-10.
3. **Phonics Basics:** Letter-sound associations.
4. **Simple Words:** 2-3 letter word reading.
5. **Sight Words:** High-frequency word flashcards.
6. **Word Building:** Combining letters.
7. **Sentences:** Simple sentence structures.
8. **Reading Practice:** Short paragraph reading.
9. **Listening & Matching:** Auditory comprehension.

### 4.5 Games (6 Mini-Games)
1. Memory Match
2. Letter Match
3. Sound Match
4. Word Builder
5. Missing Letter
6. Quick Tap

### 4.6 Tests (7 Formal Assessments)
Assessments evaluate Alphabet knowledge, Phonics, Simple Words, Sight Words, Word Building, Sentences, and Reading Comprehension. Scores are securely logged to the backend to feed the ML pipeline.

### 4.7 Parents Portal
- PIN-gated area.
- Displays comprehensive analytics: Core Skill Development bars (Reading, Writing, Auditory, Memory), identified strengths, recommended focus areas, recent activity timeline, and test history.

### 4.8 Text-to-Speech (TTS) Subsystem
Implemented globally using the Web Speech API. Every interactive element features a speaker icon, with globally configurable speech speed (Normal / Slow) tailored for dyslexic processing speeds.

## 5. System Architecture
### 5.1 High-Level Architecture
The system follows a decoupled client-server architecture:
- **Client:** React Single Page Application (SPA) handling UI, TTS, gamification state, and localized storage.
- **Server:** Django REST API handling data persistence, activity logging, progress synchronization, and ML inference.
- **Database/Auth:** Supabase providing PostgreSQL storage and JWT authentication.

### 5.2 Technology Stack
- **Frontend:** React 19, Vite 8, Vanilla CSS (modularized), Lucide React (icons), Web Speech API.
- **Backend:** Django 5.0.4, Django REST Framework (DRF), Python 3.10+.
- **Machine Learning:** XGBoost, Pandas, Scikit-learn.
- **Database & Identity:** Supabase (PostgreSQL).

### 5.3 Deployment Topology
During development, the frontend runs on Vite's dev server (`localhost:5173`), communicating via REST to the Django development server (`localhost:8000`), which in turn interfaces with the remote Supabase instance via connection strings.

## 6. Frontend Architecture
### 6.1 Project Structure
The `src/` directory is organized into:
- `components/`: Modular React components (`Dashboard.jsx`, `Lessons.jsx`, `Games.jsx`, etc.)
- `services/`: API adapters (`api.js`), local storage management (`storage.js`), and Supabase clients.
- `i18n/`: Translation dictionaries (`translations.js`).

### 6.2 Root Component (`App.jsx`)
Acts as the central state machine. It manages the user session, holds the global `progress` object, handles the login/registration forms with space-themed launch animations, and orchestrates the Text-to-Speech voices and global volume/speed controls.

### 6.3 i18n System
A custom dictionary-based translation system. The `t(lang, key)` function retrieves strings based on the active language state (`en` or `ta`), with fallbacks to English. It supports over 170 keys per language covering all UI chrome.

### 6.4 Service Layer
- `storage.js`: Abstracts `localStorage` with sensible defaults. Handles streak computation and daily/weekly task reset logic based on date differentials.
- `api.js`: Wrapper around `fetch` that automatically attaches the Supabase JWT token to the `Authorization: Bearer` header for all requests to the Django backend.

## 7. Backend Architecture
### 7.1 Django App Structure
The `backend/` directory is split into specialized apps:
- `authentication`: Custom JWT decoding.
- `profiles`: User progress and state.
- `activities`: Logging tests, games, and daily tasks.
- `dashboard`: Aggregation endpoints.
- `ml_service`: XGBoost model inference.

### 7.2 Django Apps in Detail
- **Authentication:** Uses a custom `SupabaseJWTAuthentication` class extending DRF's `BaseAuthentication`. It decodes the JWT locally (bypassing signature verification as Supabase uses ES256 asymmetric keys) and creates an `AnonymousUserWithID` proxy object linked to the Supabase UID.
- **Profiles:** Provides `GET/PUT /progress/` endpoints. Automatically creates a database row for a new UID upon first request. Stores XP, weekly stars, streak counts, and unlocked item indices.
- **Activities:** Receives granular telemetry from the frontend (`LogTestResult`, `LogGamePlayed`, `LogLessonCompleted`, `DailyTask`).
- **ML Service:** Exposes the `/ml/predict/` endpoint to evaluate a user's risk level based on aggregated activity data.

## 8. Database Schema
Defined in Django ORM, the core models are:

1. **Profile:** `id` (UUID matching Supabase), `username`, `total_xp`, `weekly_stars`, `streak_count`, `last_login_date`, `unlocked_alpha_count`, `unlocked_num_count`.
2. **ActivityLog:** `profile` (FK), `action` (string), `detail` (string), `created_at`.
3. **TestResult:** `profile` (FK), `test_id` (string), `score` (int), `max_score` (int), `completed_at`.
4. **LessonCompleted:** `profile` (FK), `lesson_id` (string), `completed_at`.
5. **GamePlayed:** `profile` (FK), `game_id` (string), `score` (int), `played_at`.
6. **DailyTask:** `profile` (FK), `task_key` (string), `completed` (boolean), `reset_date` (date). Unique constraint on `(profile, task_key, reset_date)`.

## 9. API Reference
Key endpoints utilized by the frontend:
- `GET /api/progress/`: Fetch user progress.
- `PUT /api/progress/`: Patch user progress (e.g., XP updates).
- `POST /api/activities/test/`: Log test completion and score.
- `POST /api/activities/game/`: Log game completion.
- `POST /api/activities/lesson/`: Log lesson completion.
- `POST /api/activities/task/`: Toggle daily task status.
- `GET /api/ml/predict/`: Trigger ML risk assessment.

## 10. Machine Learning Pipeline
### 10.1 Problem Framing
The system predicts the risk of dyslexia (Low, Moderate, High) to provide early, actionable feedback to parents. It is modeled as a multi-class classification problem based on the user's interaction telemetry.

### 10.2 Synthetic Data Generation (`data_gen.py`)
To bootstrap the model, a Python script generates 1,500 rows of synthetic data. It creates distinct profiles (high risk vs. low risk) with injected statistical noise across features like phonics scores, game completion rates, streak counts, and session gaps.

### 10.3 Model Architecture
The pipeline utilizes an `XGBClassifier` (XGBoost) configured for multi-class soft probability (`multi:softprob`). Hyperparameters include:
- `num_class`: 3
- `n_estimators`: 100
- `learning_rate`: 0.1
- `max_depth`: 4

### 10.4 Inference in Production (`views.py`)
When the Parents Portal requests an assessment, the backend dynamically builds a feature vector from the user's real database records (averaging test scores, calculating game completion rates, evaluating 7-day session frequency). This vector is passed to the pickled XGBoost model, returning a risk classification and a confidence score.

### 10.5 Recommendations
Based on the predicted class, the system outputs tailored advice:
- **Low (0):** Continue with reading practice and word building.
- **Moderate (1):** Focus on phonics exercises and listening games.
- **High (2):** Start with foundational Alphabet Tracing and Phonics Basics in short sessions.

## 11. Gamification & Progression System
### 11.1 XP & Stars
Every action grants XP (Experience Points) and Stars. XP contributes to overall planetary progression, while Stars are a weekly metric that resets every Monday to maintain short-term motivation.

### 11.2 Rank System
User ranks evolve based on the number of completed quests:
- 0-5 quests: Star Cadet
- 6-15 quests: Galaxy Explorer
- 16+ quests: Cosmic Master

### 11.3 Progress Vault
A visual representation of knowledge acquisition. The A-Z and 1-10 tiles start as locked (🔒). As the user interacts with specific modules, the `unlockedAlpha` and `unlockedNum` state integers increment, revealing the characters and making them interactive (clickable for TTS).

### 11.4 Streak System
Computed dynamically upon login by comparing the current date against `lastLoginDate`. Consistent daily logins increment the streak, which is prominently displayed with a fire emoji (🔥) to encourage daily practice.

## 12. Accessibility Design
### 12.1 Text-to-Speech (TTS)
Centralized in `App.jsx`, the TTS system uses the browser's `window.speechSynthesis`. It attempts to select clear, regionalized female voices (e.g., 'en-IN'). The speed is globally toggleable between 0.85 (Normal) and 0.6 (Slow), catering to varying auditory processing speeds.

### 12.2 UI Decisions
- **Typography:** Uses sans-serif fonts (Nunito and Noto Sans Tamil) which are generally easier for dyslexic readers to parse.
- **Spacing:** Generous line heights and padding to prevent visual crowding.
- **Color Palette:** Avoids pure white backgrounds; utilizes soft off-whites, deep space blues, and high-contrast pastel accents to reduce glare and visual stress.

## 13. Security Architecture
### 13.1 JWT Flow
The frontend authenticates directly with Supabase, receiving an active session. The `access_token` is attached to all Django API requests. The Django backend statelessly decodes the JWT to establish the user's identity, ensuring secure, decoupled authentication.

### 13.2 Parents PIN Gate
To prevent children from accidentally accessing complex analytics or altering settings, the Parents Portal is protected by a numeric keypad modal requiring a specific PIN before entry.

## 14. Limitations & Future Work
- **ML Data Reality:** The current XGBoost model relies on synthetic heuristics. Future iterations require clinical trials to train the model on real-world neurodivergent telemetry.
- **Tracing Robustness:** The alphabet tracing hit-detection uses basic coordinate bounding; implementing dynamic time warping (DTW) algorithms would provide better stroke analysis.
- **Expanded Languages:** The i18n system is extensible; adding Hindi or Spanish would widen the inclusive reach.
