from core.world.entities.world.world import World
from .colony_client_serializer import ColonyClientSerializer
from .climate_client_serializer import ClimateClientSerializer
from .common_entity_client_serializer import CommonEntityClientSerializer

class WorldClientSerializer():

    def __init__(self, common_entity_serializer: CommonEntityClientSerializer, colony_serializer: ColonyClientSerializer, climate_serializer: ClimateClientSerializer):
        self._common_entity_serializer = common_entity_serializer
        self._colony_serializer = colony_serializer
        self._climate_serializer = climate_serializer

    def serialize(self, world: World) -> dict:
        entities_json = []
        entities = world.map.get_all_entities()
        
        for entity in entities:
            if not entity.is_pending_removal:
                entities_json.append(self._common_entity_serializer.serialize(entity))

        colonies_json = []
        for colony in world.ant_colonies:
            colonies_json.append(self._colony_serializer.serialize(colony))

        return {
            'entities': entities_json,
            'ant_colonies': colonies_json,
            'size': world.map.size,
            'climate': self._climate_serializer.serialize(world.climate)
        }
    