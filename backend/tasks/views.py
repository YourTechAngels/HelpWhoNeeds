from rest_framework.parsers import JSONParser
from rest_framework.decorators import parser_classes
from rest_framework import viewsets
from .serializers import TaskSerializer
from .models import Task
from accounts.models import User
from django.db.models import Q
from rest_framework.response import Response
from rest_framework.decorators import action
from django.core.mail import EmailMessage
from helpwhoneeds.settings import EMAIL_HOST_USER
import datetime


# send email function to notify requestee about task status
def send_email(task, prev_state_task, prev_vol_email):
    if (task.status == "AS") and (prev_state_task =="OP"): #for accepted task
        volunteer_email = EmailMessage(            
            subject=f'Task Assigned',
            body=f'You have accepted new task.Please see the details below: \n\n Requestee: {task.requestee.first_name}  {task.requestee.last_name}\n'+
                f'Task: {task.task_type} \n'+
                f'Task Details: {task.description} \n\n'+  
                f'Address Line1: {task.requestee.address_line_1}\n'+
                f'Address Line2: {task.requestee.address_line_2}\n'+
                f'City: {task.requestee.city}\n'+
                f'PostCode: {task.requestee.post_code}\n\n'+
                f'Phone no: {task.requestee.phone_number}\n'+
                f'Email: {task.requestee.email}\n'+
                f'Start Time: {task.start_time.ctime()}\n'+
                f'End Time: {task.end_time.ctime()}\n',           
            from_email=EMAIL_HOST_USER,
            to=[task.volunteer.email],
            #to=['kusumthapamagar@gmail.com']
            # bcc = ['kusumthapamagar@gmail.com']
            # reply_to = ['whoever@itmaybe.com']
            )
        requestee_email = EmailMessage(       
            subject = 'Task Requested is Accepted',
            body = f'The task you have requested has been accepted.Please see the details below: \n\n Volunteer: {task.volunteer.first_name}  {task.volunteer.last_name}\n'+
                f'Task: {task.task_type} \n'+
                f'Task Details: {task.description} \n\n'+                 
                f'Phone no: {task.requestee.phone_number}\n'+
                f'Email: {task.requestee.email}\n'+
                f'Start Time: {task.start_time.ctime()}\n'+
                f'End Time: {task.end_time.ctime()}\n',          
            from_email = EMAIL_HOST_USER,
            to =[task.requestee.email]
            )   
        volunteer_email.send() 
        requestee_email.send()

    if (task.status == "OP") and (prev_state_task=="AS"): #for rejected Task
            volunteer_email = EmailMessage(            
                subject='Task Returned',
                body=f'You have recently returned the task. Please see the details below: \n\n Requestee: {task.requestee.first_name}  {task.requestee.last_name}\n'+
                f'Task: {task.task_type} \n'+
                f'Task Details: {task.description} \n\n'+  
                f'Address Line1: {task.requestee.address_line_1}\n'+
                f'Address Line2: {task.requestee.address_line_2}\n'+
                f'City: {task.requestee.city}\n'+
                f'PostCode: {task.requestee.post_code}\n\n'+
                f'Phone no: {task.requestee.phone_number}\n'+
                f'Email: {task.requestee.email}\n'+
                f'Start Time: {task.start_time.ctime()}\n'+
                f'End Time: {task.end_time.ctime()}\n',  
                from_email=EMAIL_HOST_USER,
                to=[prev_vol_email]
                )

            requestee_email = EmailMessage(       
                subject = 'Task Requested is returned',
                body = 'The task you have requested has been returned.Please see the details below: \n\n Volunteer: {task.volunteer.first_name}  {task.volunteer.last_name}\n'+
                f'Task: {task.task_type} \n'+
                f'Task Details: {task.description} \n\n'+                 
                f'Phone no: {task.requestee.phone_number}\n'+
                f'Email: {task.requestee.email}\n'+
                f'Start Time: {task.start_time.ctime()}\n'+
                f'End Time: {task.end_time.ctime()}\n',          
                from_email = EMAIL_HOST_USER,
                to =[task.requestee.email]
                )  
            volunteer_email.send()  
            requestee_email.send()

    if (task.status == "DN") and (prev_state_task=="AS"): #for completed task
            volunteer_email = EmailMessage(            
                subject='Task Completed',
                body=f'You have recently marked the task  as completed. Please see the details below: \n\n Requestee: {task.requestee.first_name}  {task.requestee.last_name}\n'+
                f'Task: {task.task_type} \n'+
                f'Task Details: {task.description} \n\n'+  
                f'Address Line1: {task.requestee.address_line_1}\n'+
                f'Address Line2: {task.requestee.address_line_2}\n'+
                f'City: {task.requestee.city}\n'+
                f'PostCode: {task.requestee.post_code}\n\n'+
                f'Phone no: {task.requestee.phone_number}\n'+
                f'Email: {task.requestee.email}\n'+
                f'Start Time: {task.start_time.ctime()}\n'+
                f'End Time: {task.end_time.ctime()}\n',
                from_email=EMAIL_HOST_USER,
                to=[prev_vol_email]
                )         

            requestee_email = EmailMessage(       
                subject = 'Task Requested is Completed',
                body = 'The task you have requested has been completed. Please see the details below: \n\n Volunteer: {task.volunteer.first_name}  {task.volunteer.last_name}\n'+
                f'Task: {task.task_type} \n'+
                f'Task Details: {task.description} \n\n'+                 
                f'Phone no: {task.requestee.phone_number}\n'+
                f'Email: {task.requestee.email}\n'+
                f'Start Time: {task.start_time.ctime()}\n'+
                f'End Time: {task.end_time.ctime()}\n',          
                from_email = EMAIL_HOST_USER,
                to =[task.requestee.email]
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

        queryset = Task.objects.filter((Q(volunteer_id=vol_id) | Q(volunteer_id__isnull=True))
                                        &Q(start_time__gte= datetime.datetime.now())           
                                        &Q(end_time__gte= datetime.datetime.now())                                        
                                        )
                                
        
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    # Partial update to update task status and notify requestee
    def partial_update(self, request, *args, **kwargs):
        task_object = self.get_object()       
        data = request.data
        prev_state_task = data["prevTaskState"]
        prev_vol_email = data["prevTaskVolEmail"]

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

        #send_email(task_object, prev_state_task,prev_vol_email)

        return Response(serializer.data)
    

# access by user_id as a parameter
class RequesteeTasksView(viewsets.ReadOnlyModelViewSet):
    serializer_class = TaskSerializer
    queryset = Task.objects.filter

    def get_queryset(self):
        req_uid = self.request.query_params.get('requid')
        queryset = Task.objects.filter(requestee=User.objects.get(uid=req_uid).id)
        return queryset
