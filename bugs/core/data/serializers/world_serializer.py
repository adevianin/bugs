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
from core.data.serializers.nuptial_environment_serializer import NuptialEnvironmentSerializer
from core.world.entities.ant.base.nuptial_environment.nuptial_environment import NuptialEnvironment
from .climate_serializer import ClimateSerializer
from .thought_serializer import ThoughtSerializer
from .notification_serializer import NotificationSerializer

from typing import List

class WorldSerializer():

    def __init__(self, nest_serializer: NestSerializer, ant_serializer: AntSerializer, item_serializer: ItemSerializer, item_area_serializer: ItemAreaSerializer, 
                 item_source_serializer: ItemSourceSerializer, colony_serializer: ColonySerializer, colony_relations_table_serializer: ColonyRelationsTableSerializer, 
                 ground_beetle_serializer: GroundBeetleSerializer, nuptial_environment_serializer: NuptialEnvironmentSerializer, climate_serializer: ClimateSerializer, 
                 thought_serializer: ThoughtSerializer, notification_serializer: NotificationSerializer):
        self._nest_serializer = nest_serializer
        self._ant_serializer = ant_serializer
        self._colony_serializer = colony_serializer
        self._colony_relations_table_serializer: ColonyRelationsTableSerializer = colony_relations_table_serializer
        self._ground_beetle_serializer = ground_beetle_serializer
        self._item_serializer = item_serializer
        self._item_area_serializer = item_area_serializer
        self._item_source_serializer = item_source_serializer
        self._nuptial_environment_serializer = nuptial_environment_serializer
        self._climate_serializer = climate_serializer
        self._thought_serializer = thought_serializer
        self._notification_serializer = notification_serializer

    def serialize(self, world: World):
        json = {
            'nests': [],
            'ants': [],
            'ground_beetles': [],
            'items': [],
            'item_areas': [],
            'item_sources': [],
            'colonies': [],
            'nuptial_environments': [],
            'thought_packs': [],
            'map': {
                'size': {
                    'width': world.map.size.width,
                    'height': world.map.size.height
                }
            },
            'last_used_id': world.last_used_id,
            'current_step': world.current_step,
            'notifications': []
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

        nuptial_environments: List[NuptialEnvironment] = world.nuptial_environments
        for nuptial_environment in nuptial_environments:
            json['nuptial_environments'].append(self._nuptial_environment_serializer.serialize(nuptial_environment))

        json['colonies_relations'] = self._colony_relations_table_serializer.serialize(world.colony_relations_table)

        json['climate'] = self._climate_serializer.serialize_climate(world.climate)

        live_entities = world.map.get_live_entities()
        for entity in live_entities:
            if len(entity.thoughts) > 0:
                json['thought_packs'].append({
                    'entity_id': entity.id,
                    'thoughts': [self._thought_serializer.serialize(thought) for thought in entity.thoughts]
                })

        notifications = world.get_all_notifications()
        json['notifications'] = [self._notification_serializer.serialize(notification) for notification in notifications ]

        return json
