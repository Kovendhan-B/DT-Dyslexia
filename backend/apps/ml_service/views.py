import os
import pickle
import pandas as pd
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
from apps.profiles.models import Profile
from apps.activities.models import TestResult, ActivityLog, GamePlayed

class PredictDyslexiaRisk(APIView):
    def get(self, request):
        user_id = request.user.id
        
        try:
            profile = Profile.objects.get(id=user_id)
        except Profile.DoesNotExist:
            return Response({"error": "Profile not found"}, status=status.HTTP_404_NOT_FOUND)

        # Build feature vector from real DB data
        
        # 1. Test Scores
        tests = TestResult.objects.filter(profile_id=user_id).order_by('test_id', '-completed_at').distinct('test_id')
        scores = {t.test_id: t.score for t in tests}
        
        # 2. Game Completion Rate
        games_played_count = GamePlayed.objects.filter(profile_id=user_id).count()
        game_completion_rate = min(games_played_count / 6.0, 1.0)
        
        # 3. Activity Log stats (simulated recent interaction)
        session_count_7d = ActivityLog.objects.filter(profile_id=user_id).count() # Simplify for now
        
        features = {
            'phonics_score': scores.get('phonics', 0),
            'reading_score': scores.get('reading', 0),
            'alphabet_score': scores.get('alphabet', 0),
            'sightwords_score': scores.get('sightwords', 0),
            'wordbuilding_score': scores.get('wordbuilding', 0),
            'game_completion_rate': game_completion_rate,
            'streak_count': profile.streak_count,
            'session_count_7d': session_count_7d,
            'avg_session_gap_days': 1.0, # Simplification
            'unlocked_alpha_pct': (profile.unlocked_alpha_count / 26.0) if profile.unlocked_alpha_count else 0.0
        }
        
        # Format for XGBoost
        df = pd.DataFrame([features])
        
        model_path = os.path.join(settings.BASE_DIR, 'ml_model', 'model.pkl')
        if not os.path.exists(model_path):
            # Fallback if model isn't built yet
            return Response({
                "risk_level": "moderate",
                "confidence": 0.5,
                "recommendation": "Model not trained yet. Defaulting to moderate risk plan.",
                "source": "fallback"
            })
            
        with open(model_path, 'rb') as f:
            model = pickle.load(f)
            
        prediction_probs = model.predict_proba(df)[0]
        predicted_class = prediction_probs.argmax()
        confidence = prediction_probs[predicted_class]
        
        risk_map = {0: "low", 1: "moderate", 2: "high"}
        recommendations = {
            0: "Excellent progress! Continue with reading practice and word building.",
            1: "Focus on phonics exercises and listening games daily.",
            2: "Start with Alphabet Tracing and Phonics Basics. Short daily sessions work best."
        }
        
        return Response({
            "risk_level": risk_map[predicted_class],
            "confidence": float(confidence),
            "recommendation": recommendations[predicted_class],
            "source": "xgb_model"
        })
