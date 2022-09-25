from django.urls import path
from member import views
urlpatterns = [
    path('members/', views.ListCreateAPIView.as_view()),
    path('members/by-community/', views.ByCommunityAPIView.as_view()),
    path('members/<int:pk>/', views.DetailsAPIView.as_view()),
]




