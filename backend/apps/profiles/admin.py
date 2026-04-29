from django.contrib import admin
from .models import Profile

@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('id', 'username', 'language', 'total_xp', 'created_at')
    search_fields = ('username', 'id')
