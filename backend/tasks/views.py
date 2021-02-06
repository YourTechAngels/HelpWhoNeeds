from rest_framework.parsers import JSONParser
from rest_framework.decorators import parser_classes
from rest_framework import viewsets
from .serializers import TaskSerializer, TaskTypeSerializer
from .models import Task, TaskType
from accounts.models import User
from django.db.models import Q
from rest_framework.response import Response
from rest_framework.decorators import action
from django.core.mail import EmailMessage
from helpwhoneeds.settings import EMAIL_HOST_USER
from datetime import datetime, timezone
from django.contrib.gis.measure import Distance
from django.contrib.gis.geos import Point


# send email function to notify requestee about task status
def send_email(task, prev_state_task, prev_assigned_vol):
    time_format = "%d %B %Y, %H:%M"

    if (task.status == "AS") and (prev_state_task =="OP"): # for accepted task
        volunteer = task.volunteer
        vol_subject = 'Task Assigned'
        vol_body_first_line = 'You have accepted new task.\n'
        req_subject = 'Task Requested is Accepted'
        req_body_first_line = 'The task you have requested has been accepted.\n'
    elif (task.status == "OP") and (prev_state_task =="AS"): # for rejected task
        volunteer = prev_assigned_vol
        vol_subject = 'Task Returned'
        vol_body_first_line = 'You have recently returned the task.\n'
        req_subject = 'Task Requested is returned'
        req_body_first_line = 'The task you have requested has been returned.\n'
    elif (task.status == "DN") and (prev_state_task == "AS"):  # for completed task
        volunteer = task.volunteer
        vol_subject = 'Task Completed'
        vol_body_first_line = 'You have recently marked the task  as completed.\n'
        req_subject = 'Task Requested is Completed'
        req_body_first_line = 'The task you have requested has been completed.\n'
    else:
        return

    common_body = f'Please see the details below: \n\n' + \
                f'Task: {task.task_type} \n' + \
                f'Task Details: {task.description} \n' + \
                f'When: {task.start_time.strftime(time_format)} - {task.end_time.strftime(time_format)}\n\n'

    volunteer_email = EmailMessage(
        subject=vol_subject,
        body=vol_body_first_line + common_body +
            f'Requestee: {task.requestee.first_name} {task.requestee.last_name}\n' +
            'Address: ' + ','.join([task.requestee.address_line_1, task.requestee.address_line_2,
                                task.requestee.city]) + '\n' +
            f'PostCode: {task.requestee.post_code}\n\n' +
            f'Phone no: {task.requestee.phone_number}\n' +
            f'Email: {task.requestee.email}\n',
        from_email=EMAIL_HOST_USER,
        to=[volunteer.email]
        )

    requestee_email = EmailMessage(
        subject=req_subject,
        body=req_body_first_line + common_body +
                f'Volunteer: {volunteer.first_name} {volunteer.last_name}\n' +
                f'Phone no: {volunteer.phone_number}\n' +
                f'Email: {volunteer.email}\n',
        from_email=EMAIL_HOST_USER,
        to=[task.requestee.email]
    )

    volunteer_email.send()
    requestee_email.send()


class TaskView(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    queryset = Task.objects.all()

    # Get the current volunteer's assigned and new tasks     
    @action(detail=False, methods=['GET'], name='Get Volunteer Task Lists')
    def get_vol_task(self, request, *args, **kwargs):
        vol_id = self.request.query_params.get('volId')       
        volunteer=User.objects.get(id=vol_id)
        context = {"logged_in_volunteer": volunteer}
        queryset = Task.objects.filter((Q(Q(volunteer_id=vol_id) &~Q(status__exact = 'DN')) |
                                        Q(Q(volunteer_id__isnull=True) &Q(end_time__gte= datetime.now(timezone.utc)))
                                        )  
                                        &~Q(status__exact = 'CL')                                      
                                        &Q(requestee__in =                                                                        
                                        User.objects.filter( location__distance_lte=(
                                                                                volunteer.location,
                                                                                Distance(mi=1)
                                                                            ))
                                            )                                        
                                        )

        
                                
        serializer = self.get_serializer(queryset, context=context,many=True)
        return Response(serializer.data)

    # Partial update to update task status and notify requestee
    def partial_update(self, request, *args, **kwargs):
        task_object = self.get_object()
        data = request.data

        if data.get("isUpdatedByVol", None):
            prev_state_task = task_object.status
            if task_object.volunteer is not None:
                    prev_assigned_vol = User.objects.get(id = task_object.volunteer.id)
            else:
                    prev_assigned_vol = None
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

            send_email(task_object, prev_state_task, prev_assigned_vol)

            return Response(serializer.data)

        # any standard partial task update
        else:
            kwargs['partial'] = True
            return self.update(request, *args, **kwargs)


# access by user_id as a parameter
class RequesteeTasksView(viewsets.ReadOnlyModelViewSet):
    serializer_class = TaskSerializer

    def get_queryset(self):
        req_uid = self.request.query_params.get('requid')
        queryset = Task.objects.filter(requestee=User.objects.get(uid=req_uid).id)
        return queryset
    

class TaskTypeView(viewsets.ReadOnlyModelViewSet):
    serializer_class = TaskTypeSerializer
    queryset = TaskType.objects.all()
