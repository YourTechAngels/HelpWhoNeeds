from django.db import models
from datetime import timedelta
from django.core.exceptions import ValidationError
from django.utils import timezone
from accounts.models import User


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
    min_duration = models.IntegerField(default=30)
    dbs_required = models.BooleanField()

    def __str__(self):
        return self.get_task_type_display()

    def __str__(self):
        return self.get_task_type_display()

class Task(models.Model):
    task_type = models.ForeignKey(TaskType, on_delete=models.CASCADE)
    requestee = models.ForeignKey(User, on_delete=models.CASCADE, related_name='requestee')
    volunteer = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=True, related_name='volunteer')
    description = models.TextField(default='', blank=True)
    dbs_required = models.BooleanField(default=False)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    min_duration = models.DurationField(default=timedelta(minutes=30))
    status = models.CharField(max_length=5, choices=STATUS_CHOICES, default="OP")
    
    def clean(self):
        if hasattr(self, "task_type") and self.task_type.task_type in ["ANY", "GRO"] and not self.description:
            raise ValidationError({"description" : f"Description is required when '{self.task_type}' task type selected"})
        if self.end_time and self.end_time <= timezone.now():
            raise ValidationError({"end_time" : "End time cannot be in the past"})
        if self.start_time and self.start_time >= self.end_time:
            raise ValidationError({"start_time" : "Start time should be earlier than end time"})
        if self.start_time and self.end_time and \
            max(self.start_time, timezone.now()) + self.min_duration > self.end_time:
            raise ValidationError({"end_time" : "Not enough time to complete your task. Consider increasing End time value."})

    def __str__(self):
        return f"{self.task_type}: {self.description}"

    class Meta:
        ordering = ['start_time']


