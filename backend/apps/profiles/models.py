from django.db import models
from django.utils import timezone
import uuid

class Profile(models.Model):
    # This ID matches the Supabase Auth UUID (one-to-one relationship)
    id = models.UUIDField(primary_key=True, editable=False)
    
    username = models.CharField(max_length=50, blank=True)
    avatar_url = models.URLField(max_length=500, blank=True, null=True)
    language = models.CharField(max_length=10, default='en')
    
    # Progress Data
    total_xp = models.IntegerField(default=0)
    weekly_stars = models.IntegerField(default=0)
    streak_count = models.IntegerField(default=0)
    
    # Analytics / Dates
    last_login_date = models.DateField(null=True, blank=True)
    last_task_reset = models.DateField(null=True, blank=True)
    weekly_stars_reset = models.DateField(null=True, blank=True)
    
    # State tracking
    unlocked_alpha_count = models.IntegerField(default=0)
    unlocked_num_count = models.IntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Profile {self.id} ({self.username})"
