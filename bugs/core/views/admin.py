from django.shortcuts import render
from django.contrib.auth.decorators import user_passes_test
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from core.world.world_facade import WorldFacade

def is_superuser(user):
    return user.is_superuser

@user_passes_test(is_superuser)
def admin_panel(request):
    return render(request, 'core/admin_panel.html')

@user_passes_test(is_superuser)
@require_POST
def world_status_check(request):
    return JsonResponse({
        'status': WorldFacade.get_instance().is_world_running()
    })

@user_passes_test(is_superuser)
@require_POST
def stop_world(request):
    worldFacade = WorldFacade.get_instance()
    worldFacade.stop()
    return JsonResponse({
        'status': worldFacade.is_world_running()
    }) 

@user_passes_test(is_superuser)
@require_POST
def run_world(request):
    worldFacade = WorldFacade.get_instance()
    worldFacade.run()
    return JsonResponse({
        'status': worldFacade.is_world_running()
    }) 
