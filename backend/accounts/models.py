from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    uid = models.CharField(max_length=150, unique=True, blank=True, null=True)
    username = models.CharField(max_length=150, blank=True, null=True, unique=True)
    email = models.EmailField(verbose_name='email', blank=True, null=True)
    date_of_birth = models.DateField(blank=True, null=True)
    phone_number = models.IntegerField(blank=True, null=True)
    post_code = models.CharField(max_length=150, blank=True, null=True)
    address_line_1 = models.CharField(max_length=150, blank=True, null=True)
    address_line_2 = models.CharField(max_length=150, blank=True, null=True)
    city = models.CharField(max_length=150, blank=True, null=True)
    county = models.CharField(max_length=150, blank=True, null=True)   
    is_volunteer = models.BooleanField(default=False)   
    dbs = models.BooleanField(default=False)

def _str_(self):
        return f"{self.first_name}"

#class Volunteer(User):
   # dbs = models.BooleanField(default=False)

#class Requestee(User):
    # TODO delete class if not needed
    #pass

