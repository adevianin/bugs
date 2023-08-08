from django.core.management.base import BaseCommand
from core.models import World

# python bugs/manage.py build_savable_world
class Command(BaseCommand):
    help = 'Creates savable world'

    world_state = {
        "map":{
            "size":{
                "width":3000,
                "height":3000
            }
        },
        "last_used_id":60,
        "ants":[
            {
                "id":1,
                "type":"ant",
                "from_colony":2,
                "hp": 100,
                "position":[
                    610,
                    350
                ],
                "located_in_nest_id":None,
                "picked_food_id":None,
                "ant_type":"worker",
                "dna_profile":"e41e2924-ad6c-431e-836b-e399366bf000",
                "from_nest":30,
                "thoughts":[
                ],
                "memory": {},
                "is_auto_thought_generation": True,
                "is_in_operation": False
            },
            {
                "id":2,
                "type":"ant",
                "from_colony":2,
                "hp": 300,
                "position":[
                    650,
                    350
                ],
                "located_in_nest_id":30,
                "picked_food_id":None,
                "ant_type":"queen",
                "dna_profile":"e41e2924-ad6c-431e-836b-e399366bf000",
                "from_nest":30,
                "thoughts":[
                    
                ],
                "memory": {},
                "is_auto_thought_generation": True,
                "is_in_operation": False
            }
        ],
        "foods":[
            {
                "id":20,
                "type":"food",
                "from_colony":None,
                "hp": 100,
                "position":[
                    350,
                    350
                ],
                "calories":150,
                "food_type":"leaf",
                "food_variety":1,
                "is_picked": False
            },
            {
                "id":21,
                "type":"food",
                "from_colony":None,
                "hp": 100,
                "position":[
                    850,
                    350
                ],
                "calories":300,
                "food_type":"leaf",
                "food_variety":2,
                "is_picked": False
            }
        ],
        "nests":[
            {
                "id":30,
                "type":"nest",
                "from_colony":2,
                "hp": 1000,
                "position":[
                    600,
                    350
                ],
                "stored_calories":1000,
                "larvae":[
                    # {
                    #     "ant_type":"warrior",
                    #     "ate_calories":440.0,
                    #     "dna_profile":"e41e2924-ad6c-431e-836b-e399366bf000"
                    # },
                    # {
                    #     "ant_type":"warrior",
                    #     "ate_calories":440.0,
                    #     "dna_profile":"e41e2924-ad6c-431e-836b-e399366bf000"
                    # },
                    # {
                    #     "ant_type":"warrior",
                    #     "ate_calories":440.0,
                    #     "dna_profile":"e41e2924-ad6c-431e-836b-e399366bf000"
                    # }
                ],
                "larva_places_count":3,
                "area":300,
                "build_progress": 100
            },
            {
                "id":31,
                "type":"nest",
                "from_colony":1,
                "hp": 1000,
                "position":[
                    1600,
                    450
                ],
                "stored_calories":1000,
                "larvae":[
                    # {
                    #     "ant_type":"warrior",
                    #     "ate_calories":440.0,
                    #     "dna_profile":"e41e2924-ad6c-431e-836b-e399366bf001"
                    # },
                    # {
                    #     "ant_type":"worker",
                    #     "ate_calories":99,
                    #     "dna_profile":"e41e2924-ad6c-431e-836b-e399366bf001"
                    # },
                    # {
                    #     "ant_type":"worker",
                    #     "ate_calories":99,
                    #     "dna_profile":"e41e2924-ad6c-431e-836b-e399366bf001"
                    # },
                ],
                "larva_places_count":1,
                "area":300,
                "build_progress": 100
            },
            {
                "id":32,
                "type":"nest",
                "from_colony":1,
                "hp": 1000,
                "position":[
                    2150,
                    450
                ],
                "stored_calories":1000,
                "larvae":[
                    # {
                    #     "ant_type":"warrior",
                    #     "ate_calories":440.0,
                    #     "dna_profile":"e41e2924-ad6c-431e-836b-e399366bf001"
                    # },
                    # {
                    #     "ant_type":"warrior",
                    #     "ate_calories":440.0,
                    #     "dna_profile":"e41e2924-ad6c-431e-836b-e399366bf001"
                    # }
                ],
                "larva_places_count":1,
                "area":300,
                "build_progress": 100
            },
        ],
        "food_areas":[
            {
                "id":40,
                "type":"food_area",
                "from_colony":None,
                "hp": 100,
                "position":[
                    450,
                    300
                ],
                "size":[
                    150,
                    150
                ],
                "fertility":5,
                "food_type":"leaf"
            },
            {
                "id":41,
                "type":"food_area",
                "from_colony":None,
                "hp": 100,
                "position":[
                    1800,
                    400
                ],
                "size":[
                    150,
                    150
                ],
                "fertility":5,
                "food_type":"nectar"
            }
        ],
        "food_sources": [
            {
                "id":50,
                "type":"food_source",
                "from_colony": None,
                "hp": 100,
                "position":[
                    800,
                    350
                ],
                "fertility":5,
                "food_type":"honeydew",
                "calories": 10
            },
        ],
        "colonies":[
            {
                "id":1,
                "owner_id":1,
                "operations":[
                    
                ]
            },
            {
                "id":2,
                "owner_id":2,
                "operations":[
                    
                ]
            }
        ],
        "colonies_relations": [
            { "colony_ids": [1, 2], "value": -1 }
        ]
    }

    def handle(self, *args, **options):
        world, created = World.objects.update_or_create(id=1, defaults={
            'state': self.world_state
        })
        print('world saved')