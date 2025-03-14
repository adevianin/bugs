from django.urls import path

from django.conf import settings
from django.conf.urls.static import static

from .views.account import (check_username_uniqueness, check_email_uniqueness, account_register, account_login, account_logout, 
                            account_index, google_auth_callback, verify_email, reset_password, reset_password_request, set_new_password,
                            change_username)
from .views.game import index
from .views.admin import admin_index, world_status_check, init_world, stop_world, run_world, save_world, expand_map
from .views.nest import rename_nest, lay_egg, change_egg_caste, change_egg_name, move_egg_to_larva_chamber, delete_egg, delete_larva
from .views.colony import stop_operation, build_new_sub_nest, destroy_nest, pillage_nest, transport_food, build_fortification, bring_bug
from .views.ant import fly_nuptial_flight, change_ant_guardian_behavior, change_ant_cooperative_behavior, relocate_ant
from .views.nuptial import found_colony, save_specie_schema, born_new_antara

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

    path('api/admin/world/status', world_status_check, name='world_status'),
    path('api/admin/world/init', init_world, name='init_world'),
    path('api/admin/world/stop', stop_world, name='stop_world'),
    path('api/admin/world/run', run_world, name='run_world'),
    path('api/admin/world/save', save_world, name='save_world'),
    path('api/admin/world/expand_map', expand_map, name='expand_map'),

    path('api/world/nests/<int:nest_id>/rename', rename_nest, name='rename_nest'),
    path('api/world/nests/<int:nest_id>/lay_egg', lay_egg, name='lay_egg'),
    path('api/world/nests/<int:nest_id>/eggs/<int:egg_id>/change_caste', change_egg_caste, name='change_egg_caste'),
    path('api/world/nests/<int:nest_id>/eggs/<int:egg_id>/change_name', change_egg_name, name='change_egg_name'),
    path('api/world/nests/<int:nest_id>/eggs/<int:egg_id>/move_to_larva_chamber', move_egg_to_larva_chamber, name='move_egg_to_larva_chamber'),
    path('api/world/nests/<int:nest_id>/eggs/<int:egg_id>/delete', delete_egg, name='delete_egg'),

    path('api/world/nests/<int:nest_id>/larvae/<int:larva_id>/delete', delete_larva, name='delete_larva'),

    path('api/world/colonies/<int:colony_id>/operations/<int:operation_id>/stop_operation', stop_operation, name='stop_operation'),
    path('api/world/colonies/<int:colony_id>/operations/build_new_sub_nest', build_new_sub_nest, name='build_new_sub_nest'),
    path('api/world/colonies/<int:colony_id>/operations/destroy_nest', destroy_nest, name='destroy_nest'),
    path('api/world/colonies/<int:colony_id>/operations/pillage_nest', pillage_nest, name='pillage_nest'),
    path('api/world/colonies/<int:colony_id>/operations/transport_food', transport_food, name='transport_food'),
    path('api/world/colonies/<int:colony_id>/operations/build_fortification', build_fortification, name='build_fortification'),
    path('api/world/colonies/<int:colony_id>/operations/bring_bug', bring_bug, name='bring_bug'),
    
    path('api/world/ants/<int:ant_id>/fly_nuptial_flight', fly_nuptial_flight, name='fly_nuptial_flight'),
    path('api/world/ants/<int:ant_id>/guardian_behavior', change_ant_guardian_behavior, name='change_ant_guardian_behavior'),
    path('api/world/ants/<int:ant_id>/cooperative_behavior', change_ant_cooperative_behavior, name='change_ant_cooperative_behavior'),
    path('api/world/ants/<int:ant_id>/relocate', relocate_ant, name='relocate_ant'),

    path('api/world/nuptial_environment/found_colony', found_colony, name='found_colony'),
    path('api/world/nuptial_environment/specie/specie_schema', save_specie_schema, name='save_specie_schema'),
    path('api/world/nuptial_environment/born_new_antara', born_new_antara, name="born_new_antara")

] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)