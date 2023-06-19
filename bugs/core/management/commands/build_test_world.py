from django.core.management.base import BaseCommand
from core.models import World

# python bugs/manage.py build_test_world
class Command(BaseCommand):
    help = 'Creates test world'

    world_state = {
        "map": { "size": {"width": 3000, "height": 3000 }},
        "colonies": [
            {"id": 1, "owner_id": 1 },
            {"id": 2, "owner_id": 2 }
        ],
        "ants": [
            { "id": 1, "dna_profile": "e41e2924-ad6c-431e-836b-e399366bf000", "position": {"x": 650, "y": 350}, "from_nest": 30, "type": "worker", "from_colony": 2, "located_in_nest": None },
            { "id": 2, "dna_profile": "e41e2924-ad6c-431e-836b-e399366bf000", "position": {"x": 650, "y": 350}, "from_nest": 30, "type": "queen", "from_colony": 2, "located_in_nest": 30 },

            { "id": 3, "dna_profile": "e41e2924-ad6c-431e-836b-e399366bf123", "position": {"x": 1600, "y": 500}, "from_nest": 31, "type": "worker", "from_colony": 1, "located_in_nest": None },
            { "id": 4, "dna_profile": "e41e2924-ad6c-431e-836b-e399366bf123", "position": {"x": 1600, "y": 400}, "from_nest": 31, "type": "queen", "from_colony": 1, "located_in_nest": None }
        ],
        "foods": [
            {"id": 20, "position": {"x": 350, "y": 350}, "calories": 150, "type": "leaf", "food_variety": 1 },
            {"id": 21, "position": {"x": 850, "y": 350}, "calories": 300, "type": "leaf", "food_variety": 2  }
        ],
        "nests": [
            { "id": 30, "position": {"x": 600, "y": 350 }, "color": "yellow", "from_colony": 2, "larva_places_count": 3, "larvae": [
                # { "ate_calories": 450, "type": 'warrior', "dna_profile": "e41e2924-ad6c-431e-836b-e399366bf000", },
                # { "ate_calories": 10, "type": 'worker', "dna_profile": "e41e2924-ad6c-431e-836b-e399366bf000", },
            ] },
            { "id": 31, "position": {"x": 1600, "y": 450 }, "color": "red", "from_colony": 1,  "larva_places_count": 1,  "larvae": [] },
        ],
        "food_areas": [
            { "id": 40, "position": {"x": 450, "y": 300}, "size": { "width": 150, "height": 150 }, "fertility": 5, "food_type": "leaf" },
            { "id": 41, "position": {"x": 1800, "y": 400}, "size": { "width": 150, "height": 150 }, "fertility": 5, "food_type": "nectar" },
        ],
        "last_used_id": 41
    }

    def handle(self, *args, **options):
        world, created = World.objects.update_or_create(id=1, defaults={
            'state': self.world_state
        })
        print('test world saved')