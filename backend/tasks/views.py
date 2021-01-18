from django.shortcuts import render
from rest_framework import viewsets
from .serializers import TaskSerializer
from .models import Task
import datetime
from django.db.models import Q


class TaskView(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    queryset = Task.objects.all()


class NewTaskView(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    queryset = Task.objects.filter(volunteer_id__isnull=True)


class NewVolTaskView(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    
    def get_queryset(self):
        vol_id = self.request.query_params.get('volId')

        queryset = Task.objects.filter(Q(volunteer_id=vol_id) | Q(volunteer_id__isnull=True))

        return queryset


class TaskViewById(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    
    def get_queryset(self):
        task_id = self.request.query_params.get('taskId')

        queryset = Task.objects.filter(id=task_id)

        return queryset