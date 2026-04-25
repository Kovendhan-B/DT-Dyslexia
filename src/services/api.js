import { supabase } from './supabaseClient';

const API_BASE = 'http://127.0.0.1:8000/api';

/**
 * Helper to fetch with the current Supabase JWT token automatically attached.
 */
async function fetchWithAuth(endpoint, options = {}) {
  const { data: { session }, error } = await supabase.auth.getSession();
  
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (session?.access_token) {
    headers['Authorization'] = `Bearer ${session.access_token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.detail || err.error || `API Error: ${response.status}`);
  }

  return response.json();
}

// ─── Progress API ────────────────────────────────────────────────────────────

export async function fetchProgress() {
  return fetchWithAuth('/progress/');
}

export async function updateProgress(patch) {
  return fetchWithAuth('/progress/', {
    method: 'PUT',
    body: JSON.stringify(patch)
  });
}

// ─── Activities API ────────────────────────────────────────────────────────

export async function logTestResult(testId, score, maxScore = 100) {
  return fetchWithAuth('/activities/test/', {
    method: 'POST',
    body: JSON.stringify({ test_id: testId, score, max_score: maxScore })
  });
}

export async function logGamePlayed(gameId, score = null) {
  return fetchWithAuth('/activities/game/', {
    method: 'POST',
    body: JSON.stringify({ game_id: gameId, score })
  });
}

export async function logLessonCompleted(lessonId) {
  return fetchWithAuth('/activities/lesson/', {
    method: 'POST',
    body: JSON.stringify({ lesson_id: lessonId })
  });
}

export async function toggleDailyTask(taskId, currentStatus, starsReward) {
  return fetchWithAuth('/activities/task/', {
    method: 'POST',
    body: JSON.stringify({ task_key: taskId.toString(), completed: !currentStatus, stars_reward: starsReward })
  });
}

export async function logActivity(action, detail = '') {
  return fetchWithAuth('/activities/log/', {
    method: 'POST',
    body: JSON.stringify({ action, detail: String(detail) })
  });
}

export async function fetchMLPrediction() {
  return fetchWithAuth('/ml/predict/');
}

