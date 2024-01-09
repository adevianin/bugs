from django.views.decorators.http import require_POST
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse, HttpRequest
from core.world.world_facade import WorldFacade
from core.world.entities.ant.base.ant_types import AntTypes

import json

@require_POST
@login_required     
def add_larva(request: HttpRequest, nest_id: int):
    data = json.loads(request.body)
    larva_type = AntTypes(data['larva_type'])

    wf = WorldFacade.get_instance()

    wf.add_larva_command(request.user.id, nest_id, larva_type)

    return HttpResponse(status=200)