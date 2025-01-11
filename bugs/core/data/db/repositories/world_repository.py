from core.world.world_repository_interface import iWorldRepository
from core.world.entities.world.world import World
from .world_data_repository import WorldDataRepository
from core.data.db.serializers.world_serializer import WorldSerializer
from core.data.db.deserializers.world_deserializer import WorldDeserializer


class WorldRepository(iWorldRepository):

    def __init__(self, world_data_repository: WorldDataRepository, world_serializer: WorldSerializer, world_deserializer: WorldDeserializer):
        self._world_data_repository = world_data_repository
        self._world_serializer = world_serializer
        self._world_deserializer = world_deserializer

    def get(self, world_id: int) -> World:
        world_data = self._world_data_repository.get(world_id)
        return self._world_deserializer.deserialize(world_data) if world_data else None

    def push(self, world: World, world_id: int):
        world_json = self._world_serializer.serialize(world)
        self._world_data_repository.push(world_id, world_json)