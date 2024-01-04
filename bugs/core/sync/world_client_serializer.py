from core.world.entities.world.world import World
from core.world.world_client_serializer_interface import iWorldClientSerializer
from .colony_client_serializer import ColonyClientSerializer
from .item_client_serializer import ItemClientSerializer
from .item_source_client_serializer import ItemSourceClientSerializer
from .item_area_client_serializer import ItemAreaClientSerializer
from .nest_client_serializer import NestClientSerializer
from .ground_beetle_client_serializer import GroundBeetleClientSerializer
from .ant_client_serializer import AntClientSerializer
from core.world.entities.base.entity import Entity
from core.world.entities.base.entity_types import EntityTypes
from .entity_client_serializer import EntityClientSerializer

class WorldClientSerializer(iWorldClientSerializer):

    def __init__(self, colony_serializer: ColonyClientSerializer, entity_serializer: EntityClientSerializer):
        self._colony_serializer = colony_serializer
        self._entity_serializer = entity_serializer

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
            'size': world.map.size
        }
    