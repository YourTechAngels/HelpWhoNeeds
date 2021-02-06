from django.shortcuts import render
from rest_framework import viewsets
from .serializers import AccountSerializer
from .models import User
from rest_framework.response import Response
from rest_framework.decorators import action
import datetime
from django.db.models import F, Func, Value, FloatField
from django.contrib.gis.db import models as geomodels
from django.contrib.gis.measure import Distance
from django.contrib.gis.geos import Point


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
        #user_object.location = f'Point({user_object.latitude} {user_object.longitude})'
        user_object.location = f'Point({data.get("latitude")} {data.get("longitude")})'
        user_object.is_available = data.get("is_available", user_object.is_available)
        print(user_object.latitude)
        print(user_object.longitude)
        print(user_object.location)
        user_object.save()
        serializer = AccountSerializer(user_object)

        return Response(serializer.data)

    def perform_create(self, serializer):        
        serializer.save(location = Point((self.request.data['latitude']), (self.request.data['longitude'])))
        print(serializer.data.get("location"))


class ReqNearbyVolsView(viewsets.ReadOnlyModelViewSet):
    serializer_class = AccountSerializer

    def get_queryset(self, *args, **kwargs):
        req_id = self.request.query_params.get('req_id')
        print(req_id)
        print(f"Num of all volunteers: {len(User.objects.filter(is_volunteer=True))}")
        print(f"Num of close volunteers: {len(nearby_users(req_id))}")
        closest_vols = nearby_users(req_id).filter(dist__lte=2000)[:10]
        print(f"Closest user num: {len(closest_vols)}")
        return closest_vols


def nearby_users(user_id):
    """
    By default this function returns a queryset of users within 11-14 km along
    each direction of user's lat/lon.
    Calculations are based on the fact that 1° of latitude at 0° long. contains
    about 110 km and 1° of longitude at 50°-60° latitudes (UK lat. range)
    contains 55-70 km.
    The method does not treat date-change longitude and polar latitudes as
    it's out of the project scope"""
    user_obj = User.objects.get(id=user_id)

    if user_obj.is_staff or user_obj.is_superuser:
        # the queryset is not applicable to admins
        return User.objects.none()

    if not (user_obj.latitude and user_obj.longitude):
        raise ValueError(f"User {user_id} does not have location specified. "
                         f"Could not find nearby users.")

    # everyone who is not admin or volunteer is a requestee
    # volunteers search for requestees and otherwise
    search_volunteer = not user_obj.is_volunteer
    lat_range = [user_obj.latitude - 0.1, user_obj.latitude + 0.1]
    lon_range = [user_obj.longitude - 0.2, user_obj.longitude + 0.2]
    print(user_obj.location)
    from time import perf_counter
    # t1_x = perf_counter()
    # close_users = User.objects.filter(location__isnull=False) \
    #     .filter(latitude__range=lat_range,
    #             longitude__range=lon_range,
    #             is_volunteer=search_volunteer,
    #             is_staff=False, is_superuser=False,
    #             is_available=True, is_active=True) \
    #     .annotate(dist=Func(F('location'),
    #                         Func(
    #                             Value(str(user_obj.location)),
    #                             function='ST_GeographyFromText'
    #                         ),
    #                         function="ST_Distance", output_field=FloatField())) \
    #     .order_by("dist")
    # t2_x = perf_counter()
    # print(f"Query time with optimization: {t2_x-t1_x} s. Number of users: {len(close_users)}")
    t1 = perf_counter()
    close_users = User.objects.filter(location__isnull=False)\
        .filter(
                is_volunteer=search_volunteer,
                is_staff=False, is_superuser=False,
                is_available=True, is_active=True) \
        .annotate(dist=Func(F('location'),
                            Func(
                                Value(str(user_obj.location)),
                                function='ST_GeographyFromText'
                            ),
                            function="ST_Distance", output_field=FloatField())) \
        .order_by("dist")
    t2 = perf_counter()
    print(f"WTF?? Query time without optimization: {t2-t1} s. Number of users: {len(close_users)}")

    return close_users
