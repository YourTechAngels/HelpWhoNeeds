from django.shortcuts import render
from rest_framework import viewsets
from .serializers import AccountSerializer
from .models import User
from rest_framework.response import Response
from rest_framework.decorators import action
import datetime
from django.db.models import Q


class AccountView(viewsets.ModelViewSet):
    serializer_class = AccountSerializer
    queryset = User.objects.all()

    @action(detail=False, methods=['GET'], name='Get User By Id')
    def get_user_by_id(self, request, *args, **kwargs):
        user_uid = self.request.query_params.get('uid')
        queryset = User.objects.filter(uid=user_uid)

        serializer = self.get_serializer(queryset, many=True)

        return Response(serializer.data)

    def partial_update(self, request, *args, **kwargs):
        user_object = self.get_object()
        data = request.data
        user_object.first_name = data.get("first_name", user_object.first_name)
        user_object.last_name = data.get("last_name", user_object.last_name)
        user_object.date_of_birth = data.get("date_of_birth", user_object.date_of_birth)
        user_object.phone_number = data.get("phone_number", user_object.phone_number)
        user_object.post_code = data.get("post_code", user_object.post_code)
        user_object.address_line_1 = data.get("address_line_1", user_object.address_line_1)
        user_object.address_line_2 = data.get("address_line_2", user_object.address_line_2)
        user_object.city = data.get("city", user_object.city)
        user_object.county = data.get("county", user_object.county)
        user_object.dbs = data.get("dbs", user_object.dbs)
        user_object.email = data.get("email", user_object.email)
        user_object.latitude = data.get("latitude", user_object.latitude)
        user_object.longitude = data.get("longitude", user_object.longitude)

        user_object.save()
        serializer = AccountSerializer(user_object)

        return Response(serializer.data)

