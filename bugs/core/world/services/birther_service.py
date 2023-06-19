from core.world.utils.event_emiter import EventEmitter
from core.world.entities.map import Map
from core.world.entities.ant.ant_factory import AntFactory
from core.world.entities.nest.nest import Nest
from core.world.entities.base.entity import Entity
from core.world.entities.action import Action
from core.world.entities.ant.base.larva import Larva
from core.world.entities.food.preborn_food import PrebornFood
from core.world.entities.food.food_factory import FoodFactory

class BirtherService():

    def __init__(self, event_bus: EventEmitter, map: Map, ant_factory: AntFactory, food_factory: FoodFactory):
        self._event_bus = event_bus
        self._map = map
        self._ant_factory = ant_factory
        self._food_factory = food_factory

        self._event_bus.add_listener('preborn_ant', self._on_preborn_ant)
        self._event_bus.add_listener('preborn_food', self._on_preborn_food)
        self._event_bus.add_listener('preborn_nest', self._on_preborn_nest)

    def _on_preborn_ant(self, larva: Larva, nest: Nest):
        new_ant = self._ant_factory.give_birth(larva, nest)
        self._handle_born_entity(new_ant)

    def _on_preborn_food(self, preborn_food: PrebornFood):
        new_food = self._food_factory.give_birth(preborn_food)
        self._handle_born_entity(new_food)

    def _on_preborn_nest(self, preborn_nest: Nest):
        self._handle_born_entity(preborn_nest)

    def _handle_born_entity(self, entity: Entity):
        self._map.add_entity(entity)
        self._event_bus.emit('action_occurred', Action.build_action(entity.id, 'entity_born', { 'entity': entity.to_public_json() }))
