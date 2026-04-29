from django.contrib import admin
from .models import ActivityLog, TestResult, LessonCompleted, GamePlayed, DailyTask

@admin.register(ActivityLog)
class ActivityLogAdmin(admin.ModelAdmin):
    list_display = ('profile', 'action', 'created_at')
    list_filter = ('action',)

@admin.register(TestResult)
class TestResultAdmin(admin.ModelAdmin):
    list_display = ('profile', 'test_id', 'score', 'completed_at')
    list_filter = ('test_id',)

@admin.register(LessonCompleted)
class LessonCompletedAdmin(admin.ModelAdmin):
    list_display = ('profile', 'lesson_id', 'completed_at')

@admin.register(GamePlayed)
class GamePlayedAdmin(admin.ModelAdmin):
    list_display = ('profile', 'game_id', 'score', 'played_at')

@admin.register(DailyTask)
class DailyTaskAdmin(admin.ModelAdmin):
    list_display = ('profile', 'task_key', 'completed', 'reset_date')
    list_filter = ('completed', 'reset_date')
