from django.http import JsonResponse, HttpResponse
from django.views.decorators.http import require_POST
from django.contrib.auth.decorators import login_required
from core.world.world_facade import WorldFacade
from core.world.entities.ant.base.ant_types import AntTypes

@require_POST
@login_required
def add_larva(request, town_id):
    try:
        WorldFacade.get_instance().add_larva(town_id, request.user.id, request.json['larvaType'])
    except:
        return HttpResponse(status=500)

    return HttpResponse(status=201)