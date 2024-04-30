from core.world.entities.world.world import World
from core.world.world_client_serializer_interface import iWorldClientSerializer
from .colony_client_serializer import ColonyClientSerializer
from core.world.entities.base.entity_types import EntityTypes
from .entity_client_serializer import EntityClientSerializer
from .climate_client_serializer import ClimateClientSerializer

class WorldClientSerializer(iWorldClientSerializer):

    def __init__(self, colony_serializer: ColonyClientSerializer, entity_serializer: EntityClientSerializer, climate_serializer: ClimateClientSerializer):
        self._colony_serializer = colony_serializer
        self._entity_serializer = entity_serializer
        self._climate_serializer = climate_serializer

    def serialize(self, world: World) -> dict:
        entities_json = []
        entities = world.map.get_all_entities()
        for entity in entities:
            entities_json.append(self._entity_serializer.serialize(entity))

        colonies_json = []
        for colony in world.colonies:
            if colony.member_type == EntityTypes.ANT:
                colonies_json.append(self._colony_serializer.serialize(colony))

        return {
            'entities': entities_json,
            'ant_colonies': colonies_json,
            'size': world.map.size,
            'climate': self._climate_serializer.serialize(world.climate)
        }
    