from infrastructure.models import World

class WorldDataRepository():
    
    def get(self, world_id: int):
        world, created = World.objects.get_or_create(id=world_id, defaults={'state': ''})
        return world.state

    def push(self, world_id: int, data: dict):
        world = World.objects.get(id=world_id)
        world.state = data
        world.save()
