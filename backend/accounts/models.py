from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    auth_key = models.CharField(max_length=150, blank=True, null=True)
    # username = models.CharField(max_length=40, unique=False, default='')
    email = models.EmailField(verbose_name='email', blank=True, null=True)
    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    date_of_birth = models.DateField(blank=True, null=True)
    phone_number = models.IntegerField(blank=True, null=True)
    post_code = models.CharField(max_length=150, blank=True, null=True)
    address_line_1 = models.CharField(max_length=150, blank=True, null=True)
    address_line_2 = models.CharField(max_length=150, blank=True, null=True)
    city = models.CharField(max_length=150, blank=True, null=True)
    county = models.CharField(max_length=150, blank=True, null=True)
    DBS_required = models.BooleanField(default='False')
    user_type = models.CharField(max_length=150, default='Admin')


def _str_(self):
        return f"{self.first_name}"

class Volunteer(User):
    dbs = models.BooleanField(default=False)

class Requestee(User):
    # TODO delete class if not needed
    pass

