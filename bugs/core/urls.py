from django.urls import path

from django.conf import settings
from django.conf.urls.static import static

from .views.account import UsernameUniqueCheckView, UserRegistrationView, UserLoginView, UserLogoutView
from .views.home import index
from .views.admin import admin_panel, world_status_check, stop_world, run_world

urlpatterns = [
    path('', index, name='index'),
    path('users/username_unique_check', UsernameUniqueCheckView.as_view(), name='username-unique-check'),
    path('users', UserRegistrationView.as_view(), name='user-registration'),
    path('users/login', UserLoginView.as_view(), name='user-login'),
    path('users/logout', UserLogoutView.as_view(), name='user-logout'),
    path('admin', admin_panel, name='admin-panel'),
    path('admin/world/status', world_status_check, name='world-status'),
    path('admin/world/stop', stop_world, name='stop-world'),
    path('admin/world/run', run_world, name='run-world')
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)