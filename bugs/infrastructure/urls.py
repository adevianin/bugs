from django.urls import path

from django.conf import settings
from django.conf.urls.static import static

from .views.account import (check_username_uniqueness, check_email_uniqueness, account_register, account_login, account_logout, 
                            account_index, google_auth_callback, verify_email, reset_password, reset_password_request, set_new_password,
                            change_username, change_email, change_password, verify_email_request)
from .views.game import index
from .views.admin import admin_index, world_status_check, init_world, stop_world, run_world, save_world, expand_map, get_world_data, count_ants, populate_for_performance_test
from .views.theft2 import theft2_index

urlpatterns = [
    path('', index, name='game_index'),
    path('account', account_index, name='account_index'),
    path('admin', admin_index, name='admin_index'),
    path('reset_password', reset_password, name='reset_password'),
    path('verify_email/<uidb64>/<token>/', verify_email, name='verify_email'),
    
    path('api/accounts/check_username_uniqueness', check_username_uniqueness, name='check_username_uniqueness'),
    path('api/accounts/check_email_uniqueness', check_email_uniqueness, name='check_email_uniqueness'),
    path('api/accounts/register', account_register, name='account_register'),
    path('api/accounts/login', account_login, name='account_login'),
    path('api/accounts/logout', account_logout, name='account_logout'),
    path('api/accounts/google_auth_callback', google_auth_callback, name='google_auth_callback'),
    path('api/accounts/reset_password_request', reset_password_request, name='reset_password_request'),
    path('api/accounts/set_new_password', set_new_password, name='set_new_password'),
    path('api/accounts/change_username', change_username, name='change_username'),
    path('api/accounts/change_email', change_email, name='change_email'),
    path('api/accounts/change_password', change_password, name='change_password'),
    path('api/accounts/verify_email_request', verify_email_request, name='verify_email_request'),

    path('api/admin/world/status', world_status_check, name='world_status'),
    path('api/admin/world/init', init_world, name='init_world'),
    path('api/admin/world/stop', stop_world, name='stop_world'),
    path('api/admin/world/run', run_world, name='run_world'),
    path('api/admin/world/save', save_world, name='save_world'),
    path('api/admin/world/count_ants', count_ants, name='count_ants'),
    path('api/admin/world/populate_for_performance_test', populate_for_performance_test, name='populate_for_performance_test'),
    path('api/admin/world/expand_map', expand_map, name='expand_map'),
    path('api/admin/world/get_world_data', get_world_data, name='get_world_data'),

    path('theft2_mini_game', theft2_index, name='theft2_index'),

] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)