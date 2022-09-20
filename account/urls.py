from django.urls import path
from account import views
urlpatterns = [
    path('account/refresh/', views.RetreiveUserAPIView.as_view()),
]

