from django.urls import path
from friend import views
urlpatterns = [
    path('friends/', views.FriendListCreateAPIView.as_view()),
    path('friends/requests/', views.RequestListCreateAPIView.as_view()),
    path('friends/requests/<int:id>/', views.RequestDetailsAPIView.as_view()),
    path('friends/<int:id>/', views.FriendDetailsAPIView.as_view()),
]


