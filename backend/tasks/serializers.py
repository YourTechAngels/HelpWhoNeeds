from rest_framework import serializers
from .models import Task

class TaskSerializer(serializers.ModelSerializer):

    class Meta:
        model = Task
        fields = ("id", "task_type", "description", "dbs_needed", "start_time",
                  "end_time", "status", "requestee", "volunteer")
        depth = 1
