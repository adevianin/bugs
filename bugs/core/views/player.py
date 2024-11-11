from django.views.decorators.http import require_GET, require_POST
from django.contrib.auth.decorators import login_required
from django.http import HttpRequest, JsonResponse, HttpResponse
from core.world.world_facade import WorldFacade

@require_POST
@login_required     
def born_new_antara(request: HttpRequest):
    wf = WorldFacade.get_instance()

    wf.born_new_antara_command(request.user.id)

    return HttpResponse(status=200)