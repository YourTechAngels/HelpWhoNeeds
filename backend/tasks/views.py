from django.shortcuts import render
from rest_framework import viewsets
from .serializers import TaskSerializer
from .models import Task
import datetime
from django.db.models import Q
from rest_framework.response import Response
from rest_framework.decorators import action


class TaskView(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    queryset = Task.objects.all()

    def get_task_id(self):
        task_id = self.request.query_params.get('taskId')

        queryset = Task.objects.filter(id=task_id)

        return queryset

    @action(detail=False, methods=['GET'], name='Get Volunteer Task Lists')
    def get_vol_task(self, request, *args, **kwargs):
        vol_id = self.request.query_params.get('volId')

        queryset = Task.objects.filter(Q(volunteer_id=vol_id) | Q(volunteer_id__isnull=True))
        
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def get_object(self):
        task_id =self.kwargs['pk']
        return self.get_queryset().filter(id=task_id)

    # def retrieve(self, request, *args, **kwargs):
    #     try:
    #         instance = self.get_object()
    #     except (Task.DoesNotExist, KeyError):
    #         return Response({"error": "Requested Movie does not exist"}, status=status.HTTP_404_NOT_FOUND)
    #     serializer = self.get_serializer(instance)
    #     return Response(serializer.data)

    # @action(detail=True, methods=['GET'], name='Get Task By Id')
    # def get_task_by_id(self, request, *args, **kwargs):
    #     task_id = self.request.query_params.get('taskId')

    #     queryset = Task.objects.filter(id='taskId')

    #     serializer = self.get_serializer(queryset, many=False)
    #     return Response(serializer.data)

# class NewTaskView(viewsets.ModelViewSet):

#     serializer_class = TaskSerializer
#     queryset = Task.objects.filter(volunteer_id__isnull=True)


# class NewVolTaskView(viewsets.ModelViewSet):
#     serializer_class = TaskSerializer
    
#     def get_queryset(self):
#         vol_id = self.request.query_params.get('volId')

#         queryset = Task.objects.filter(Q(volunteer_id=vol_id) | Q(volunteer_id__isnull=True))

#         return queryset


    
    