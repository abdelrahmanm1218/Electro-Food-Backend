from django.contrib import admin
from .models import MenuItem


@admin.register(MenuItem)
class MenuItemAdmin(admin.ModelAdmin):
    list_display = ("name_en", "price", "is_available", "created_at")
    list_filter = ("is_available",)
    search_fields = ("name_en", "name_ar")
