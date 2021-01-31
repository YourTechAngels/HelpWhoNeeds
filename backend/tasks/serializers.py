from rest_framework import serializers
from .models import Task, TaskType
from accounts.serializers import AccountSerializer


class TaskTypeSerializer(serializers.ModelSerializer):
	class Meta:
		model = TaskType
		fields = '__all__'


class TaskSerializer(serializers.ModelSerializer):
	requestee_details = AccountSerializer(source='requestee', read_only=True)
	volunteer_details = AccountSerializer(source='volunteer', read_only=True)
	requested_vol_details = AccountSerializer(source='requested_volunteer', read_only=True)
	task_type_details = TaskTypeSerializer(source='task_type', read_only=True)
	status_name = serializers.CharField(source='get_status_display', read_only=True)

	class Meta:
		model = Task
		fields = ("id", "task_type", "task_type_details", "description", "dbs_required",
		          "start_time", "end_time", "status", "status_name", "requestee", "volunteer",
		          "requested_vol", "requestee_details", "volunteer_details",
		          "requested_vol_details")
