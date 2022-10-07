from django.urls import path
from post import views
urlpatterns = [
    path('posts/', views.ListCreateAPIView.as_view()),
    path('posts/upload/', views.CreatePhotoAPIView.as_view()),
    path('posts/all/', views.AllPostsAPIView.as_view()),
    path('posts/<int:pk>/', views.DetailsAPIView.as_view()),
]



