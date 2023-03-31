from django.core.management.base import BaseCommand
from core.models import World

class Command(BaseCommand):
    help = 'Creates test world'

    world_state = {
        "map": { "size": {"width": 1000, "height": 500 }},
        "bugs": [
            { "id": 1, "position": {"x": 650, "y": 200}, "from_town": 30, "type": "food_collector" }
        ],
        "foods": [
            {"id": 20, "position": {"x": 350, "y": 200}, "calories": 150 },
            {"id": 21, "position": {"x": 850, "y": 200}, "calories": 300 }
        ],
        "towns": [
            { "id": 30, "position": {"x": 600, "y": 200 }, "color": "yellow" }
        ],
        "food_areas": [
            { "id": 40, "position": {"x": 450, "y": 150}, "size": { "width": 150, "height": 150 }, "fertility": 20 }
        ],
        "last_id": 40
    }

    def handle(self, *args, **options):
        world, created = World.objects.update_or_create(id=1, defaults={
            'state': self.world_state
        })
        print('test world saved')