from django.urls import path

from django.conf import settings
from django.conf.urls.static import static

from .views.account import check_username, user_register, user_login, user_logout
from .views.home import index
from .views.admin import admin_panel, world_status_check, stop_world, run_world, save_world
from .views.nest import add_larva
from .views.colony import stop_operation, build_new_sub_nest, destroy_nest, pillage_nest
from .views.ant import fly_nuptial_flight

urlpatterns = [
    path('', index, name='index'),
    path('users/username_unique_check', check_username, name='username-unique-check'),
    path('users', user_register, name='user-registration'),
    path('users/login', user_login, name='user-login'),
    path('users/logout', user_logout, name='user-logout'),

    path('admin', admin_panel, name='admin-panel'),
    path('admin/world/status', world_status_check, name='world-status'),
    path('admin/world/stop', stop_world, name='stop-world'),
    path('admin/world/run', run_world, name='run-world'),
    path('admin/world/save', save_world, name='save-world'),

    path('world/nests/<int:nest_id>/add_larva', add_larva, name='add_larva'),

    path('world/colonies/<int:colony_id>/operations/<int:operation_id>/stop_operation', stop_operation, name='stop_operation'),
    path('world/colonies/<int:colony_id>/operations/build_new_sub_nest', build_new_sub_nest, name='build_new_sub_nest'),
    path('world/colonies/<int:colony_id>/operations/destroy_nest', destroy_nest, name='destroy_nest'),
    path('world/colonies/<int:colony_id>/operations/pillage_nest', pillage_nest, name='pillage_nest'),
    
    path('world/ants/<int:ant_id>/fly_nuptial_flight', fly_nuptial_flight, name='fly_nuptial_flight'),



] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)