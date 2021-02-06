from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from accounts.views import AccountView, ReqNearbyVolsView
from tasks.views import TaskView, TaskTypeView, RequesteeTasksView, VolTaskView


router = routers.DefaultRouter()
router.register(r'accounts', AccountView, 'user')
router.register(r'tasks/get_vol_task', VolTaskView, 'voltasks')
router.register(r'tasks', TaskView, 'task')
router.register(r'tasktypes', TaskTypeView, 'tasktype')
router.register(r'requestee/tasks', RequesteeTasksView, 'reqtask')
router.register(r'requestee/nearby_vols', ReqNearbyVolsView, 'reqvols')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls))
]