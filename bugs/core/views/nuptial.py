from django.views.decorators.http import require_GET, require_POST
from django.contrib.auth.decorators import login_required
from django.http import HttpRequest, JsonResponse, HttpResponse
from core.world.world_facade import WorldFacade
from core.world.utils.point import Point

import json

@require_GET
@login_required     
def search_nuptial_males(request: HttpRequest):
    wf = WorldFacade.get_instance()

    nuptial_males = wf.generate_nuptial_males_for_client(request.user.id)

    return JsonResponse({ 
        'nuptial_males': nuptial_males
    }, status=200)

@require_POST
@login_required     
def found_colony(request: HttpRequest):
    data = json.loads(request.body)
    wf = WorldFacade.get_instance()

    queen_id = data['queen_id']
    nuptial_male_id = data['nuptial_male_id']
    nest_building_site = Point.from_json(data['nest_building_site'])

    wf.found_colony_command(request.user.id, queen_id, nuptial_male_id, nest_building_site)

    return HttpResponse(status=200)

@require_GET
@login_required     
def get_my_specie(request: HttpRequest):
    wf = WorldFacade.get_instance()

    specie_builder_json = wf.get_specie_for_client(request.user.id)

    return JsonResponse(specie_builder_json, status=200)