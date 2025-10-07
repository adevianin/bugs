from infrastructure.models import World
from infrastructure.services.engine.world_data_repository_interface import iWorldDataRepository
from typing import Dict

class WorldDataRepository(iWorldDataRepository):
    
    def get(self, world_id: int):
        world, created = World.objects.get_or_create(id=world_id, defaults={'state': ''})
        return world.state if world.state else None 

    def push(self, world_id: int, data: Dict):
        world = World.objects.get(id=world_id)
        world.state = data
        world.save()
