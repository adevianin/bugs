from django.shortcuts import render
from django.contrib.auth.decorators import user_passes_test
from django.http import JsonResponse, HttpRequest, HttpResponse
from django.views.decorators.http import require_POST, require_GET
from infrastructure.services.providers import get_engine_adapter
import json
from django.views.decorators.csrf import ensure_csrf_cookie
from infrastructure.utils.get_user_id_async import get_user_id_async

def is_superuser(user):
    return user.is_superuser

def check_is_engine_adapter_inited():
    ea = get_engine_adapter()
    return ea is not None

async def _build_world_status():
    ea = get_engine_adapter()
    world_status = await ea.get_world_status()
    return {
        'isInited': world_status['is_world_inited'],
        'isRunning': world_status['is_world_stepping'],
        'playersOnline': world_status['players_online']
    }

@user_passes_test(is_superuser)
@ensure_csrf_cookie
async def admin_index(request):
    if not check_is_engine_adapter_inited():
        from main.init import init
        init()
        
    return render(request, 'client/admin.html')

@user_passes_test(is_superuser)
@require_GET
async def world_status_check(request):
    if not check_is_engine_adapter_inited():
        return HttpResponse(status=503)
    
    return JsonResponse(
        {
            'status': await _build_world_status()
        },
        headers={
            'Cache-Control': 'no-cache, no-store, must-revalidate'
        }
    )

@user_passes_test(is_superuser)
@require_POST
async def init_world(request):
    ea = get_engine_adapter()
    await ea.init_world_admin_command()
    return JsonResponse({
        'status': await _build_world_status()
    }) 

@user_passes_test(is_superuser)
@require_POST
async def stop_world(request):
    ea = get_engine_adapter()
    await ea.stop_world_admin_command()
    return JsonResponse({
        'status': await _build_world_status()
    }) 

@user_passes_test(is_superuser)
@require_POST
async def run_world(request):
    ea = get_engine_adapter()
    await ea.run_world_admin_command()
    return JsonResponse({
        'status': await _build_world_status()
    }) 

@user_passes_test(is_superuser)
@require_POST
async def save_world(request):
    ea = get_engine_adapter()
    await ea.save_world_admin_command()
    return JsonResponse({
        'status': 'saved'
    }) 

@user_passes_test(is_superuser)
@require_POST
async def count_ants(request):
    ea = get_engine_adapter()
    ants_count = await ea.count_ants_command()
    return JsonResponse({
        'ants_count': ants_count
    }, status=200)

@user_passes_test(is_superuser)
@require_POST
async def populate_for_performance_test(request):
    ea = get_engine_adapter()
    user_id = await get_user_id_async(request.user)
    await ea.populate_for_performance_test_command(user_id)
    return HttpResponse(status=201) 

@user_passes_test(is_superuser)
@require_POST
async def expand_map(request: HttpRequest):
    ea = get_engine_adapter()
    try:
        data = json.loads(request.body)
        chunk_rows = int(data['chunk_rows'])
        chunk_cols = int(data['chunk_cols'])
    except Exception as e:
        return HttpResponse(status=400)

    error_msg = await ea.expand_map_admin_command(chunk_rows, chunk_cols)

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
async def get_world_data(request: HttpRequest):
    ea = get_engine_adapter()

    world_data = await ea.get_world_data()
    json_data = json.dumps(world_data, indent=4)

    response = HttpResponse(json_data, content_type='application/json')
    response['Content-Disposition'] = 'attachment; filename="world_data.json"'

    return response
