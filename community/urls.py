from django.urls import path
from community import views
urlpatterns = [
    path('community/create/', views.CreateCommunityAPIView.as_view()),
    path('community/names/', views.ListCommunityNameAPIView.as_view()),
    path('community/search/', views.SearchCommunityAPIView.as_view()),
    path('community/', views.ListCreateAPIView.as_view()),
]


