from django.urls import path
from community import views
urlpatterns = [
    path('community/create/', views.CreateCommunityAPIView.as_view()),
]

