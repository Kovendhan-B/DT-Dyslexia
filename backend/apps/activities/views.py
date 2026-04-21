from rest_framework.views import APIView
from rest_framework.response import Response
from apps.activities.models import TestResult, GamePlayed, LessonCompleted
from apps.profiles.models import Profile

class LogTestResult(APIView):
    def post(self, request):
        TestResult.objects.create(
            profile_id=request.user.id,
            test_id=request.data.get('test_id'),
            score=request.data.get('score', 0),
            max_score=request.data.get('max_score', 100)
        )
        return Response({"status": "ok"})

class LogGamePlayed(APIView):
    def post(self, request):
        GamePlayed.objects.create(
            profile_id=request.user.id,
            game_id=request.data.get('game_id'),
            score=request.data.get('score', 0)
        )
        return Response({"status": "ok"})

class LogLessonCompleted(APIView):
    def post(self, request):
        LessonCompleted.objects.create(
            profile_id=request.user.id,
            lesson_id=request.data.get('lesson_id')
        )
        return Response({"status": "ok"})
