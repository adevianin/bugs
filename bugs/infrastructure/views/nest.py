from django.views.decorators.http import require_POST
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse, HttpRequest, JsonResponse
# from core.world.entities.ant.base.ant_types import AntTypes
from infrastructure.engine.engine_facade import EngineFacade
from infrastructure.utils.clean_str_param import clean_str_param

import json

@require_POST
@login_required     
def rename_nest(request: HttpRequest, nest_id: int):
    try:
        data = json.loads(request.body)
        name = clean_str_param(data['name'])
    except Exception as e:
        return HttpResponse(status=400)

    ef = EngineFacade.get_instance()
    ef.rename_nest_command(request.user.id, nest_id, name)

    return HttpResponse(status=204)

@require_POST
@login_required     
def lay_egg(request: HttpRequest, nest_id: int):
    try:
        data = json.loads(request.body)
        name = clean_str_param(data['name'])
        is_fertilized = bool(data['is_fertilized'])
    except Exception as e:
        return HttpResponse(status=400)

    ef = EngineFacade.get_instance()
    egg = ef.add_egg_command(request.user.id, nest_id, name, is_fertilized)
    
    return JsonResponse({
        'egg': egg
    }, status=201)

@require_POST
@login_required     
def change_egg_caste(request: HttpRequest, nest_id: int, egg_id: int):
    try:
        data = json.loads(request.body)
        ant_type = data['ant_type']
    except Exception as e:
        return HttpResponse(status=400)
    
    ef = EngineFacade.get_instance()
    ef.change_egg_caste_command(request.user.id, nest_id, egg_id, ant_type)

    return HttpResponse(status=204)

@require_POST
@login_required     
def change_egg_name(request: HttpRequest, nest_id: int, egg_id: int):
    try:
        data = json.loads(request.body)
        name = clean_str_param(data['name'])
    except Exception as e:
        return HttpResponse(status=400)

    ef = EngineFacade.get_instance()
    ef.change_egg_name_command(request.user.id, nest_id, egg_id, name)

    return HttpResponse(status=204)

@require_POST
@login_required     
def move_egg_to_larva_chamber(request: HttpRequest, nest_id: int, egg_id: int):
    ef = EngineFacade.get_instance()
    larva = ef.move_egg_to_larva_chamber_command(request.user.id, nest_id, egg_id)

    if not larva:
        return HttpResponse(status=400)
    
    return JsonResponse({
        'larva': larva
    }, status=201)

@require_POST
@login_required     
def delete_egg(request: HttpRequest, nest_id: int, egg_id: int):
    ef = EngineFacade.get_instance()
    ef.delete_egg_command(request.user.id, nest_id, egg_id)
    return HttpResponse(status=204)

@require_POST
@login_required     
def delete_larva(request: HttpRequest, nest_id: int, larva_id: int):
    ef = EngineFacade.get_instance()
    ef.delete_larva_command(request.user.id, nest_id, larva_id)
    return HttpResponse(status=204)