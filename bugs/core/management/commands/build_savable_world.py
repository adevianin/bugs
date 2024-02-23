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
        "last_used_id":70,
        "ants":[
            {
                "id":1,
                "type":"ant",
                "from_colony_id":2,
                "owner_id": 2,
                "hp": 100,
                "position":[
                    610,
                    350
                ],
                "angle": 0,
                "located_in_nest_id":None,
                "picked_item_id":None,
                "ant_type":"worker",
                "from_nest":30,
                "thoughts":[
                ],
                "memory": {},
                "is_auto_thought_generation": True,
                "is_in_operation": False,
                "genome": {
                    "maternal": {
                        "base": [
                            {"type": "base_strength", "domination_code": "A", "strength": 10},
                            {"type": "base_defense", "domination_code": "C", "defense": 5},
                            {"type": "base_max_hp", "domination_code": "B", "max_hp": 200},
                            {"type": "base_hp_regen_rate", "domination_code": "B", "hp_regen_rate": 10},
                            {"type": "base_speed", "domination_code": "D", "speed": 32},
                            {"type": "base_sight_distance", "domination_code": "D", "sight_distance": 200}
                        ],
                        "development": [
                            {"type": "development_queen_caste", "domination_code": "A", "strength": 1.5, "defense": 1, "max_hp": 1, "hp_regen_rate": 0.9, "speed": 0.7},
                            {"type": "development_worker_caste", "domination_code": "B", "strength": 1, "defense": 1.5, "max_hp": 1.5, "hp_regen_rate": 1, "speed": 1},
                            {"type": "development_warrior_caste", "domination_code": "C", "strength": 1.6, "defense": 2, "max_hp": 2, "hp_regen_rate": 1.5, "speed": 1.3},
                        ],
                        "adaptation": [],
                        "building": [],
                        "combat": [],
                        "adjusting": [
                            {"type": "adjusting_appetite", "domination_code": "E"},
                            {"type": "adjusting_development_appetite", "domination_code": "E"}
                        ]
                    },
                    "paternal": {
                        "base": [
                            {"type": "base_strength", "domination_code": "E", "strength": 9},
                            {"type": "base_defense", "domination_code": "C", "defense": 7},
                            {"type": "base_max_hp", "domination_code": "C", "max_hp": 150},
                            {"type": "base_hp_regen_rate", "domination_code": "C", "hp_regen_rate": 20},
                            {"type": "base_speed", "domination_code": "D", "speed": 32},
                            {"type": "base_sight_distance", "domination_code": "A", "sight_distance": 250}
                        ],
                        "development": [
                            {"type": "development_queen_caste", "domination_code": "E", "strength": 1.8, "defense": 1, "max_hp": 1, "hp_regen_rate": 0.9, "speed": 0.7},
                            {"type": "development_worker_caste", "domination_code": "E", "strength": 1, "defense": 1.5, "max_hp": 1.5, "hp_regen_rate": 1, "speed": 1},
                            {"type": "development_warrior_caste", "domination_code": "E", "strength": 1.6, "defense": 2, "max_hp": 2, "hp_regen_rate": 1.5, "speed": 1.3}
                        ],
                        "adaptation": [],
                        "building": [],
                        "combat": [],
                        "adjusting": [
                            {"type": "adjusting_appetite", "domination_code": "E"},
                            {"type": "adjusting_development_appetite", "domination_code": "E"}
                        ]
                    }
                }
            },
            {
                "id":2,
                "type":"ant",
                "from_colony_id":2,
                "owner_id": 2,
                "hp": 300,
                "position":[
                    650,
                    350
                ],
                "angle": 0,
                "located_in_nest_id":30,
                "picked_item_id":None,
                "ant_type":"queen",
                "from_nest":30,
                "thoughts":[
                    
                ],
                "memory": {},
                "is_auto_thought_generation": True,
                "is_in_operation": False,
                "genome": {
                    "maternal": {
                        "base": [
                            {"type": "base_strength", "domination_code": "A", "strength": 10},
                            {"type": "base_defense", "domination_code": "C", "defense": 5},
                            {"type": "base_max_hp", "domination_code": "B", "max_hp": 200},
                            {"type": "base_hp_regen_rate", "domination_code": "B", "hp_regen_rate": 10},
                            {"type": "base_speed", "domination_code": "D", "speed": 32},
                            {"type": "base_sight_distance", "domination_code": "D", "sight_distance": 200}
                        ],
                        "development": [
                            {"type": "development_queen_caste", "domination_code": "A", "strength": 1.5, "defense": 1, "max_hp": 1, "hp_regen_rate": 0.9, "speed": 0.7},
                            {"type": "development_worker_caste", "domination_code": "B", "strength": 1, "defense": 1.5, "max_hp": 1.5, "hp_regen_rate": 1, "speed": 1},
                            {"type": "development_warrior_caste", "domination_code": "C", "strength": 1.6, "defense": 2, "max_hp": 2, "hp_regen_rate": 1.5, "speed": 1.3},
                        ],
                        "adaptation": [],
                        "building": [],
                        "combat": [],
                        "adjusting": [
                            {"type": "adjusting_appetite", "domination_code": "E"},
                            {"type": "adjusting_development_appetite", "domination_code": "E"}
                        ]
                    },
                    "paternal": {
                        "base": [
                            {"type": "base_strength", "domination_code": "D", "strength": 13},
                            {"type": "base_defense", "domination_code": "C", "defense": 7},
                            {"type": "base_max_hp", "domination_code": "C", "max_hp": 100},
                            {"type": "base_hp_regen_rate", "domination_code": "C", "hp_regen_rate": 20},
                            {"type": "base_speed", "domination_code": "D", "speed": 32},
                            {"type": "base_sight_distance", "domination_code": "D", "sight_distance": 200}
                        ],
                        "development": [
                            {"type": "development_queen_caste", "domination_code": "C", "strength": 1.8, "defense": 1, "max_hp": 1, "hp_regen_rate": 0.9, "speed": 0.7},
                            {"type": "development_worker_caste", "domination_code": "E", "strength": 1, "defense": 1.5, "max_hp": 1.5, "hp_regen_rate": 1, "speed": 1},
                            {"type": "development_warrior_caste", "domination_code": "E", "strength": 1.6, "defense": 2, "max_hp": 2, "hp_regen_rate": 1.5, "speed": 1.3},
                        ],
                        "adaptation": [],
                        "building": [],
                        "combat": [],
                        "adjusting": [
                            {"type": "adjusting_appetite", "domination_code": "E"},
                            {"type": "adjusting_development_appetite", "domination_code": "E"}
                        ]
                    }
                },
                "male_chromosomes_set": {
                    "base": [
                            {"type": "base_strength", "domination_code": "E", "strength": 9},
                            {"type": "base_defense", "domination_code": "C", "defense": 7},
                            {"type": "base_max_hp", "domination_code": "C", "max_hp": 150},
                            {"type": "base_hp_regen_rate", "domination_code": "C", "hp_regen_rate": 20},
                            {"type": "base_speed", "domination_code": "D", "speed": 32},
                            {"type": "base_sight_distance", "domination_code": "A", "sight_distance": 250}
                        ],
                        "development": [
                            {"type": "development_queen_caste", "domination_code": "E", "strength": 1.8, "defense": 1, "max_hp": 1, "hp_regen_rate": 0.9, "speed": 0.7},
                            {"type": "development_worker_caste", "domination_code": "E", "strength": 1, "defense": 1.5, "max_hp": 1.5, "hp_regen_rate": 1, "speed": 1},
                            {"type": "development_warrior_caste", "domination_code": "E", "strength": 1.6, "defense": 2, "max_hp": 2, "hp_regen_rate": 1.5, "speed": 1.3},
                        ],
                    "adaptation": [],
                    "building": [],
                    "combat": [],
                    "adjusting": []
                },
                "is_in_nuptial_flight": False
            },
            {
                "id":3,
                "type":"ant",
                "from_colony_id":2,
                "owner_id": 2,
                "hp": 300,
                "position":[
                    550,
                    350
                ],
                "angle": 0,
                "located_in_nest_id":30,
                "picked_item_id":None,
                "ant_type":"warrior",
                "from_nest":30,
                "thoughts":[
                    
                ],
                "memory": {
                    'debashyr': { 'data': True, 'expired_in': None }
                },
                "is_auto_thought_generation": True,
                "is_in_operation": False,
                "genome": {
                    "maternal": {
                        "base": [
                            {"type": "base_strength", "domination_code": "D", "strength": 13},
                            {"type": "base_defense", "domination_code": "C", "defense": 7},
                            {"type": "base_max_hp", "domination_code": "C", "max_hp": 100},
                            {"type": "base_hp_regen_rate", "domination_code": "C", "hp_regen_rate": 20},
                            {"type": "base_speed", "domination_code": "D", "speed": 32},
                            {"type": "base_sight_distance", "domination_code": "D", "sight_distance": 200}
                        ],
                        "development": [
                            {"type": "development_queen_caste", "domination_code": "A", "strength": 1.5, "defense": 1, "max_hp": 1, "hp_regen_rate": 0.9, "speed": 0.7},
                            {"type": "development_worker_caste", "domination_code": "B", "strength": 1, "defense": 1.5, "max_hp": 1.5, "hp_regen_rate": 1, "speed": 1},
                            {"type": "development_warrior_caste", "domination_code": "C", "strength": 1.6, "defense": 2, "max_hp": 2, "hp_regen_rate": 1.5, "speed": 1.3},
                        ],
                        "adaptation": [],
                        "building": [],
                        "combat": [],
                        "adjusting": [
                            {"type": "adjusting_appetite", "domination_code": "E"},
                            {"type": "adjusting_development_appetite", "domination_code": "E"}
                        ]
                    },
                    "paternal": {
                        "base": [
                            {"type": "base_strength", "domination_code": "E", "strength": 9},
                            {"type": "base_defense", "domination_code": "C", "defense": 7},
                            {"type": "base_max_hp", "domination_code": "C", "max_hp": 150},
                            {"type": "base_hp_regen_rate", "domination_code": "C", "hp_regen_rate": 20},
                            {"type": "base_speed", "domination_code": "D", "speed": 32},
                            {"type": "base_sight_distance", "domination_code": "A", "sight_distance": 250}
                        ],
                        "development": [
                            {"type": "development_queen_caste", "domination_code": "E", "strength": 1.8, "defense": 1, "max_hp": 1, "hp_regen_rate": 0.9, "speed": 0.7},
                            {"type": "development_worker_caste", "domination_code": "E", "strength": 1, "defense": 1.5, "max_hp": 1.5, "hp_regen_rate": 1, "speed": 1},
                            {"type": "development_warrior_caste", "domination_code": "E", "strength": 1.6, "defense": 2, "max_hp": 2, "hp_regen_rate": 1.5, "speed": 1.3},
                        ],
                        "adaptation": [],
                        "building": [],
                        "combat": [],
                        "adjusting": [
                            {"type": "adjusting_appetite", "domination_code": "E"},
                            {"type": "adjusting_development_appetite", "domination_code": "E"}
                        ]
                    }
                }
            }
        ],
        "items": [
            {
                "id":20,
                "type":"item",
                "from_colony_id":None,
                "hp": 100,
                "position":[
                    850,
                    450
                ],
                "angle": 45,
                "strength":150,
                "item_type":"ground_beetle_corpse",
                "variety":1,
                "is_picked": False,
                "life_span": -1
            },
        ],
        "nests":[
            {
                "id":30,
                "type":"nest",
                "from_colony_id":2,
                "owner_id": 2,
                "is_main": True,
                "hp": 1000,
                "position":[
                    600,
                    350
                ],
                "angle": 0,
                "stored_calories":1000,
                "larvae":[
                ],
                "larva_places_count":3,
                "area":300,
                "build_progress": 100
            },
            {
                "id":31,
                "type":"nest",
                "from_colony_id":2,
                "owner_id": 2,
                "is_main": False,
                "hp": 1000,
                "position":[
                    1600,
                    450
                ],
                "angle": 0,
                "stored_calories":1000,
                "larvae":[
                ],
                "larva_places_count":1,
                "area":300,
                "build_progress": 100
            },
            {
                "id":32,
                "type":"nest",
                "from_colony_id":1,
                "owner_id": 2,
                "is_main": True,
                "hp": 1000,
                "position":[
                    2150,
                    450
                ],
                "angle": 0,
                "stored_calories":1000,
                "larvae":[
                ],
                "larva_places_count":1,
                "area":300,
                "build_progress": 100
            },
        ],
        "item_areas": [
            {
                "id":40,
                "type":"item_area",
                "from_colony_id":None,
                "hp": 100,
                "position":[
                    450,
                    300
                ],
                "angle": 0,
                "size":[
                    350,
                    200
                ],
                "fertility":5,
                "item_type":"leaf",
                "accumulated": 0
            },
            {
                "id":41,
                "type":"item_area",
                "from_colony_id":None,
                "hp": 100,
                "position":[
                    1800,
                    400
                ],
                "angle": 0,
                "size":[
                    150,
                    150
                ],
                "fertility":5,
                "item_type":"flower",
                "accumulated": 0
            }
        ],
        "item_sources": [
            {
                "id":50,
                "type":"item_source",
                "from_colony_id": None,
                "hp": 100,
                "position":[
                    850,
                    300
                ],
                "angle": 0,
                "fertility":5,
                "item_type":"honeydew",
                "accumulated": 10,
                "min_item_strength": 10,
                "max_item_strength": 50
            },
        ],
        "ground_beetles": [
            # {
            #     "id":60,
            #     "type":"ground_beetle",
            #     "from_colony_id":3,
            #     "hp": 800,
            #     "position":[
            #         950,
            #         450
            #     ],
            #     "angle": 0,
            #     "thoughts":[
            #     ],
            #     "memory": {},
            #     "is_auto_thought_generation": True
            # },
        ],
        "colonies":[
            {
                "id":1,
                "owner_id":2,
                "queen_id": None,
                "member_type": "ant",
                "operations":[],
                "last_registered_entities_in_colony_area_ids": []
            },
            {
                "id":2,
                "owner_id":2,
                "queen_id": 2,
                "member_type": "ant",
                "operations":[],
                "last_registered_entities_in_colony_area_ids": []
            },
            {
                "id":3,
                "owner_id": None,
                "member_type": "ground_beetle"
            }
        ],
        "colonies_relations": [
            { "colony_ids": [1, 2], "value": -1 },
            { "colony_ids": [1, 3], "value": -1 },
            { "colony_ids": [2, 3], "value": -1 }
        ],
        "nuptial_environments": [
            {
                "owner_id": 2,
                "base_chromosomes_set": {
                    "base": [
                        {"type": "base_strength", "domination_code": "E", "strength": 9},
                        {"type": "base_defense", "domination_code": "C", "defense": 7},
                        {"type": "base_max_hp", "domination_code": "C", "max_hp": 150},
                        {"type": "base_hp_regen_rate", "domination_code": "C", "hp_regen_rate": 20},
                        {"type": "base_speed", "domination_code": "D", "speed": 32},
                        {"type": "base_sight_distance", "domination_code": "A", "sight_distance": 250}
                    ],
                    "development": [
                        {"type": "development_queen_caste", "domination_code": "E", "strength": 1.8, "defense": 1, "max_hp": 1, "hp_regen_rate": 0.9, "speed": 0.7},
                        {"type": "development_worker_caste", "domination_code": "E", "strength": 1, "defense": 1.5, "max_hp": 1.5, "hp_regen_rate": 1, "speed": 1},
                        {"type": "development_warrior_caste", "domination_code": "E", "strength": 1.6, "defense": 2, "max_hp": 2, "hp_regen_rate": 1.5, "speed": 1.3},
                    ],
                    "adaptation": [],
                    "building": [],
                    "combat": [],
                    "adjusting": [
                        {"type": "adjusting_appetite", "domination_code": "E"},
                        {"type": "adjusting_development_appetite", "domination_code": "E"}
                    ]
                }
            }
        ]
    }

    def handle(self, *args, **options):
        world, created = World.objects.update_or_create(id=1, defaults={
            'state': self.world_state
        })
        print('world saved')