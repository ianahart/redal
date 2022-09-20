from django.urls import path
from authentication import views
from rest_framework_simplejwt.views import TokenRefreshView
urlpatterns = [
    path('auth/register/', views.RegisterAPIView.as_view()),
    path('auth/login/', views.TokenObtainPairView.as_view()),
    path('auth/logout/', views.LogoutAPIView.as_view()),
    path('auth/refresh/', TokenRefreshView.as_view()),
#    path('auth/forgot-password/', views.ForgotPasswordAPIView.as_view()),
#    path('auth/password-reset/', views.PasswordResetAPIView.as_view()),
]

