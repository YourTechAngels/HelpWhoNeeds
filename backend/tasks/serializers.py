from rest_framework import serializers
from .models import Task
from accounts.serializers import AccountSerializer


class TaskSerializer(serializers.ModelSerializer):
    requestee_details = AccountSerializer(source='requestee', read_only=True) 
    volunteer_details = AccountSerializer(source='volunteer', read_only=True) 

    class Meta:
        model = Task
        fields = ("id", "task_type", "description", "dbs_required", "start_time",
                  "end_time", "status", "requestee", "volunteer", "requestee_details",
                  "volunteer_details")
