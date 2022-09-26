from django.urls import path
from upvote import views
urlpatterns = [
    path('upvotes/', views.ListCreateAPIView.as_view()),
]




