from django.db import models
from datetime import timedelta
from django.core.exceptions import ValidationError
from django.utils import timezone
from accounts.models import Requestee, Volunteer


TASK_TYPE_CHOICES = (
        ("GRO", "Groceries"),
        ("PHA", "Pharmacy"),
        ("DOG", "Dog Walk"),
        ("HOS", "Hospital Appointment"),
        ("CHAT", "Phone Chat"),
        ("ANY", "Other"),
    )

STATUS_CHOICES = (
        ("OP", "Open"),
        ("EXP", "Expired"),
        ("AS", "Assigned"),
        ("CL", "Canceled"),
        ("DN", "Completed"),
)


class TaskType(models.Model):
    task_type = models.CharField(max_length=5, choices=TASK_TYPE_CHOICES)
    min_duration = models.IntegerField()
    DBS_required = models.BooleanField()


class Task(models.Model):
    task_type = models.ForeignKey(TaskType, on_delete=models.CASCADE)
    owner = models.ForeignKey(Requestee, on_delete=models.CASCADE)
    volunteer = models.ForeignKey(Volunteer, on_delete=models.CASCADE, blank=True)
    task_type = models.CharField(max_length=5, choices=TASK_TYPE_CHOICES)
    description = models.TextField(default='', blank=True)
    dbs_needed = models.BooleanField(default=False)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    min_duration = models.DurationField(default=timedelta(minutes=30))
    status = models.CharField(max_length=5, choices=STATUS_CHOICES, default="OP")

    def clean(self):
        if self.task_type in ["ANY", "GRO"] and not self.description:
            raise ValidationError(f"Description is mandatory when '{self.task_type}' task type selected")
        # if self.end_time <= timezone.now():
        #     raise ValidationError("End time cannot be in the past")
        if self.start_time >= self.end_time:
            raise ValidationError("Start time should be earlier than end time")
        if max(self.start_time, timezone.now()) + self.min_duration > self.end_time:
            raise ValidationError("Not enough time to complete your task. Consider increasing End time value.")

    def _str_(self):
        return f"{self.get_type_display()}: {self.description}"

    class Meta:
        ordering = ['start_time']


