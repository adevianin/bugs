from django.views.decorators.http import require_POST
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse, HttpRequest
from core.world.world_facade import WorldFacade

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