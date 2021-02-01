from datetime import datetime, timezone
from rest_framework import serializers
from .models import Task, TaskType
from accounts.serializers import AccountSerializer
from django.contrib.gis.measure import Distance
from accounts.models import User


class TaskTypeSerializer(serializers.ModelSerializer):
	task_type_name = serializers.CharField(source='get_task_type_display', read_only=True)

	class Meta:
		model = TaskType
		fields = ("id", "task_type", "task_type_name", "min_duration", "dbs_required")


class TaskSerializer(serializers.ModelSerializer):
	requestee_details = AccountSerializer(source='requestee', read_only=True)
	volunteer_details = AccountSerializer(source='volunteer', read_only=True)
	requested_vol_details = AccountSerializer(source='requested_vol', read_only=True)
	task_type_details = TaskTypeSerializer(source='task_type', read_only=True)
	status_name = serializers.CharField(source='get_status_display', read_only=True)
	expired = serializers.SerializerMethodField()
    distance = serializers.SerializerMethodField(
        'get_distance_between_vol_and_vul')

	def get_expired(self, obj):
		return obj.end_time <= datetime.now(timezone.utc)
    
    def get_distance_between_vol_and_vul(self, Task):
        volunteer = self.context.get("logged_in_volunteer",None)   
        #volunteer =  self.context['logged_in_volunteer'] 
        if volunteer:
            volunteer_location = volunteer.location
            #print(volunteer_location)
            return round((volunteer_location.distance(Task.requestee.location))*100,2)
    
        else:
            return None

	class Meta:
		model = Task
		fields = ("id", "task_type", "task_type_details", "description", "dbs_required",
		          "start_time", "end_time", "status", "status_name", "expired", "requestee",
		          "volunteer", "requested_vol", "requestee_details", "volunteer_details",
		          "requested_vol_details", "distance")   
