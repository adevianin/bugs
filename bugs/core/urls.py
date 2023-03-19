from django.urls import path

from django.conf import settings
from django.conf.urls.static import static

from .views.account import UsernameUniqueCheckView, UserRegistrationView, UserLoginView, UserLogoutView
from .views.home import index

urlpatterns = [
    path('', index, name='index'),
    path('users/username_unique_check', UsernameUniqueCheckView.as_view(), name='username-unique-check'),
    path('users', UserRegistrationView.as_view(), name='user-registration'),
    path('users/login', UserLoginView.as_view(), name='user-login'),
    path('users/logout', UserLogoutView.as_view(), name='user-logout')
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)