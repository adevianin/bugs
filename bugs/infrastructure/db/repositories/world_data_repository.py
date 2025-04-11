from infrastructure.models import World
from typing import Dict

class WorldDataRepository():
    
    def get(self, world_id: int):
        world, created = World.objects.get_or_create(id=world_id, defaults={'state': ''})
        return world.state if world.state else None 

    def push(self, world_id: int, data: Dict):
        world = World.objects.get(id=world_id)
        world.state = data
        world.save()
