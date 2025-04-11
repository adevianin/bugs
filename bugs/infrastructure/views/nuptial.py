from django.views.decorators.http import require_GET, require_POST
from django.contrib.auth.decorators import login_required
from django.http import HttpRequest, HttpResponse
from infrastructure.engine.engine_facade import EngineFacade
from infrastructure.utils.clean_str_param import clean_str_param

import json

@require_POST
@login_required     
def found_colony(request: HttpRequest):
    ef = EngineFacade.get_instance()

    try:
        data = json.loads(request.body)
        queen_id = int(data['queen_id'])
        nuptial_male_id = int(data['nuptial_male_id'])
        nest_building_site = data['nest_building_site']
        colony_name = clean_str_param(data['colony_name'])
    except Exception as e:
        return HttpResponse(status=400)

    ef.found_colony_command(request.user.id, queen_id, nuptial_male_id, nest_building_site, colony_name)

    return HttpResponse(status=204)

@require_POST
@login_required     
def save_specie_schema(request: HttpRequest):
    ef = EngineFacade.get_instance()

    try:
        data = json.loads(request.body)
        specie_schema = data['specie_schema']
    except Exception as e:
        return HttpResponse(status=400)
    
    ef.change_specie_schema_command(request.user.id, specie_schema)

    return HttpResponse(status=200)
    
@require_POST
@login_required     
def born_new_antara(request: HttpRequest):
    ef = EngineFacade.get_instance()

    ef.born_new_antara_command(request.user.id)

    return HttpResponse(status=200)