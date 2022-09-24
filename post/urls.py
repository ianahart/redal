from django.urls import path
from post import views
urlpatterns = [
    path('posts/', views.ListCreateAPIView.as_view()),
    path('posts/upload/', views.CreatePhotoAPIView.as_view()),
]



