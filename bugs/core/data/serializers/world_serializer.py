from core.world.entities.world.world import World
from core.world.entities.base.entity_types import EntityTypes
from .nest_serializer import NestSerializer
from .ant_serializer import AntSerializer
from .colony_serializer import ColonySerializer
from .colony_relations_table_serializer import ColonyRelationsTableSerializer
from .item_serializer import ItemSerializer
from core.data.serializers.item_area_serializer import ItemAreaSerializer
from core.data.serializers.item_source_serializer import ItemSourceSerializer
from core.data.serializers.nuptial_environment_serializer import NuptialEnvironmentSerializer
from core.world.entities.ant.base.nuptial_environment.nuptial_environment import NuptialEnvironment
from .climate_serializer import ClimateSerializer
from .thought_serializer import ThoughtSerializer
from .notification_serializer import NotificationSerializer
from core.world.entities.base.entity import Entity
from .player_stats_serializer import PlayerStatsSerializer
from .tree_serializer import TreeSerializer
from .ladybug_serializer import LadybugSerializer

from typing import List, Dict

class WorldSerializer():

    def __init__(self, nest_serializer: NestSerializer, ant_serializer: AntSerializer, item_serializer: ItemSerializer, item_area_serializer: ItemAreaSerializer, 
                 item_source_serializer: ItemSourceSerializer, colony_serializer: ColonySerializer, colony_relations_table_serializer: ColonyRelationsTableSerializer, 
                 nuptial_environment_serializer: NuptialEnvironmentSerializer, climate_serializer: ClimateSerializer, 
                 thought_serializer: ThoughtSerializer, notification_serializer: NotificationSerializer, player_stats_serializer: PlayerStatsSerializer, 
                 tree_serializer: TreeSerializer, ladybug_serializer: LadybugSerializer):
        self._nest_serializer = nest_serializer
        self._ant_serializer = ant_serializer
        self._colony_serializer = colony_serializer
        self._colony_relations_table_serializer: ColonyRelationsTableSerializer = colony_relations_table_serializer
        self._item_serializer = item_serializer
        self._item_area_serializer = item_area_serializer
        self._item_source_serializer = item_source_serializer
        self._nuptial_environment_serializer = nuptial_environment_serializer
        self._climate_serializer = climate_serializer
        self._thought_serializer = thought_serializer
        self._notification_serializer = notification_serializer
        self._player_stats_serializer = player_stats_serializer
        self._tree_serializer = tree_serializer
        self._ladybug_serializer = ladybug_serializer

    def serialize(self, world: World):
        json = {
            'trees': [],
            'nests': [],
            'ants': [],
            'ladybugs': [],
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
            'last_used_id': world.id_generator.last_used_id,
            'current_step': world.current_step,
            'notifications': [],
            'player_stats': []
        }

        entities = world.map.get_all_entities()
        entities = self._sort_entities_by_type(entities)

        trees = entities.get(EntityTypes.TREE, [])
        for tree in trees:
            json['trees'].append(self._tree_serializer.serialize(tree))

        nests = entities.get(EntityTypes.NEST, [])
        for nest in nests:
            json['nests'].append(self._nest_serializer.serialize(nest))

        ants = entities.get(EntityTypes.ANT, [])
        for ant in ants:
            json['ants'].append(self._ant_serializer.serialize(ant))

        ladybugs = entities.get(EntityTypes.LADYBUG, [])
        for ladybug in ladybugs:
            json['ladybugs'].append(self._ladybug_serializer.serialize(ladybug))

        items = entities.get(EntityTypes.ITEM, [])
        for item in items:
            json['items'].append(self._item_serializer.serialize(item))

        item_areas = entities.get(EntityTypes.ITEM_AREA, [])
        for item_area in item_areas:
            json['item_areas'].append(self._item_area_serializer.serialize(item_area))

        item_sources = entities.get(EntityTypes.ITEM_SOURCE, [])
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

        json['player_stats'] = [self._player_stats_serializer.serialize(player_stats) for player_stats in world.player_stats_list]

        return json
    
    def _sort_entities_by_type(self, entities: List[Entity]) -> Dict[EntityTypes, Entity]:
        sorted = {}
        for entity in entities:
            type_array: List[Entity] = sorted.get(entity.type, [])
            type_array.append(entity)
            sorted[entity.type] = type_array

        return sorted
