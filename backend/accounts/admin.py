from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User


class UserAdmin(admin.ModelAdmin):
    model = User
    list_display = ("first_name", "last_name")
    search_fields = ("first_name", "last_name")

#admin.site.unregister(User)
admin.site.register(User, UserAdmin)
