from django.urls import path
from apps.activities.views import LogTestResult, LogGamePlayed, LogLessonCompleted

urlpatterns = [
    path('test/', LogTestResult.as_view(), name='log-test'),
    path('game/', LogGamePlayed.as_view(), name='log-game'),
    path('lesson/', LogLessonCompleted.as_view(), name='log-lesson'),
]
