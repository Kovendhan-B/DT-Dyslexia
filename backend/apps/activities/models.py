from django.db import models
from apps.profiles.models import Profile

class ActivityLog(models.Model):
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='activities')
    action = models.CharField(max_length=50) # 'login', 'task_complete', etc.
    detail = models.CharField(max_length=200, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

class TestResult(models.Model):
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='test_results')
    test_id = models.CharField(max_length=50) # 'phonics', 'alphabet', etc.
    score = models.IntegerField()
    max_score = models.IntegerField(default=100)
    completed_at = models.DateTimeField(auto_now_add=True)

    @property
    def percentage(self):
        return (self.score / self.max_score) * 100 if self.max_score > 0 else 0

class LessonCompleted(models.Model):
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='completed_lessons')
    lesson_id = models.CharField(max_length=50)
    completed_at = models.DateTimeField(auto_now_add=True)

class GamePlayed(models.Model):
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='games_played')
    game_id = models.CharField(max_length=50)
    score = models.IntegerField(null=True, blank=True)
    played_at = models.DateTimeField(auto_now_add=True)

class DailyTask(models.Model):
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='daily_tasks')
    task_key = models.CharField(max_length=50)
    completed = models.BooleanField(default=False)
    reset_date = models.DateField()

    class Meta:
        unique_together = ('profile', 'task_key', 'reset_date')
