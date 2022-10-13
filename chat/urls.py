from django.urls import path
from chat import views
urlpatterns = [
    path('chat/messages/', views.MessageListCreateAPIView.as_view()),
    path('chat/groups/', views.GroupListCreateAPIView.as_view()),
    path('chat/groups/<int:pk>/', views.GroupDetailsAPIView.as_view()),
]


