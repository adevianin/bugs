from core.world.entities.map.map import Map
from core.world.id_generator import IdGenerator
from core.world.entities.ant.ant_factory import AntFactory
from core.world.entities.food.food_factory import FoodFactory
from core.world.entities.nest.nest_factory import NestFactory
from core.world.entities.base.entity import Entity
from core.world.entities.base.entity_types import EntityTypes
from core.world.entities.nest.nest import Nest
from core.world.entities.food.preborn_food import PrebornFood
from core.world.entities.ant.base.larva import Larva
from core.world.entities.ground_beetle.ground_beetle_factory import GroundBeetleFactory
from core.world.utils.event_emiter import EventEmitter

class EntityBirther():

    def __init__(self, event_bus: EventEmitter, id_generator: IdGenerator, map: Map, ant_factory: AntFactory, food_factory: FoodFactory, nest_factory: NestFactory, ground_beetle_factory: GroundBeetleFactory):
        self._event_bus = event_bus
        self._id_generator = id_generator
        self._map = map
        self._ant_factory = ant_factory
        self._food_factory = food_factory
        self._nest_factory = nest_factory
        self._ground_beetle_factory = ground_beetle_factory

        self._map.events.add_listener('entity_born', lambda entity: self._listen_entity(entity))
        self._event_bus.add_listener('birth_request', self._on_entity_birth_request)

        for entity in self._map.get_entities():
            self._listen_entity(entity)

    def _listen_entity(self, entity: Entity):
        entity.events.add_listener('birth_request', self._on_entity_birth_request)

    def _on_entity_birth_request(self, request: dict):
        new_entity: Entity = None
        id = self._id_generator.generate_id()
        
        match(request['entity_type']):
            case EntityTypes.ANT:
                larva: Larva = request['larva']
                nest: Nest = request['nest']
                new_entity = self._ant_factory.build_new_ant(id, nest.from_colony_id, larva.ant_type, larva.dna_profile, nest.position, nest)
            case EntityTypes.FOOD:
                preborn_food: PrebornFood = request['preborn_food']
                new_entity = self._food_factory.build_new_food(id, preborn_food.position, preborn_food.calories, preborn_food.food_type)
            case EntityTypes.NEST:
                new_entity = self._nest_factory.build_new_nest(id, request['position'], request['colony_id'])
            case EntityTypes.GROUND_BEETLE:
                new_entity = self._ground_beetle_factory.build_new_ground_beetle(id, request['position'])
            case _:
                raise Exception('cant birth current entity type')
            
        self._map.add_new_entity(new_entity)

        new_entity.born()

        if 'callback' in request:
            request['callback'](new_entity)
