from django.test import TestCase
import importlib
import pathlib
from rest_framework.utils import json
from rest_framework.test import APIClient
from ..models import User
# from .views import *
# from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
# from backend.accounts.serializers import AccountSerializer


class UserTest(TestCase):

    def setUp(self):
        self.client = APIClient()
        self.valid_payload = {
            'first_name': 'user',
            'last_name': 'testing',
            'date_of_birth': '1900-01-01',
            'phone_number': '0778676766',
            'uid': 'gOZULA4bKPaYtQJiCLljcUEe9kfg',
            'post_code': 'RG24 7JU',
            'address_line_1': '1 Belle vue road',
            'city': 'Basingstoke',
            'dbs': 0
        }
        self.invalid_payload = {
            'first_name': None,
            'post_code': None
        }

    def test_create_valid_user(self):
        response = self.client.post('/api/accounts/', self.valid_payload, format='json')
        result = json.loads(response.content)
        self.assertEqual(result['uid'], 'gOZULA4bKPaYtQJiCLljcUEe9kfg')

    def test_create_invalid_user(self):
        response = self.client.post('/api/accounts/', self.invalid_payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

