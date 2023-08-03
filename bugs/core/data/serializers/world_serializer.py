from core.world.entities.world.world import World
from core.world.entities.base.entity_types import EntityTypes
from .nest_serializer import NestSerializer
from .ant_serializer import AntSerializer
from .food_serializer import FoodSerializer
from .food_area_serializer import FoodAreaSerializer
from .colony_serializer import ColonySerializer
from .colony_relations_table_serializer import ColonyRelationsTableSerializer

class WorldSerializer():

    def __init__(self, nest_serializer: NestSerializer, ant_serializer: AntSerializer, food_serializer: FoodSerializer, food_area_serializer: FoodAreaSerializer, colony_serializer: ColonySerializer, colony_relations_table_serializer: ColonyRelationsTableSerializer):
        self._nest_serializer = nest_serializer
        self._ant_serializer = ant_serializer
        self._food_serializer = food_serializer
        self._food_area_serializer = food_area_serializer
        self._colony_serializer = colony_serializer
        self._colony_relations_table_serializer: ColonyRelationsTableSerializer = colony_relations_table_serializer

    def serialize(self, world: World):
        json = {
            'nests': [],
            'ants': [],
            'foods': [],
            'food_areas': [],
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

        foods = world.map.get_entities(entity_types=[EntityTypes.FOOD])
        for food in foods:
            json['foods'].append(self._food_serializer.serialize(food))

        food_areas = world.map.get_entities(entity_types=[EntityTypes.FOOD_AREA])
        for food_area in food_areas:
            json['food_areas'].append(self._food_area_serializer.serialize(food_area))

        colonies = world.colonies
        for colony in colonies:
            json['colonies'].append(self._colony_serializer.serialize(colony))

        json['colonies_relations'] = self._colony_relations_table_serializer.serialize(world.colony_relations_table)

        return json
