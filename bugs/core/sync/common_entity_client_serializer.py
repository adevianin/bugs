from .item_client_serializer import ItemClientSerializer
from .item_source_client_serializer import ItemSourceClientSerializer
from .item_area_client_serializer import ItemAreaClientSerializer
from .nest_client_serializer import NestClientSerializer
from .ground_beetle_client_serializer import GroundBeetleClientSerializer
from .ant_client_serializer import AntClientSerializer
from core.world.entities.base.entity import Entity
from core.world.entities.base.entity_types import EntityTypes
from .tree_client_serializer import TreeClientSerializer
from .ladybug_client_serializer import LadybugClientSerializer

class CommonEntityClientSerializer():

    def __init__(self, item_serializer: ItemClientSerializer, item_source_serializer: ItemSourceClientSerializer, item_area_serializer: ItemAreaClientSerializer, 
                 nest_serializer: NestClientSerializer, ground_beetle_serializer: GroundBeetleClientSerializer, ant_serializer: AntClientSerializer, 
                 tree_serializer: TreeClientSerializer, ladybug_serializer: LadybugClientSerializer) :
        self._item_serializer = item_serializer
        self._item_source_serializer = item_source_serializer
        self._item_area_serializer = item_area_serializer
        self._nest_serializer = nest_serializer
        self._ground_beetle_serializer = ground_beetle_serializer
        self._ant_serializer = ant_serializer
        self._tree_serializer = tree_serializer
        self._ladybug_serializer = ladybug_serializer

    def serialize(self, entity: Entity):
         match(entity.type):
            case EntityTypes.ITEM:
                return self._item_serializer.serialize(entity)
            case EntityTypes.ITEM_SOURCE:
                return self._item_source_serializer.serialize(entity)
            case EntityTypes.ITEM_AREA:
                return self._item_area_serializer.serialize(entity)
            case EntityTypes.NEST:
                return self._nest_serializer.serialize(entity)
            case EntityTypes.GROUND_BEETLE:
                return self._ladybug_serializer.serialize(entity)
            case EntityTypes.LADYBUG:
                return self._ground_beetle_serializer.serialize(entity)
            case EntityTypes.ANT:
                return self._ant_serializer.serialize(entity)
            case EntityTypes.TREE:
                return self._tree_serializer.serialize(entity)
            case _:
                raise Exception('unknown entity type')