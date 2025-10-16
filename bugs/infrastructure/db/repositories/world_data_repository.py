from infrastructure.models import World
from typing import Dict

class WorldDataRepository():
    
    async def get(self, world_id: int):
        world, created = await World.objects.aget_or_create(id=world_id, defaults={'state': ''})
        return world.state if world.state else None 

    async def push(self, world_id: int, data: Dict):
        world = await World.objects.aget(id=world_id)
        world.state = data
        await world.asave()
