from django.urls import path
from . import views

urlpatterns = [
    path('register', views.UserRegister.as_view(), name='register'),
	path('logout', views.UserLogout.as_view(), name='logout'),
	path('user', views.UserView.as_view(), name='user'),
    path('user/<int:user_id>/', views.UserByIDView.as_view(), name='userbyid'),
    path('reset-password/<int:pk>/', views.PasswordReset.as_view(), name='reset-password'),
]
