from django.urls import path
from invite import views
urlpatterns = [
    path('invites/', views.ListCreateAPIView.as_view()),
    path('invites/<int:pk>/', views.DetailsAPIView.as_view()),
]


