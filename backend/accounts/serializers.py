from rest_framework import serializers
from .models import User, Volunteer, Requestee
from tasks.models import Task


class VolunteerSerializer(serializers.ModelSerializer):
    tasks = serializers.PrimaryKeyRelatedField(many=True, queryset=Task.objects.all())
    taken_by = serializers.ReadOnlyField(source='owner.username')

    class Meta:
        model = Volunteer
        fields = ['id', 'first_name', 'second_name', 'email', 'dbs', 'tasks']


class RequesteeSerializer(serializers.ModelSerializer):
    tasks = serializers.PrimaryKeyRelatedField(many=True, queryset=Task.objects.all())
    owner = serializers.ReadOnlyField(source='owner.username')

    class Meta:
        model = Volunteer
        fields = ['id', 'first_name', 'second_name', 'email', 'tasks', 'owner']
