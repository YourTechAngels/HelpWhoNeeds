from rest_framework import generics
from rest_framework import permissions
from .models import User, Volunteer, Requestee
from .serializers import VolunteerSerializer, RequesteeSerializer


class VolunteerList(generics.ListAPIView):
    queryset = Volunteer.objects.all()
    serializer_class = VolunteerSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(taken_by=self.request.volunteer)


class VolunteerDetail(generics.RetrieveAPIView):
    queryset = Volunteer.objects.all()
    serializer_class = VolunteerSerializer
    permission_classes = [permissions.IsAuthenticated]


class RequesteeList(generics.ListAPIView):
    queryset = Requestee.objects.all()
    serializer_class = RequesteeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.requestee)


class RequesteeDetail(generics.RetrieveAPIView):
    queryset = Requestee.objects.all()
    serializer_class = RequesteeSerializer
    permission_classes = [permissions.IsAuthenticated]
