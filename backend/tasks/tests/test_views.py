import json
from rest_framework import status
from django.test import TestCase, Client
from django.urls import reverse
from tasks.models import Task, TaskType
from tasks.serializers import TaskSerializer
from accounts.models import User
from django.utils import timezone
from datetime import timedelta
from django.shortcuts import get_list_or_404, get_object_or_404


class TaskViewSetTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.valid_payload = {
            "task_type": "GRO", "requestee": 35, "volunteer": 1, "description": "Are complex dangerous, far away.",
            "dbs_required": 0, "start_time": "2021-01-29 16:30:16.334050", "end_time": "2021-02-06 23:30:16.334050",
            "min_duration": "00:00:00", "status": "OP"
        }

    def test_get_valid_all_tasks(self):
        response = self.client.get('/api/tasks/')
        tasks = Task.objects.all()
        serializer = TaskSerializer(tasks, many=True)
        self.assertEqual(response.data, serializer.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    # def test_create_valid_task(self):
    #     response = self.client.post('/api/tasks/',
    #                                 data=json.dumps(self.valid_payload),
    #                                 content_type='application/json'
    #                                 )
    #     self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    # def test_get_valid_single_tasks(self):
    #     response = self.client.get('/api/tasks/2/')
    #     task = Task.objects.filter(id=2).first()
    #     # task = Task.objects.get(pk=1)
    #     serializer = TaskSerializer(task, many=False)
    #     self.assertEqual(response.data, serializer.data)
    #     self.assertEqual(response.status_code, status.HTTP_200_OK)
