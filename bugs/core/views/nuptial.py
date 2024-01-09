from django.views.decorators.http import require_GET
from django.contrib.auth.decorators import login_required
from django.http import HttpRequest, JsonResponse
from core.world.world_facade import WorldFacade

@require_GET
@login_required     
def search_nuptial_males(request: HttpRequest):
    wf = WorldFacade.get_instance()

    nuptial_males = wf.generate_nuptial_males_for_client(request.user.id)

    return JsonResponse({ 
        'nuptial_males': nuptial_males
    }, status=200)