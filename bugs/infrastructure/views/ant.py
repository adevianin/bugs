from django.views.decorators.http import require_POST
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse, HttpRequest
from infrastructure.engine.engine_adapter import EngineAdapter
import json

@require_POST
@login_required     
def fly_nuptial_flight(request: HttpRequest, ant_id: int):
    ea = EngineAdapter.get_instance()
    ea.fly_nuptial_flight_command(request.user.id, ant_id)
    return HttpResponse(status=204)

@require_POST
@login_required     
def change_ant_guardian_behavior(request: HttpRequest, ant_id: int):
    ea = EngineAdapter.get_instance()
    try:
        data = json.loads(request.body)
        guaridan_behavior = data['guaridan_behavior']
    except Exception as e:
        return HttpResponse(status=400)
    
    ea.change_ant_guardian_behavior_command(request.user.id, ant_id, guaridan_behavior)
    
    return HttpResponse(status=204)

@require_POST
@login_required     
def change_ant_cooperative_behavior(request: HttpRequest, ant_id: int):
    ea = EngineAdapter.get_instance()
    try:
        data = json.loads(request.body)
        is_enabled = bool(data['is_enabled'])
    except Exception as e:
        return HttpResponse(status=400)
    
    ea.change_ant_cooperative_behavior_command(request.user.id, ant_id, is_enabled)
    
    return HttpResponse(status=204)

@require_POST
@login_required     
def relocate_ant(request: HttpRequest, ant_id: int):
    ea = EngineAdapter.get_instance()
    try:
        data = json.loads(request.body)
        nest_id = int(data['nest_id'])
    except Exception as e:
        return HttpResponse(status=400)
    
    ea.relocate_ant_command(request.user.id, ant_id, nest_id)
    
    return HttpResponse(status=204)