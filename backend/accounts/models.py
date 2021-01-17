from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import RegexValidator


class User(AbstractUser):
    uid = models.CharField(max_length=150, unique=True, blank=True, null=True)
    username = models.CharField(max_length=150, blank=True, null=True, unique=True)
    email = models.EmailField(verbose_name='email', blank=True, null=True)
    date_of_birth = models.DateField(blank=True, null=True)
    phone_regex = RegexValidator(regex=r"^(?:0|\+?44)(?:\s|\-)?(?:\d(?:\s|\-)?){9,10}$",
            message="Phone number must start with '0' or '+44', and contain only digits, spaces or dash symbols")
    phone_number = models.CharField(validators=[phone_regex], max_length=20, blank=True)
    post_code = models.CharField(max_length=150, blank=True, null=True)
    address_line_1 = models.CharField(max_length=150, blank=True, null=True)
    address_line_2 = models.CharField(max_length=150, blank=True, null=True)
    city = models.CharField(max_length=150, blank=True, null=True)
    county = models.CharField(max_length=150, blank=True, null=True)   
    is_volunteer = models.BooleanField(default=False)
    dbs = models.BooleanField(default=False)

    def __str__(self):
        return (self.first_name + self.last_name).strip() or self.username or self.email
