from django.shortcuts import render
from rest_framework import viewsets
from .serializers import AccountSerializer
from .models import User
import datetime
from django.db.models import Q
from rest_framework.response import Response
from rest_framework.decorators import action

class AccountView(viewsets.ModelViewSet):
    serializer_class = AccountSerializer
    queryset = User.objects.all()


    @action(detail=False,methods=['GET'], name='Get User By Id')
    def get_user_by_id(self, request, *args, **kwargs):
        user_uid = self.request.query_params.get('uId')
        queryset = User.objects.filter(uid=user_uid).distinct()
        
        serializer = self.get_serializer(queryset, many=True)

        return Response(serializer.data)
