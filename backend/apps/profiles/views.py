from rest_framework.views import APIView
from rest_framework.response import Response
from django.utils import timezone
from apps.profiles.models import Profile
from apps.activities.models import TestResult, GamePlayed, LessonCompleted, ActivityLog, DailyTask

DAILY_TASK_DEFAULTS = [
    { "id": 1, "title": 'Play 1 Alphabet Game', "starsReward": 3 },
    { "id": 2, "title": 'Count 10 Stars',       "starsReward": 2 },
    { "id": 3, "title": 'Read your first word', "starsReward": 5 },
]

def build_full_progress(profile):
    """Build the complete progress object including all activity data from the DB."""

    # --- Daily tasks: read today's completion from DB ---
    today = timezone.now().date()
    completed_task_keys = set(
        DailyTask.objects.filter(profile=profile, reset_date=today, completed=True)
        .values_list('task_key', flat=True)
    )
    daily_tasks = [
        {
            "id":          t["id"],
            "title":       t["title"],
            "completed":   str(t["id"]) in completed_task_keys,
            "starsReward": t["starsReward"],
        }
        for t in DAILY_TASK_DEFAULTS
    ]

    # --- Lessons ---
    completed_lessons = list(
        LessonCompleted.objects.filter(profile=profile)
        .values_list('lesson_id', flat=True)
        .distinct()
    )

    # --- Games ---
    completed_games = list(
        GamePlayed.objects.filter(profile=profile)
        .values_list('game_id', flat=True)
        .distinct()
    )

    # --- Tests: latest score per test ---
    tests_qs = (
        TestResult.objects.filter(profile=profile)
        .order_by('test_id', '-completed_at')
    )
    seen = set()
    tests_completed = []
    for t in tests_qs:
        if t.test_id not in seen:
            seen.add(t.test_id)
            tests_completed.append({
                'id':    t.test_id,
                'score': t.score,
                'date':  t.completed_at.strftime('%Y-%m-%d'),
            })

    # --- Activity log (last 50) ---
    logs = ActivityLog.objects.filter(profile=profile).order_by('-created_at')[:50]
    session_log = [
        {'action': l.action, 'detail': l.detail or '', 'date': l.created_at.isoformat()}
        for l in logs
    ]

    return {
        "dailyTasks":        daily_tasks,
        "lastTaskResetDate": str(today),

        "streak":            { "count": profile.streak_count, "lastLoginDate": str(profile.last_login_date) if profile.last_login_date else None },
        "totalXP":           profile.total_xp,
        "weeklyStars":       profile.weekly_stars,
        "unlockedAlpha":     profile.unlocked_alpha_count,
        "unlockedNum":       profile.unlocked_num_count,
        "language":          profile.language,
        "lessonsCompleted":  completed_lessons,
        "gamesCompleted":    completed_games,
        "testsCompleted":    tests_completed,
        "sessionLog":        session_log,
    }


class ProgressAPI(APIView):
    def get(self, request):
        profile, _ = Profile.objects.get_or_create(
            id=request.user.id,
            defaults={'username': request.user.email.split('@')[0]}
        )
        return Response(build_full_progress(profile))

    def put(self, request):
        profile, _ = Profile.objects.get_or_create(id=request.user.id)

        patch = request.data
        if 'language' in patch:
            profile.language = patch['language']
        if 'totalXP' in patch:
            profile.total_xp = patch['totalXP']
        if 'weeklyStars' in patch:
            profile.weekly_stars = patch['weeklyStars']
        if 'unlockedAlpha' in patch:
            profile.unlocked_alpha_count = patch['unlockedAlpha']
        if 'unlockedNum' in patch:
            profile.unlocked_num_count = patch['unlockedNum']
        if 'streak' in patch:
            s = patch['streak']
            profile.streak_count = s.get('count', profile.streak_count)
            from django.utils.dateparse import parse_date
            if s.get('lastLoginDate'):
                profile.last_login_date = parse_date(s['lastLoginDate'])

        profile.save()
        return Response(build_full_progress(profile))
