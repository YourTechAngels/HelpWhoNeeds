from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User


class UserAdmin(admin.ModelAdmin):
    model = User
    list_display = ("first_name", "last_name", "username", "date_of_birth", "post_code",
                    "is_volunteer", "is_staff")
    search_fields = ("first_name", "last_name")


# admin.site.unregister(User)
admin.site.register(User, UserAdmin)
