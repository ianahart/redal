from django.urls import path
from post import views
urlpatterns = [
    path('members/', views.ListCreateAPIView.as_view()),
]




