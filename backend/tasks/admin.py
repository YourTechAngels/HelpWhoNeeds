from django.contrib import admin
from .models import Task, TaskType
from accounts.models import User


class TaskAdmin(admin.ModelAdmin):
    list_display = ("task_type", "start_time", "end_time", "status", "requestee", "volunteer")
    search_fields = ("description", )
    list_filter = ("status", "task_type")
    list_per_page = 10

    def get_readonly_fields(self, request, obj=None):
        if not obj:  # editing an existing object
            return self.readonly_fields + ("volunteer", "status")
        return self.readonly_fields

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == "requestee":
            kwargs["queryset"] = User.objects.filter(is_volunteer=False, is_staff=False)
        if db_field.name == "volunteer":
            kwargs["queryset"] = User.objects.filter(is_volunteer=True)
        return super().formfield_for_foreignkey(db_field, request, **kwargs)

admin.site.register(Task, TaskAdmin)
admin.site.register(TaskType)
