from django.urls import path
from apps.profiles.views import ProgressAPI

urlpatterns = [
    path('', ProgressAPI.as_view(), name='progress-api'),
]
