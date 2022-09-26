from django.urls import path
from comment import views
urlpatterns = [
    path('comments/', views.ListCreateAPIView.as_view()),
]





