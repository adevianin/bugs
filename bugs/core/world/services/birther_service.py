from core.world.utils.event_emiter import EventEmitter
from core.world.entities.ant.ant_factory import AntFactory
from core.world.entities.nest.nest import Nest
from core.world.entities.base.entity import Entity
from core.world.entities.ant.base.larva import Larva
from core.world.entities.food.preborn_food import PrebornFood
from core.world.entities.food.food_factory import FoodFactory
from core.world.entities.world.world import World

class BirtherService():

    def __init__(self, event_bus: EventEmitter, ant_factory: AntFactory, food_factory: FoodFactory):
        self._event_bus = event_bus
        self._ant_factory = ant_factory
        self._food_factory = food_factory

        self._event_bus.add_listener('preborn_ant', self._on_preborn_ant)
        self._event_bus.add_listener('preborn_food', self._on_preborn_food)
        self._event_bus.add_listener('preborn_nest', self._on_preborn_nest)

        self._event_bus.add_listener('entity_died', self._on_entity_died)

    def set_world(self, world: World):
        self._world = world

    def _on_preborn_ant(self, larva: Larva, nest: Nest):
        new_ant = self._ant_factory.build_ant(None, nest.from_colony, larva.ant_type, larva.dna_profile, larva.position, nest, None, None, None)
        self._world.map.give_birth_entity(new_ant)

    def _on_preborn_food(self, preborn_food: PrebornFood):
        new_food = self._food_factory.build_food(None, preborn_food.position, preborn_food.calories, preborn_food.food_type, -1, False)
        self._world.map.give_birth_entity(new_food)

    def _on_preborn_nest(self, preborn_nest: Nest):
        self._world.map.give_birth_entity(preborn_nest)

    def _on_entity_died(self, entity: Entity):
        self._world.map.die_entity(entity)
