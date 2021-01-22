from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from accounts.views import AccountView
from tasks.views import TaskView, RequesteeTasksView


router = routers.DefaultRouter()
router.register(r'accounts', AccountView, 'user')
router.register(r'tasks', TaskView, 'task')
router.register(r'requestee/tasks', RequesteeTasksView, 'reqtask')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls))
]