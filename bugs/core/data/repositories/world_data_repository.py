from core.models import World

class WorldDataRepository():
    
    def get(self, world_id: int):
        world = World.objects.get(id=world_id)
        return world.state

    def push(self, world_id: int, data: dict):
        world = World.objects.get(id=world_id)
        world.state = data
        world.save()
