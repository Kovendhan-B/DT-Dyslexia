from rest_framework.views import APIView
from rest_framework.response import Response
from apps.profiles.models import Profile

# Default structure returning progress
def get_default_progress(profile):
    return {
        "dailyTasks": [
            { "id": 1, "title": 'Play 1 Alphabet Game', "completed": False, "starsReward": 3 },
            { "id": 2, "title": 'Count 10 Stars', "completed": False, "starsReward": 2 },
            { "id": 3, "title": 'Read your first word', "completed": False, "starsReward": 5 },
        ],
        "lastTaskResetDate": profile.last_task_reset,
        "streak": { "count": profile.streak_count, "lastLoginDate": profile.last_login_date },
        "totalXP": profile.total_xp,
        "weeklyStars": profile.weekly_stars,
        "unlockedAlpha": profile.unlocked_alpha_count,
        "unlockedNum": profile.unlocked_num_count,
        "language": profile.language,
    }

class ProgressAPI(APIView):
    def get(self, request):
        profile, created = Profile.objects.get_or_create(
            id=request.user.id,
            defaults={'username': request.user.email.split('@')[0]}
        )
        return Response(get_default_progress(profile))

    def put(self, request):
        profile, _ = Profile.objects.get_or_create(id=request.user.id)
        
        # Patching progress logic
        patch = request.data
        if 'language' in patch:
            profile.language = patch['language']
        if 'totalXP' in patch:
            profile.total_xp = patch['totalXP']
        if 'weeklyStars' in patch:
            profile.weekly_stars = patch['weeklyStars']
            
        profile.save()
        return Response(get_default_progress(profile))
