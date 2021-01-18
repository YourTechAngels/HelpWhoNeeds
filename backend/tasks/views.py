from django.shortcuts import render
from rest_framework import viewsets
from .serializers import TaskSerializer
from .models import Task
from accounts.models import User
import datetime
from django.db.models import Q
from rest_framework.response import Response
from rest_framework.decorators import action
from django.core.mail import EmailMessage

#send email function to notify requestee about task status
def send_email(recipientEmail):
    email = EmailMessage(
        subject = 'Task Assigned',
        body = 'you have recently accepted the task',
        from_email = 'helpwhomeeds.info@gmail.com',
        to =[recipientEmail],
        bcc = ['kusumthapamagar@gmail.com']
        #reply_to = ['whoever@itmaybe.com']
    )

    email.send()

class TaskView(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    queryset = Task.objects.all()

    #Get the current volunteer's assigned and new tasks     
    @action(detail=False, methods=['GET'], name='Get Volunteer Task Lists')
    def get_vol_task(self, request, *args, **kwargs):
        vol_id = self.request.query_params.get('volId')

        queryset = Task.objects.filter(Q(volunteer_id=vol_id) | Q(volunteer_id__isnull=True))
        
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    #Partial update to update task status and notify requestee
    def partial_update(self, request, *args, **kwargs):
        task_object = self.get_object()
        data = request.data

        try:
            if data["volId"] is None:
                task_object.volunteer = None
            else:
                volunteer = User.objects.get(id = data["volId"])
                task_object.volunteer = volunteer
        except KeyError:
            pass

        task_object.status = data.get("status", task_object.status)

        task_object.save()
        serializer = TaskSerializer(task_object)

        send_email(task_object.requestee.email)

        return Response(serializer.data)
    
