// ─── Central Storage Service ───────────────────────────────────────────────
// ALL localStorage access goes through this file.
// No component should call localStorage directly.

const KEYS = {
  USER:     'dys_user',
  PROGRESS: 'dys_progress',
};

// ─── Default daily tasks ───────────────────────────────────────────────────
export const DEFAULT_DAILY_TASKS = [
  { id: 1, title: 'Play 1 Alphabet Game',   completed: false, starsReward: 3 },
  { id: 2, title: 'Count 10 Stars',          completed: false, starsReward: 2 },
  { id: 3, title: 'Read your first word',    completed: false, starsReward: 5 },
];

// ─── Default progress snapshot ─────────────────────────────────────────────
export const DEFAULT_PROGRESS = {
  dailyTasks:           [...DEFAULT_DAILY_TASKS],
  lastTaskResetDate:    null,            // YYYY-MM-DD — date tasks were last reset
  streak:               { count: 0, lastLoginDate: null },
  lessonsCompleted:     [],              // string[] of category IDs
  unlockedAlpha:        0,              // index of highest unlocked alphabet entry
  unlockedNum:          0,              // index of highest unlocked number entry
  gamesCompleted:       [],              // string[] of game IDs
  testsCompleted:       [],              // [{ id, score, date }]
  totalXP:              0,
  weeklyStars:          0,
  weeklyStarsResetDate: null,            // YYYY-MM-DD of Monday of current week
  sessionLog:           [],              // [{ action, detail, date }] last 50
};

// ══════════════════════════════════════════════════════════════════════════════
// USER PROFILE
// ══════════════════════════════════════════════════════════════════════════════

/** Returns the stored user object, or null if no user is registered. */
export function getUser() {
  try {
    return JSON.parse(localStorage.getItem(KEYS.USER)) || null;
  } catch { return null; }
}

/** Persists a user profile object. */
export function saveUser(user) {
  localStorage.setItem(KEYS.USER, JSON.stringify(user));
}

/** Removes all user + progress data (full logout/reset). */
export function clearAllData() {
  localStorage.removeItem(KEYS.USER);
  localStorage.removeItem(KEYS.PROGRESS);
}

// ══════════════════════════════════════════════════════════════════════════════
// PROGRESS
// ══════════════════════════════════════════════════════════════════════════════

/** Returns the full progress object, merged with defaults so new fields are safe. */
export function getProgress() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEYS.PROGRESS));
    return raw ? { ...DEFAULT_PROGRESS, ...raw } : { ...DEFAULT_PROGRESS };
  } catch { return { ...DEFAULT_PROGRESS }; }
}

/** Overwrites the entire progress object. */
export function saveProgress(progress) {
  localStorage.setItem(KEYS.PROGRESS, JSON.stringify(progress));
}

/** Merges a patch into the existing progress and saves. Returns the new progress. */
export function updateProgress(patch) {
  const current = getProgress();
  const updated = { ...current, ...patch };
  saveProgress(updated);
  return updated;
}

// ══════════════════════════════════════════════════════════════════════════════
// STREAK LOGIC
// ══════════════════════════════════════════════════════════════════════════════

const todayStr = () => new Date().toISOString().slice(0, 10);

const yesterdayStr = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
};

/**
 * Computes the new streak and updates lastLoginDate.
 * Call this on every login. Returns the modified progress object (not saved).
 */
export function computeAndUpdateStreak(progress) {
  const today = todayStr();
  const { lastLoginDate, count } = progress.streak || { lastLoginDate: null, count: 0 };

  if (lastLoginDate === today) return progress; // Already logged in today

  const newCount = lastLoginDate === yesterdayStr() ? count + 1 : 1;
  return {
    ...progress,
    streak: { count: newCount, lastLoginDate: today },
  };
}

// ══════════════════════════════════════════════════════════════════════════════
// DAILY TASK RESET
// ══════════════════════════════════════════════════════════════════════════════

/**
 * If it's a new calendar day since tasks were last reset, reset them.
 * Returns the (possibly modified) progress. Not saved — caller must saveProgress.
 */
export function resetTasksIfNewDay(progress) {
  const today = todayStr();
  if (progress.lastTaskResetDate === today) return progress;
  return {
    ...progress,
    dailyTasks: DEFAULT_DAILY_TASKS.map(t => ({ ...t, completed: false })),
    lastTaskResetDate: today,
  };
}

// ══════════════════════════════════════════════════════════════════════════════
// WEEKLY STARS RESET
// ══════════════════════════════════════════════════════════════════════════════

function getMondayKey() {
  const today = new Date();
  const day = today.getDay(); // 0 = Sun
  const diff = day === 0 ? -6 : 1 - day;
  const monday = new Date(today);
  monday.setDate(today.getDate() + diff);
  return monday.toISOString().slice(0, 10);
}

/**
 * Resets weeklyStars to 0 if we've moved into a new week.
 * Returns (possibly modified) progress. Not saved — caller must saveProgress.
 */
export function resetWeeklyStarsIfNewWeek(progress) {
  const weekKey = getMondayKey();
  if (progress.weeklyStarsResetDate === weekKey) return progress;
  return { ...progress, weeklyStars: 0, weeklyStarsResetDate: weekKey };
}

// ══════════════════════════════════════════════════════════════════════════════
// ACTIVITY LOGGING
// ══════════════════════════════════════════════════════════════════════════════

/**
 * Prepends an activity entry to sessionLog (max 50 entries).
 * Saves to storage immediately.
 */
export function logActivity(action, detail) {
  const progress = getProgress();
  const entry = { action, detail, date: new Date().toISOString() };
  const sessionLog = [entry, ...(progress.sessionLog || [])].slice(0, 50);
  saveProgress({ ...progress, sessionLog });
}
