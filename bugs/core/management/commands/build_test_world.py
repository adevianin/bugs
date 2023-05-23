from django.core.management.base import BaseCommand
from core.models import World

# python bugs/manage.py build_test_world
class Command(BaseCommand):
    help = 'Creates test world'

    world_state = {
        "map": { "size": {"width": 3000, "height": 3000 }},
        "ants": [
            { "id": 1, "position": {"x": 650, "y": 350}, "from_town": 30, "type": "worker" },
            # { "id": 2, "position": {"x": 1600, "y": 500}, "from_town": 31, "type": "worker" },
        ],
        "foods": [
            {"id": 20, "position": {"x": 350, "y": 350}, "calories": 150, "type": "leaf", "food_variety": 1 },
            {"id": 21, "position": {"x": 850, "y": 350}, "calories": 300, "type": "leaf", "food_variety": 2  }
        ],
        "towns": [
            { "id": 30, "position": {"x": 600, "y": 350 }, "color": "yellow", "owner_id": 2 },
            { "id": 31, "position": {"x": 1600, "y": 450 }, "color": "red", "owner_id": 1 },
        ],
        "food_areas": [
            { "id": 40, "position": {"x": 450, "y": 300}, "size": { "width": 150, "height": 150 }, "fertility": 5, "food_type": "leaf" },
            { "id": 41, "position": {"x": 1800, "y": 400}, "size": { "width": 150, "height": 150 }, "fertility": 5, "food_type": "nectar" },
        ],
        "last_id": 41
    }

    def handle(self, *args, **options):
        world, created = World.objects.update_or_create(id=1, defaults={
            'state': self.world_state
        })
        print('test world saved')