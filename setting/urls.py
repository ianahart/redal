from django.urls import path
from setting import views
urlpatterns = [
    path('settings/', views.ListCreateAPIView.as_view()),
    path('settings/notifications/<int:pk>/', views.DetailsNotificationAPIView.as_view()),
]





