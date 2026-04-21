from django.contrib import admin
from django.urls import path, include
from apps.ml_service.views import PredictDyslexiaRisk

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/ml/predict/', PredictDyslexiaRisk.as_view(), name='predict-risk'),
    path('api/progress/', include('apps.profiles.urls')),
    path('api/activities/', include('apps.activities.urls')),
]
