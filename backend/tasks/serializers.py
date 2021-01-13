from rest_framework import serializers
from .models import Task
from accounts.models import Requestee, Volunteer

class TaskSerializer(serializers.ModelSerializer):
    
  class Meta:
    model = Task
    fields = ("id", "task_type", "description", "dbs_needed", "start_time",
              "end_time", "status","owner", "volunteer") 
    depth =1
