from django.views.decorators.http import require_GET, require_POST
from django.contrib.auth.decorators import login_required
from django.http import HttpRequest, JsonResponse, HttpResponse
from core.world.world_facade import WorldFacade
from core.world.utils.point import Point
from core.world.entities.ant.base.nuptial_environment.specie_builder.specie_schema import SpecieSchema

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

@require_POST
@login_required     
def save_my_specie(request: HttpRequest):
    data = json.loads(request.body)
    wf = WorldFacade.get_instance()

    body = data['specie']['body']
    development = data['specie']['development']
    adaptation = data['specie']['adaptation']
    building = data['specie']['building']
    combat = data['specie']['combat']
    adjusting = data['specie']['adjusting']
    schema = SpecieSchema.build(body, development, adaptation, building, combat, adjusting)
    
    wf.change_specie_schema(request.user.id, schema)

    return HttpResponse(status=200)