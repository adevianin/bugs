from django.views.decorators.http import require_POST
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse, HttpRequest
from infrastructure.utils.clean_str_param import clean_str_param
from infrastructure.engine.engine_facade import EngineFacade

import json

@require_POST
@login_required     
def stop_operation(request: HttpRequest, colony_id: int, operation_id: str):
    ef = EngineFacade.get_instance()
    ef.stop_operation_command(request.user.id, colony_id, operation_id)
    return HttpResponse(status=204)

@require_POST
@login_required     
def build_new_sub_nest(request: HttpRequest, colony_id: int):
    ef = EngineFacade.get_instance()

    try:
        data = json.loads(request.body)
        building_site = data['building_site']
        workers_count = int(data['workers_count'])
        warriors_count = int(data['warriors_count'])
        nest_name = clean_str_param(data['nest_name'])
    except Exception as e:
        return HttpResponse(status=400)

    ef.build_new_sub_nest_operation_command(request.user.id, colony_id, building_site, workers_count, warriors_count, nest_name)
    
    return HttpResponse(status=204)

@require_POST
@login_required     
def destroy_nest(request: HttpRequest, colony_id: int):
    ef = EngineFacade.get_instance()

    try:
        data = json.loads(request.body)
        nest_id = int(data['nest_id'])
        warriors_count = int(data['warriors_count'])
        workers_count = int(data['workers_count'])
    except Exception as e:
        return HttpResponse(status=400)

    ef.destroy_nest_operation_command(request.user.id, colony_id, nest_id, workers_count, warriors_count)

    return HttpResponse(status=204)

@require_POST
@login_required     
def pillage_nest(request: HttpRequest, colony_id: int):
    ef = EngineFacade.get_instance()

    try:
        data = json.loads(request.body)
        nest_to_pillage_id = int(data['nest_to_pillage_id'])
        nest_for_loot_id = int(data['nest_for_loot_id'])
        workers_count = int(data['workers_count'])
        warriors_count = int(data['warriors_count'])
    except Exception as e:
        return HttpResponse(status=400)

    ef.pillage_nest_operation_command(request.user.id, colony_id, nest_to_pillage_id, nest_for_loot_id, workers_count, warriors_count)

    return HttpResponse(status=204)

@require_POST
@login_required     
def transport_food(request: HttpRequest, colony_id: int):
    ef = EngineFacade.get_instance()

    try:
        data = json.loads(request.body)
        from_nest_id = int(data['from_nest_id'])
        to_nest_id = int(data['to_nest_id'])
        workers_count = int(data['workers_count'])
        warriors_count = int(data['warriors_count'])
    except Exception as e:
        return HttpResponse(status=400)

    ef.transport_food_operation_command(request.user.id, colony_id, from_nest_id, to_nest_id, workers_count, warriors_count)

    return HttpResponse(status=204)

@require_POST
@login_required     
def build_fortification(request: HttpRequest, colony_id: int):
    ef = EngineFacade.get_instance()

    try:
        data = json.loads(request.body)
        nest_id = int(data['nest_id'])
        workers_count = int(data['workers_count'])
    except Exception as e:
        return HttpResponse(status=400)

    ef.build_fortification_operation_command(request.user.id, colony_id, nest_id, workers_count)

    return HttpResponse(status=204)

@require_POST
@login_required     
def bring_bug(request: HttpRequest, colony_id: int):
    ef = EngineFacade.get_instance()

    try:
        data = json.loads(request.body)
        nest_id = int(data['nest_id'])
    except Exception as e:
        return HttpResponse(status=400)

    ef.bring_bug_operation_command(request.user.id, colony_id, nest_id)
    
    return HttpResponse(status=204)