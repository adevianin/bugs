from django.urls import path

from django.conf import settings
from django.conf.urls.static import static

from .views.account import check_username, user_register, user_login, user_logout
from .views.home import index
from .views.admin import admin_panel, world_status_check, stop_world, run_world, save_world
from .views.nest import add_egg, change_egg_caste
from .views.colony import stop_operation, build_new_sub_nest, destroy_nest, pillage_nest
from .views.ant import fly_nuptial_flight
from .views.nuptial import search_nuptial_males, found_colony, save_my_specie

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

    path('world/nests/<int:nest_id>/add_egg', add_egg, name='add_egg'),
    path('world/nests/<int:nest_id>/eggs/<str:egg_id>/change_caste', change_egg_caste, name='change-egg-caste'),

    path('world/colonies/<int:colony_id>/operations/<int:operation_id>/stop_operation', stop_operation, name='stop_operation'),
    path('world/colonies/<int:colony_id>/operations/build_new_sub_nest', build_new_sub_nest, name='build_new_sub_nest'),
    path('world/colonies/<int:colony_id>/operations/destroy_nest', destroy_nest, name='destroy_nest'),
    path('world/colonies/<int:colony_id>/operations/pillage_nest', pillage_nest, name='pillage_nest'),
    
    path('world/ants/<int:ant_id>/fly_nuptial_flight', fly_nuptial_flight, name='fly_nuptial_flight'),

    path('world/nuptial_environment/search_nuptial_males', search_nuptial_males, name='search_nuptial_males'),
    path('world/nuptial_environment/found_colony', found_colony, name='found_colony'),
    # path('world/nuptial_environment/specie', get_my_specie, name='get_my_specie'),
    path('world/nuptial_environment/specie', save_my_specie, name='save_my_specie'),



] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)