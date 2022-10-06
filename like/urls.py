from django.urls import path
from like import views
urlpatterns = [
    path('likes/', views.ListCreateAPIView.as_view()),
    path('likes/<int:pk>/', views.DetailsAPIView.as_view()),
]

