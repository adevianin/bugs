from django.views.decorators.http import require_POST
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse, HttpRequest
from core.world.world_facade import WorldFacade

@require_POST
@login_required     
def fly_nuptial_flight(request: HttpRequest, ant_id: int):
    wf = WorldFacade.get_instance()
    wf.fly_nuptian_flight_command(request.user.id, ant_id)
    return HttpResponse(status=200)