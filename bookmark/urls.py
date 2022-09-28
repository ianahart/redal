from django.urls import path
from bookmark import views
urlpatterns = [
    path('bookmarks/', views.ListCreateAPIView.as_view()),
    path('bookmarks/<int:post_id>/', views.DeleteBookmarkAPIView.as_view()),
    path('bookmarks/<int:id>/', views.DetailsAPIView.as_view()),
]

