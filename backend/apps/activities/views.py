from rest_framework.views import APIView
from rest_framework.response import Response
from apps.activities.models import TestResult, GamePlayed, LessonCompleted, ActivityLog
from apps.profiles.models import Profile


def _log(profile, action, detail=''):
    """Helper: write an ActivityLog entry for this profile."""
    ActivityLog.objects.create(profile=profile, action=action, detail=detail)


class LogTestResult(APIView):
    def post(self, request):
        profile, _ = Profile.objects.get_or_create(id=request.user.id)
        test_id = request.data.get('test_id', '')
        score   = request.data.get('score', 0)
        TestResult.objects.create(
            profile=profile,
            test_id=test_id,
            score=score,
            max_score=request.data.get('max_score', 100)
        )
        _log(profile, 'test_complete', f'{test_id}:{score}pts')
        return Response({'status': 'ok'})


class LogGamePlayed(APIView):
    def post(self, request):
        profile, _ = Profile.objects.get_or_create(id=request.user.id)
        game_id = request.data.get('game_id', '')
        score   = request.data.get('score', 0)
        GamePlayed.objects.create(profile=profile, game_id=game_id, score=score)
        _log(profile, 'game_complete', game_id)
        return Response({'status': 'ok'})


class LogLessonCompleted(APIView):
    def post(self, request):
        profile, _ = Profile.objects.get_or_create(id=request.user.id)
        lesson_id = request.data.get('lesson_id', '')
        LessonCompleted.objects.create(profile=profile, lesson_id=lesson_id)
        _log(profile, 'lesson_complete', lesson_id)
        return Response({'status': 'ok'})


class LogActivity(APIView):
    """Generic activity logger — used for tracing_complete, alphabet_unlocked, etc."""
    def post(self, request):
        profile, _ = Profile.objects.get_or_create(id=request.user.id)
        action = request.data.get('action', 'unknown')
        detail = request.data.get('detail', '')
        _log(profile, action, detail)
        return Response({'status': 'ok'})


class ToggleDailyTask(APIView):
    def post(self, request):
        from apps.activities.models import DailyTask
        from django.utils import timezone

        profile, _ = Profile.objects.get_or_create(id=request.user.id)
        task_key    = str(request.data.get('task_key', ''))
        completed   = request.data.get('completed', False)
        stars_reward = request.data.get('stars_reward', 0)
        today       = timezone.now().date()

        task, _ = DailyTask.objects.get_or_create(
            profile=profile, task_key=task_key, reset_date=today
        )
        task.completed = completed
        task.save()

        if completed:
            profile.total_xp    += stars_reward * 10
            profile.weekly_stars += stars_reward
            profile.save()
            _log(profile, 'task_complete', f'task_{task_key}')

        return Response({'status': 'ok'})
