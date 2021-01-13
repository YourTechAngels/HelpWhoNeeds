from django.contrib import admin
from .models import Task
from accounts.models import User, Requestee, Volunteer

class TaskAdmin(admin.ModelAdmin):
    list_display = ("task_type", "description", "dbs_needed", "start_time",
                    "end_time", "min_duration", "status","owner", "volunteer")
    search_fields = ("task_type", "description")

admin.site.register(Task, TaskAdmin)

class RequesteeAdmin(admin.ModelAdmin):
    list_display = ("first_name", "last_name")
    search_fields = ("first_name", "last_name")

class VolunteerAdmin(admin.ModelAdmin):
    list_display = ("first_name", "last_name")
    search_fields = ("first_name", "last_name")

class UserAdmin(admin.ModelAdmin):
    list_display = ("first_name", "last_name")
    search_fields = ("first_name", "last_name")

admin.site.register(User, UserAdmin)
admin.site.register(Requestee, UserAdmin)
admin.site.register(Volunteer, UserAdmin)