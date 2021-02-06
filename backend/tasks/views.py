import datetime
from django.contrib.gis.measure import Distance
from django.db.models import Q, Subquery
from django.core.mail import EmailMessage
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import viewsets
from accounts.models import User
from accounts.views import nearby_users
from accounts.serializers import AccountSerializer
from helpwhoneeds.settings import EMAIL_HOST_USER
from .models import Task, TaskType
from .serializers import TaskSerializer, TaskTypeSerializer


# send email function to notify requestee about task status
def send_email(task, **kwargs):
    time_format = "%d %B %Y, %H:%M"
    ending = ""

    requested_vol = kwargs.get("requested_vol")
    prev_state_task = kwargs.get("prev_state_task")
    prev_assigned_vol = kwargs.get("prev_assigned_vol")

    # requestee asking a volunteer to take a task
    if kwargs.get("requested_vol"):
        volunteer = requested_vol
        vol_subject = f'Could you please help me with {task.task_type_name} ?'
        vol_body_first_line = 'Request to complete task.\n'
        ending = "Please follow the link to take it..."
        req_subject = 'Task Was Requested'
        req_body_first_line = 'Your request to complete task has been sent to the volunteer.\n'

    # emails notifying about status change
    elif (task.status == "AS") and (prev_state_task =="OP"): # for accepted task
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
            f'Email: {task.requestee.email}\n\n' +\
             ending,
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

    # volunteer_email.send()
    # requestee_email.send()
    print('--------------')
    print(volunteer_email)
    print('--------------')
    print(requestee_email)


class TaskView(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    queryset = Task.objects.all()

    # # Get the current volunteer's assigned and new tasks
    # @action(detail=False, methods=['GET'], name='Get Volunteer Task Lists')
    # def get_vol_task(self, request, *args, **kwargs):
    #     vol_id = self.request.query_params.get('volId')
    #     volunteer=User.objects.get(id=vol_id)
    #     context = {"logged_in_volunteer": volunteer}
    #     queryset = Task.objects.filter(
	 #        (Q(volunteer_id=vol_id) | Q(volunteer_id__isnull=True))
	 #        &Q(start_time__gte= datetime.datetime.now())
	 #        &Q(end_time__gte= datetime.datetime.now())
	 #        &Q(requestee__in = User.objects.filter(
		#         location__distance_lte=(volunteer.location, Distance(mi=1)) )))
    #
    #     serializer = self.get_serializer(queryset, context=context,many=True)
    #     return Response(serializer.data)

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

            send_email(task=task_object, prev_state_task=prev_state_task,
                       prev_assigned_vol=prev_assigned_vol)

            return Response(serializer.data)

        # any standard partial task update
        else:
            if req_vol := data.get("requested_vol", None):
                print(data, task_object)
                send_email(task_object, requested_vol=req_vol)
                return
            kwargs['partial'] = True
            return self.update(request, *args, **kwargs)


# access by user_id as a parameter
class RequesteeTasksView(viewsets.ReadOnlyModelViewSet):
    serializer_class = TaskSerializer

    def get_queryset(self):
        req_uid = self.request.query_params.get('requid')
        print(f"req_uid: {req_uid}")
        queryset = Task.objects.filter(requestee=User.objects.get(uid=req_uid).id)
        return queryset


class TaskTypeView(viewsets.ReadOnlyModelViewSet):
    serializer_class = TaskTypeSerializer
    queryset = TaskType.objects.all()


class VolTaskView(viewsets.ReadOnlyModelViewSet):
    serializer_class = TaskSerializer

    def get_queryset(self):
        vol_uid = self.request.query_params.get('volId')
        vol_id = User.objects.get(uid=vol_uid).id
        close_vul = nearby_users(vol_id).filter(dist__lte=1600)
        from time import perf_counter
        print("query started}")
        t1 = perf_counter()
        queryset = Task.objects.\
            filter(end_time__gte=datetime.datetime.now(datetime.timezone.utc)).\
            filter(Q(volunteer_id=vol_id) | Q(volunteer_id__isnull=True)).\
                filter(requestee__in=close_vul)[:20]
        t2 = perf_counter()
        print(f"Time elapsed: {t2-t1}")
        print(len(queryset))
        # print(Task.objects.\
        #     filter(end_time__gte=datetime.datetime.now(datetime.timezone.utc)).\
        #     filter(Q(volunteer_id=vol_id) | Q(volunteer_id__isnull=True)). \
        #       filter(requestee__in=close_vul).explain(verbose=True, analyze=True))

        return queryset
