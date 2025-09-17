from django.shortcuts import render
from django.contrib.auth.decorators import user_passes_test
from django.http import JsonResponse, HttpRequest, HttpResponse
from django.views.decorators.http import require_POST, require_GET
from infrastructure.engine.engine_adapter import EngineAdapter
import json
from django.views.decorators.csrf import ensure_csrf_cookie

def is_superuser(user):
    return user.is_superuser

def _build_world_status():
    ea = EngineAdapter.get_instance()
    world_status = ea.get_world_status()
    return {
        'isInited': world_status['is_world_inited'],
        'isRunning': world_status['is_world_stepping'],
        'playersOnline': world_status['players_online']
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
    ea = EngineAdapter.get_instance()
    ea.init_world_admin_command()
    return JsonResponse({
        'status': _build_world_status()
    }) 

@user_passes_test(is_superuser)
@require_POST
def stop_world(request):
    ea = EngineAdapter.get_instance()
    ea.stop_world_admin_command()
    return JsonResponse({
        'status': _build_world_status()
    }) 

@user_passes_test(is_superuser)
@require_POST
def run_world(request):
    ea = EngineAdapter.get_instance()
    ea.run_world_admin_command()
    return JsonResponse({
        'status': _build_world_status()
    }) 

@user_passes_test(is_superuser)
@require_POST
def save_world(request):
    ea = EngineAdapter.get_instance()
    ea.save_world_admin_command()
    return JsonResponse({
        'status': 'saved'
    }) 

@user_passes_test(is_superuser)
@require_POST
def count_ants(request):
    ea = EngineAdapter.get_instance()
    ants_count = ea.count_ants_command()
    return JsonResponse({
        'ants_count': ants_count
    }, status=200)

@user_passes_test(is_superuser)
@require_POST
def populate_for_performance_test(request):
    ea = EngineAdapter.get_instance()
    ea.populate_for_performance_test_command(request.user.id)
    return HttpResponse(status=201) 

@user_passes_test(is_superuser)
@require_POST
def expand_map(request: HttpRequest):
    ea = EngineAdapter.get_instance()
    try:
        data = json.loads(request.body)
        chunk_rows = int(data['chunk_rows'])
        chunk_cols = int(data['chunk_cols'])
    except Exception as e:
        return HttpResponse(status=400)

    error_msg = ea.expand_map_admin_command(chunk_rows, chunk_cols)

    if error_msg:
        return JsonResponse({
            'status': 'error',
            'msg': error_msg
        }, status=409)
    else:
        return JsonResponse({
            'status': 'success'
        }, status=200)
    
@user_passes_test(is_superuser)
@require_GET
def get_world_data(request: HttpRequest):
    ea = EngineAdapter.get_instance()

    world_data = ea.get_world_data()
    json_data = json.dumps(world_data, indent=4)

    response = HttpResponse(json_data, content_type='application/json')
    response['Content-Disposition'] = 'attachment; filename="world_data.json"'

    return response
