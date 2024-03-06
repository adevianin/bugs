from django.views.decorators.http import require_POST
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse, HttpRequest
from core.world.world_facade import WorldFacade
from core.world.entities.ant.base.ant_types import AntTypes

import json

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