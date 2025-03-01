from django.shortcuts import render
from django.contrib.auth.decorators import user_passes_test
from django.http import JsonResponse, HttpRequest, HttpResponse
from django.views.decorators.http import require_POST, require_GET
from core.world.world_facade import WorldFacade
import json
from django.views.decorators.csrf import ensure_csrf_cookie

def is_superuser(user):
    return user.is_superuser

def _build_world_status():
    wf = WorldFacade.get_instance()
    return {
        'isInited': wf.is_world_inited,
        'isRunning': wf.is_world_running
    }

@user_passes_test(is_superuser)
@ensure_csrf_cookie
def admin_index(request):
    return render(request, 'client/admin.html')

@user_passes_test(is_superuser)
@require_GET
def world_status_check(request):
    return JsonResponse(
        {
            'status': _build_world_status()
        },
        headers={
            'Cache-Control': 'no-cache, no-store, must-revalidate'
        }
    )

@user_passes_test(is_superuser)
@require_POST
def init_world(request):
    worldFacade = WorldFacade.get_instance()
    worldFacade.init_world_admin_command()
    return JsonResponse({
        'status': _build_world_status()
    }) 

@user_passes_test(is_superuser)
@require_POST
def stop_world(request):
    worldFacade = WorldFacade.get_instance()
    worldFacade.stop_world_admin_command()
    return JsonResponse({
        'status': _build_world_status()
    }) 

@user_passes_test(is_superuser)
@require_POST
def run_world(request):
    worldFacade = WorldFacade.get_instance()
    worldFacade.run_world_admin_command()
    return JsonResponse({
        'status': _build_world_status()
    }) 

@user_passes_test(is_superuser)
@require_POST
def save_world(request):
    worldFacade = WorldFacade.get_instance()
    worldFacade.save_world_admin_command()
    return JsonResponse({
        'status': 'saved'
    }) 

@user_passes_test(is_superuser)
@require_POST
def expand_map(request: HttpRequest):
    wf = WorldFacade.get_instance()
    try:
        data = json.loads(request.body)
        chunk_rows = int(data['chunk_rows'])
        chunk_cols = int(data['chunk_cols'])
    except Exception as e:
        return HttpResponse(status=400)

    error_msg = wf.expand_map_admin_command(chunk_rows, chunk_cols)

    if error_msg:
        return JsonResponse({
            'status': 'error',
            'msg': error_msg
        }, status=409)
    else:
        return JsonResponse({
            'status': 'success'
        }, status=200)
