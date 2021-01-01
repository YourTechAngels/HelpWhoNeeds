from rest_framework import serializers
from .models import Task

class TaskSerializer(serializers.ModelSerializer):
  class Meta:
    model = Task
    fields = ("task_type", "description", "dbs_needed", "start_time",
              "end_time", "status")
