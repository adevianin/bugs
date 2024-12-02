from django.views.decorators.http import require_GET, require_POST
from django.contrib.auth.decorators import login_required
from django.http import HttpRequest, JsonResponse, HttpResponse
from core.world.world_facade import WorldFacade
from core.world.utils.point import Point
from core.world.entities.ant.base.genetic.chromosome_types import ChromosomeTypes

import json

@require_POST
@login_required     
def found_colony(request: HttpRequest):
    data = json.loads(request.body)
    wf = WorldFacade.get_instance()

    queen_id = data['queen_id']
    nuptial_male_id = data['nuptial_male_id']
    nest_building_site = Point.from_json(data['nest_building_site'])
    colony_name = data['colony_name']

    wf.found_colony_command(request.user.id, queen_id, nuptial_male_id, nest_building_site, colony_name)

    return HttpResponse(status=200)

@require_POST
@login_required     
def save_specie_schema(request: HttpRequest):
    data = json.loads(request.body)
    wf = WorldFacade.get_instance()

    try:
        specie_schema = {}
        for chromosome_type in data['specie_schema']:
            type = ChromosomeTypes(chromosome_type)
            ids = data['specie_schema'][chromosome_type]
            specie_schema[type] = ids
    except Exception as e:
        return HttpResponse(status=400)
    
    error = wf.change_specie_schema_command(request.user.id, specie_schema)

    if not error:
        return HttpResponse(status=200)
    else:
        return HttpResponse(error, status=400)