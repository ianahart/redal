from django.urls import path
from account import views
urlpatterns = [
    path('account/refresh/', views.RetreiveUserAPIView.as_view()),
    path('account/settings/', views.AccountSettingsListCreateAPIView.as_view()),
    path('account/settings/email/<int:pk>/', views.AccountSettingsEmailAPIView.as_view()),
    path('account/settings/gender/<int:pk>/', views.AccountSettingsGenderAPIView.as_view()),
    path('account/settings/country/<int:pk>/', views.AccountSettingsCountryAPIView.as_view()),
    path('account/<int:pk>/', views.DetailsAPIView.as_view()),
]

