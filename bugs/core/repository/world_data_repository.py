import json

from core.world.world_data_repository_interface import iWorldDataRepository
from core.models import World

class WorldDataRepository(iWorldDataRepository):
    
    def get(self, world_id: int):
        world = World.objects.get(id=world_id)
        return world.state

    def push(data):
        pass
    

