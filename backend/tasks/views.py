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
    queryset = Task.objects.filter(volunteer_id__isnull = True)


class NewVolTaskView(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    queryset = Task.objects.filter(Q(volunteer_id = 3) | Q(volunteer_id__isnull = True))
                #.filter(start_time__gt = datetime.datetime.now())