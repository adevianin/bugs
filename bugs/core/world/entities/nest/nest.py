from ..base.entity_types import EntityTypes
from core.world.utils.event_emiter import EventEmitter
from core.world.entities.item.items.base.item import Item
from core.world.entities.base.entity import Entity
from core.world.entities.item.items.base.item_types import ItemTypes
from core.world.entities.world.birthers.requests.ant_birth_request import AntBirthRequest
from core.world.entities.world.birthers.requests.item_birth_request import ItemBirthRequest
from core.world.entities.action.nest_stored_calories_changed_action import NestStoredCaloriesChangedAction
from core.world.entities.action.nest_larvae_changed_action import NestLarvaeChangedAction
from core.world.entities.action.nest_build_status_changed_action import NestBuildStatusChangedAction
from core.world.entities.ant.base.larva import Larva
from .nest_body import NestBody
from core.world.entities.ant.base.egg import Egg
from core.world.entities.action.nest_egg_develop import NestEggDevelopAction

class Nest(Entity):

    _body: NestBody

    def __init__(self, event_bus: EventEmitter, events: EventEmitter, id: int, from_colony_id: int, owner_id: int, body: NestBody):
        super().__init__(event_bus, events, id, EntityTypes.NEST, from_colony_id, owner_id, body)

        self._body.events.add_listener('larvae_changed', self._on_larvae_changed)
        self._body.events.add_listener('stored_calories_changed', self._on_stored_calories_changed)
        self._body.events.add_listener('build_status_changed', self._on_build_status_changed)
        self._body.events.add_listener('larva_is_ready', self._on_larva_is_ready)
        self._body.events.add_listener('egg_develop', self._on_egg_develop)

    @property
    def area(self):
        return self._body.area
    
    @property
    def stored_calories(self):
        return self._body.stored_calories
    
    @property
    def larvae(self):
        return self._body.larvae
    
    @property
    def eggs(self):
        return self._body.eggs
    
    @property
    def larva_places_count(self):
        return self._body.larva_places_count
    
    @property
    def egg_places_count(self):
        return self._body.egg_places_count
    
    @property
    def build_progress(self):
        return self._body.build_progress
    
    @property
    def is_built(self):
        return self._body.is_built

    def do_step(self):
        self._body.feed_larvae()
        self._body.develop_eggs()

    def take_edible_item(self, item: Item):
        self._body.take_edible_item(item)

    def take_calories(self, caloris_count: int):
        self._body.take_calories(caloris_count)

    def give_calories(self, count: int) -> int:
        return self._body.give_calories(count)

    def add_larva(self, larva: Larva):
        self._body.add_larva(larva)

    def build(self):
        self._body.build()

    def steal_food(self, on_food_ready):
        strength = self._body.steal_some_food()
        if strength > 0:
            self._event_bus.emit('item_birth_request', ItemBirthRequest.build(self._body.position, strength, ItemTypes.ANT_FOOD, None, on_food_ready))
            return True
        else:
            return False

    def _on_stored_calories_changed(self):
        self._emit_action(NestStoredCaloriesChangedAction.build(self.id, self._body.stored_calories))

    def _on_larvae_changed(self):
        self._emit_action(NestLarvaeChangedAction.build(self.id, self._body.larvae))

    def _on_build_status_changed(self):
        self._emit_action(NestBuildStatusChangedAction.build(self.id, self._body.is_built))

    def _on_larva_is_ready(self, larva: Larva):
        self._event_bus.emit('ant_birth_request', AntBirthRequest.build(self._id, larva))

    def _on_egg_develop(self, egg: Egg):
        self._emit_action(NestEggDevelopAction.build(self.id, egg, self._owner_id))
    