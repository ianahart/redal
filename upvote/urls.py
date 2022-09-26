from django.urls import path
from upvote import views
urlpatterns = [
    path('upvotes/', views.ListCreateAPIView.as_view()),
    path('upvotes/<int:pk>/', views.DetailsAPIView.as_view()),
]




