from django.urls import path
from notification import views
urlpatterns = [
    path('notifications/', views.ListCreateAPIView.as_view()),
    path('notifications/<int:pk>/', views.DetailsAPIView.as_view()),
]





