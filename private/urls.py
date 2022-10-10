from django.urls import path
from private import views
urlpatterns = [
    path('privates/', views.ListCreateAPIView.as_view()),
]


