from django.urls import path
import views


path('volunteers/', views.VolunteerList.as_view()),
path('volunteers/<int:pk>/', views.VolunteerDetail.as_view()),
path('requestee/', views.RequesteeList.as_view()),
path('requestee/<int:pk>/', views.RequesteeDetail.as_view()),