from django.db import models
from cuser.models import AbstractCUser

class User(AbstractCUser):
    is_requester = models.BooleanField(default=False)
    is_volunteer = models.BooleanField(default=True)
    # email = models.EmailField(unique=True)


class Requester(User):
    class Meta:
        proxy = True
        verbose_name = 'Requester'


class Volunteer(User):
    class Meta:
        proxy = True
        verbose_name = 'Volunteer'
