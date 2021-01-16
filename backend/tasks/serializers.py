from rest_framework import serializers
from .models import Task
from accounts.models import User

class TaskSerializer(serializers.ModelSerializer):

  class Meta:    
    model = Task
    fields = ("id", "task_type_id", "description", "dbs_needed", "start_time",
              "end_time", "status","owner_id", "volunteer_id") 
    depth =1
