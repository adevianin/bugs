from django.views.decorators.http import require_POST
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse, HttpRequest, JsonResponse
from core.world.world_facade import WorldFacade
from core.world.entities.ant.base.ant_types import AntTypes
from core.world.utils.clean_name import clean_name
from infrastructure.http.http_serializer_facade import HttpSerializersFacade

import json

@require_POST
@login_required     
def rename_nest(request: HttpRequest, nest_id: int):
    try:
        data = json.loads(request.body)
        name = clean_name(data['name'])
    except Exception as e:
        return HttpResponse(status=400)

    wf = WorldFacade.get_instance()
    wf.rename_nest_command(request.user.id, nest_id, name)

    return HttpResponse(status=204)

@require_POST
@login_required     
def lay_egg(request: HttpRequest, nest_id: int):
    try:
        data = json.loads(request.body)
        name = clean_name(data['name'])
        is_fertilized = bool(data['is_fertilized'])
    except Exception as e:
        return HttpResponse(status=400)

    wf = WorldFacade.get_instance()
    egg = wf.add_egg_command(request.user.id, nest_id, name, is_fertilized)
    egg_serializer = HttpSerializersFacade.get_egg_serializer()
    
    return JsonResponse({
        'egg': egg_serializer.serialize_egg(egg)
    } ,status=201)

@require_POST
@login_required     
def change_egg_caste(request: HttpRequest, nest_id: int, egg_id: int):
    try:
        data = json.loads(request.body)
        ant_type = AntTypes(data['ant_type'])
    except Exception as e:
        return HttpResponse(status=400)
    
    wf = WorldFacade.get_instance()
    wf.change_egg_caste_command(request.user.id, nest_id, egg_id, ant_type)

    return HttpResponse(status=204)

@require_POST
@login_required     
def change_egg_name(request: HttpRequest, nest_id: int, egg_id: int):
    try:
        data = json.loads(request.body)
        name = clean_name(data['name'])
    except Exception as e:
        return HttpResponse(status=400)

    wf = WorldFacade.get_instance()
    wf.change_egg_name_command(request.user.id, nest_id, egg_id, name)

    return HttpResponse(status=204)

@require_POST
@login_required     
def move_egg_to_larva_chamber(request: HttpRequest, nest_id: int, egg_id: int):
    wf = WorldFacade.get_instance()
    wf.move_egg_to_larva_chamber_command(request.user.id, nest_id, egg_id)
    
    return HttpResponse(status=204)

@require_POST
@login_required     
def delete_egg(request: HttpRequest, nest_id: int, egg_id: int):
    wf = WorldFacade.get_instance()
    wf.delete_egg_command(request.user.id, nest_id, egg_id)
    return HttpResponse(status=204)

@require_POST
@login_required     
def delete_larva(request: HttpRequest, nest_id: int, larva_id: int):
    wf = WorldFacade.get_instance()
    wf.delete_larva_command(request.user.id, nest_id, larva_id)
    return HttpResponse(status=204)