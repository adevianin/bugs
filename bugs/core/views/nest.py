from django.views.decorators.http import require_POST
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse, HttpRequest
from core.world.world_facade import WorldFacade
from core.world.entities.ant.base.ant_types import AntTypes

import json

@require_POST
@login_required     
def rename_nest(request: HttpRequest, nest_id: int):
    data = json.loads(request.body)
    name = data['name']

    wf = WorldFacade.get_instance()
    wf.rename_nest_command(request.user.id, nest_id, name)

    return HttpResponse(status=200)

@require_POST
@login_required     
def add_egg(request: HttpRequest, nest_id: int):
    data = json.loads(request.body)
    name = data['name']
    is_fertilized = data['is_fertilized']

    wf = WorldFacade.get_instance()

    wf.add_egg_command(request.user.id, nest_id, name, is_fertilized)

    return HttpResponse(status=200)

@require_POST
@login_required     
def change_egg_caste(request: HttpRequest, nest_id: int, egg_id: int):
    data = json.loads(request.body)
    ant_type = AntTypes(data['ant_type'])

    wf = WorldFacade.get_instance()

    wf.change_egg_caste_command(request.user.id, nest_id, egg_id, ant_type)

    return HttpResponse(status=200)

@require_POST
@login_required     
def change_egg_name(request: HttpRequest, nest_id: int, egg_id: int):
    data = json.loads(request.body)
    name = data['name']

    wf = WorldFacade.get_instance()

    wf.change_egg_name_command(request.user.id, nest_id, egg_id, name)

    return HttpResponse(status=200)

@require_POST
@login_required     
def move_egg_to_larva_chamber(request: HttpRequest, nest_id: int, egg_id: int):
    wf = WorldFacade.get_instance()
    wf.move_egg_to_larva_chamber_command(request.user.id, nest_id, egg_id)
    return HttpResponse(status=200)

@require_POST
@login_required     
def delete_egg(request: HttpRequest, nest_id: int, egg_id: int):
    wf = WorldFacade.get_instance()
    wf.delete_egg_command(request.user.id, nest_id, egg_id)
    return HttpResponse(status=200)

@require_POST
@login_required     
def delete_larva(request: HttpRequest, nest_id: int, larva_id: int):
    wf = WorldFacade.get_instance()
    wf.delete_larva_command(request.user.id, nest_id, larva_id)
    return HttpResponse(status=200)