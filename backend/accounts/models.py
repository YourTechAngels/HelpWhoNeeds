from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    USER_TYPE_CHOICES = (
        (1, 'requestee'),
        (2, 'volunteer'),
        (3, 'admin'), )

    # TODO change default
    user_type = models.PositiveSmallIntegerField(choices=USER_TYPE_CHOICES, default=3)

class Volunteer(User):
    dbs = models.BooleanField(default=False)

class Requestee(User):
    # TODO delete class if not needed
    pass
