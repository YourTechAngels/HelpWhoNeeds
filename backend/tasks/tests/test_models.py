from django.test import TestCase
from tasks.models import Task, TaskType
from accounts.models import User
from django.utils import timezone
from datetime import timedelta

TASK_TYPE_CHOICES = (
        ("GRO", "Groceries"),
        ("PHA", "Pharmacy"),
        ("DOG", "Dog Walk"),
        ("HOS", "Hospital Appointment"),
        ("CHAT", "Phone Chat"),
        ("ANY", "Other"),
    )

class TaskModelTestCase(TestCase):
    def setUp(self):
        self.requestee = User(
            uid = "",
            username = "Kate",
            email = "katekelly@hotmail.com",
            date_of_birth = None,
            phone_number = None,
            post_code = "CO2 9LP",
            address_line_1 = "11 Glebe Raod",
            address_line_2 = " ",
            city = " ",
            county = " ",
            is_volunteer = False           
        )

        self.taskType = TaskType(
            task_type="HOS",
            min_duration=30,
            dbs_required=True
        )
        self.task = Task(   
            task_type= self.taskType,
            requestee = self.requestee,
            volunteer= None,
            description="Hospital Appointment",
            start_time= timezone.now(),
            end_time = timezone.now() + timedelta(minutes=40),
            min_duration = timedelta(minutes=30),
            status = "OP"
        )
        
    
    def test__str__(self):
        self.assertEqual(str(self.task),"Hospital: Hospital Appointment")
    
    def test_task_has_a_requestee(self):              
        self.assertEqual(self.task.requestee,self.requestee)
    
    def test_end_time_is_greater_than_start_time(self):   
        self.assertTrue(self.task.start_time < self.task.end_time)