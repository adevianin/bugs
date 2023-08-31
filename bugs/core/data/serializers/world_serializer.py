from core.world.entities.world.world import World
from core.world.entities.base.entity_types import EntityTypes
from .nest_serializer import NestSerializer
from .ant_serializer import AntSerializer
from .colony_serializer import ColonySerializer
from .colony_relations_table_serializer import ColonyRelationsTableSerializer
from .ground_beetle_serializer import GroundBeetleSerializer
from .item_serializer import ItemSerializer
from core.data.serializers.item_area_serializer import ItemAreaSerializer
from core.data.serializers.item_source_serializer import ItemSourceSerializer

class WorldSerializer():

    def __init__(self, nest_serializer: NestSerializer, ant_serializer: AntSerializer, item_serializer: ItemSerializer, item_area_serializer: ItemAreaSerializer, item_source_serializer: ItemSourceSerializer, colony_serializer: ColonySerializer, colony_relations_table_serializer: ColonyRelationsTableSerializer, ground_beetle_serializer: GroundBeetleSerializer):
        self._nest_serializer = nest_serializer
        self._ant_serializer = ant_serializer
        self._colony_serializer = colony_serializer
        self._colony_relations_table_serializer: ColonyRelationsTableSerializer = colony_relations_table_serializer
        self._ground_beetle_serializer = ground_beetle_serializer
        self._item_serializer = item_serializer
        self._item_area_serializer = item_area_serializer
        self._item_source_serializer = item_source_serializer

    def serialize(self, world: World):
        json = {
            'nests': [],
            'ants': [],
            'ground_beetles': [],
            'items': [],
            'item_areas': [],
            'item_sources': [],
            'colonies': [],
            'map': {
                'size': {
                    'width': world.map.size.width,
                    'height': world.map.size.height
                }
            },
            'last_used_id': world.last_used_id
        }

        nests = world.map.get_entities(entity_types=[EntityTypes.NEST])
        for nest in nests:
            json['nests'].append(self._nest_serializer.serialize(nest))

        ants = world.map.get_entities(entity_types=[EntityTypes.ANT])
        for ant in ants:
            json['ants'].append(self._ant_serializer.serialize(ant))

        ground_beetles = world.map.get_entities(entity_types=[EntityTypes.GROUND_BEETLE])
        for ground_beetle in ground_beetles:
            json['ground_beetles'].append(self._ground_beetle_serializer.serialize(ground_beetle))

        items = world.map.get_entities(entity_types=[EntityTypes.ITEM])
        for item in items:
            json['items'].append(self._item_serializer.serialize(item))

        item_areas = world.map.get_entities(entity_types=[EntityTypes.ITEM_AREA])
        for item_area in item_areas:
            json['item_areas'].append(self._item_area_serializer.serialize(item_area))

        item_sources = world.map.get_entities(entity_types=[EntityTypes.ITEM_SOURCE])
        for item_source in item_sources:
            json['item_sources'].append(self._item_source_serializer.serialize(item_source))

        colonies = world.colonies
        for colony in colonies:
            json['colonies'].append(self._colony_serializer.serialize(colony))

        json['colonies_relations'] = self._colony_relations_table_serializer.serialize(world.colony_relations_table)

        return json
