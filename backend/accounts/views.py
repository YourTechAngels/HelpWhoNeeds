from django.shortcuts import render
from rest_framework import viewsets
from .serializers import AccountSerializer
from .models import User
import datetime
from django.db.models import Q

class AccountView(viewsets.ModelViewSet):
    serializer_class = AccountSerializer
    queryset = User.objects.all()