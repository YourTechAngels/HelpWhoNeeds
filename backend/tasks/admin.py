from django.contrib import admin
from .models import Task
from accounts.models import User

class TaskAdmin(admin.ModelAdmin):
    list_display = ("task_type_id", "description", "dbs_needed", "start_time",
                    "end_time", "min_duration", "status","owner_id", "volunteer_id")
    search_fields = ("task_type_id", "description")

admin.site.register(Task, TaskAdmin)

