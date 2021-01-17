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

    def __str__(self):
        return (self.first_name + self.last_name).strip() or self.username or self.email
