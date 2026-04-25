from django.urls import path
from apps.activities.views import LogTestResult, LogGamePlayed, LogLessonCompleted, LogActivity, ToggleDailyTask

urlpatterns = [
    path('test/',     LogTestResult.as_view(),    name='log-test'),
    path('game/',     LogGamePlayed.as_view(),     name='log-game'),
    path('lesson/',   LogLessonCompleted.as_view(),name='log-lesson'),
    path('log/',      LogActivity.as_view(),        name='log-activity'),
    path('task/',     ToggleDailyTask.as_view(),    name='toggle-task'),
]
