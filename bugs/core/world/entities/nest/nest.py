from core.world.entities.base.death_record.base_death_record import BaseDeathRecord
from ..base.entity_types import EntityTypes
from core.world.utils.event_emiter import EventEmitter
from core.world.entities.item.items.base.item import Item
from core.world.entities.base.entity import Entity
from core.world.entities.item.items.base.item_types import ItemTypes
from core.world.entities.world.birthers.requests.ant_birth_request import AntBirthRequest
from core.world.entities.world.birthers.requests.item_birth_request import ItemBirthRequest
from core.world.entities.action.nest_stored_calories_changed_action import NestStoredCaloriesChangedAction
from core.world.entities.action.nest_build_status_changed_action import NestBuildStatusChangedAction
from core.world.entities.ant.base.larva import Larva
from .nest_body import NestBody
from core.world.entities.ant.base.egg import Egg
from core.world.entities.action.nest_egg_develop import NestEggDevelopAction
from core.world.entities.action.nest_egg_became_larva import NestEggBecameLarvaAction
from core.world.entities.action.nest_larva_fed_action import NestLarvaFedAction
from core.world.entities.action.nest_larva_is_ready_action import NestLarvaIsReadyAction
from core.world.entities.action.nest_larva_added_action import NestLarvaAddedAction
from core.world.entities.action.nest_egg_added_action import NestEggAddedAction
from core.world.entities.ant.base.ant_types import AntTypes
from .nest_stats import NestStats
from core.world.entities.action.nest_fortification_changed_action import NestFortificationChangedAction
from core.world.entities.base.ownership_config import OwnershipConfig
from core.world.entities.world.notification.notifications.died_nest_notification import DiedNestNotification
from core.world.entities.world.notification.notifications.nest_alarm_raised_notification import NestAlarmRaisedNotification
from core.world.entities.world.notification.notifications.nest_alarm_canceled_notification import NestAlarmCanceledNotification

class Nest(Entity):

    _body: NestBody
    stats: NestStats

    def __init__(self, event_bus: EventEmitter, events: EventEmitter, id: int, ownership: OwnershipConfig, body: NestBody):
        super().__init__(event_bus, events, id, EntityTypes.NEST, ownership, body)

        self._is_under_attack = False

        self._body.events.add_listener('stored_calories_changed', self._on_stored_calories_changed)
        self._body.events.add_listener('build_status_changed', self._on_build_status_changed)
        self._body.events.add_listener('larva_is_ready', self._on_larva_is_ready)
        self._body.events.add_listener('larva_fed', self._on_larva_fed)
        self._body.events.add_listener('larva_added', self._on_larva_added)
        self._body.events.add_listener('egg_develop', self._on_egg_develop)
        self._body.events.add_listener('egg_became_larva', self._on_egg_became_larva)
        self._body.events.add_listener('egg_added', self._on_egg_added)
        self._body.events.add_listener('fortification_changed', self._on_fortification_changed)

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
    def build_progress(self):
        return self._body.build_progress
    
    @property
    def is_built(self):
        return self._body.is_built
    
    @property
    def fortification(self):
        return self._body.fortification

    def do_step(self):
        self._body.feed_larvae()
        self._body.develop_eggs()

    def take_edible_item(self, item: Item):
        self._body.take_edible_item(item)

    def take_calories(self, caloris_count: int):
        self._body.take_calories(caloris_count)

    def give_calories(self, count: int) -> int:
        return self._body.give_calories(count)

    def add_egg(self, egg: Egg):
        self._body.add_egg(egg)

    def change_egg_caste(self, egg_id: str, ant_type: AntTypes):
        self._body.change_egg_caste(egg_id, ant_type)
        
    def change_egg_name(self, egg_id: str, name: str):
        self._body.change_egg_name(egg_id, name)

    def move_egg_to_larva_chamber(self, egg_id: str):
        self._body.move_egg_to_larva_chamber(egg_id)

    def delete_egg(self, egg_id: str):
        self._body.delete_egg(egg_id)

    def delete_larva(self, larva_id: str):
        self._body.delete_larva(larva_id)

    def build(self):
        self._body.build()

    def get_some_food(self, on_food_ready, food_count: int):
        strength = self._body.get_some_food(food_count)
        if strength > 0:
            self._event_bus.emit('item_birth_request', ItemBirthRequest.build(self._body.position, strength, ItemTypes.ANT_FOOD, None, on_food_ready))
            return True
        else:
            return False
        
    def take_fortificating_item(self, item: Item):
        self._body.take_fortificating_item(item)

    def raise_attack_alarm(self, enemies_positions):
        self.events.emit('is_under_attack', enemies_positions)
        if not self._is_under_attack:
            self._emit_notification(NestAlarmRaisedNotification(self.owner_id, self.position))
        self._is_under_attack = True

    def cancel_attack_alarm(self):
        if self._is_under_attack:
            self.events.emit('attack_is_over')
            self._emit_notification(NestAlarmCanceledNotification(self.owner_id, self.position))
        self._is_under_attack = False

    def _on_stored_calories_changed(self):
        self._emit_action(NestStoredCaloriesChangedAction.build(self.id, self._body.stored_calories))

    def _on_build_status_changed(self):
        self._emit_action(NestBuildStatusChangedAction.build(self.id, self._body.is_built))

    def _on_larva_is_ready(self, larva: Larva):
        self._emit_action(NestLarvaIsReadyAction.build(self.id, larva, self._owner_id))
        self._event_bus.emit('ant_birth_request', AntBirthRequest.build(self._id, larva))

    def _on_larva_fed(self, larva: Larva):
        self._emit_action(NestLarvaFedAction.build(self.id, larva, self._owner_id))

    def _on_larva_added(self, larva: Larva):
        self._emit_action(NestLarvaAddedAction.build(self.id, larva, self._owner_id))

    def _on_egg_develop(self, egg: Egg):
        self._emit_action(NestEggDevelopAction.build(self.id, egg, self._owner_id))

    def _on_egg_became_larva(self, egg: Egg):
        self._emit_action(NestEggBecameLarvaAction.build(self.id, egg, self._owner_id))

    def _on_egg_added(self, egg: Egg):
        self._emit_action(NestEggAddedAction.build(self.id, egg, self._owner_id))

    def _on_fortification_changed(self):
        self._emit_action(NestFortificationChangedAction.build(self.id, self._body.fortification))

    def _on_body_died(self, death_record: BaseDeathRecord):
        super()._on_body_died(death_record)
        self._emit_notification(DiedNestNotification(self.owner_id, self.position, death_record))
    