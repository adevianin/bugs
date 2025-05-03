from core.world.entities.base.death_record.base_death_record import BaseDeathRecord
from ..base.entity_types import EntityTypes
from core.world.utils.event_emiter import EventEmitter
from core.world.entities.item.items.base.item import Item
from core.world.entities.base.entity import Entity
from core.world.entities.item.items.base.item_types import ItemTypes
from core.world.entities.world.birth_requests.ant_requests.ant_birth_from_nest_request import AntBirthFromNestRequest
from core.world.entities.world.birth_requests.item_birth_request import ItemBirthRequest
from core.world.entities.action.nest_stored_calories_changed_action import NestStoredCaloriesChangedAction
from core.world.entities.action.nest_build_status_changed_action import NestBuildStatusChangedAction
from core.world.entities.ant.base.larva import Larva
from .nest_body import NestBody
from core.world.entities.ant.base.egg import Egg
from core.world.entities.action.nest_egg_develop import NestEggDevelopAction
from core.world.entities.action.nest_larva_fed_action import NestLarvaFedAction
from core.world.entities.action.nest_larva_is_ready_action import NestLarvaIsReadyAction
from core.world.entities.ant.base.ant_types import AntTypes
from .nest_stats import NestStats
from core.world.entities.action.nest_fortification_changed_action import NestFortificationChangedAction
from core.world.entities.base.ownership_config import OwnershipConfig
from core.world.entities.world.notification.notifications.died_nest_notification import DiedNestNotification
from core.world.entities.world.notification.notifications.nest_alarm_raised_notification import NestAlarmRaisedNotification
from core.world.entities.world.notification.notifications.nest_alarm_canceled_notification import NestAlarmCanceledNotification
from .food_sources_data_manager import FoodSourcesDataManager
from core.world.utils.point import Point
from core.world.entities.world.season_types import SeasonTypes
from core.world.entities.action.nest_renamed_action import NestRenamedAction

from typing import List

class Nest(Entity):

    _body: NestBody
    stats: NestStats

    def __init__(self, event_bus: EventEmitter, events: EventEmitter, id: int, ownership: OwnershipConfig, body: NestBody, nearby_food_sources_data_manager: FoodSourcesDataManager, 
                 nearby_enemy_positions: List[Point], name: str, is_main: bool):
        super().__init__(event_bus, events, id, EntityTypes.NEST, ownership, body)
        self._nearby_food_sources_data_manager = nearby_food_sources_data_manager
        self._nearby_enemy_positions = nearby_enemy_positions
        self._name = name
        self._is_main = is_main
        self.collect_food_ant_speed_register = []

        self._body.events.add_listener('stored_calories_changed', self._on_stored_calories_changed)
        self._body.events.add_listener('build_status_changed', self._on_build_status_changed)
        self._body.events.add_listener('larva_is_ready', self._on_larva_is_ready)
        self._body.events.add_listener('larva_fed', self._on_larva_fed)
        self._body.events.add_listener('egg_develop', self._on_egg_develop)
        self._body.events.add_listener('fortification_changed', self._on_fortification_changed)

        self._not_building_steps_counter = 0

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
    
    @property
    def nearby_food_sources_data_manager(self):
        return self._nearby_food_sources_data_manager
    
    @property
    def is_under_attack(self):
        return len(self._nearby_enemy_positions) > 0
    
    @property
    def nearby_enemy_positions(self) -> List[Point]:
        return self._nearby_enemy_positions
    
    @property
    def name(self) -> str:
        return self._name
        
    @name.setter
    def name(self, value: str):
        self._name = value
        self._emit_action(NestRenamedAction(self.id, self.name))
    
    @property
    def is_main(self) -> bool:
        return self._is_main
    
    def do_step(self, step_number: int, season: SeasonTypes):
        if season != SeasonTypes.WINTER:
            self._body.feed_larvae()
            self._body.develop_eggs()
        self._body.handle_not_building_steps()
        self.collect_food_ant_speed_register.clear()

    def gradual_decay(self):
        self._body.gradual_decay()

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
        return self._body.move_egg_to_larva_chamber(egg_id)

    def delete_egg(self, egg_id: str):
        self._body.delete_egg(egg_id)

    def delete_larva(self, larva_id: str):
        self._body.delete_larva(larva_id)

    def build(self):
        self._body.build()
        self._not_building_steps_counter = 0

    def get_some_food(self, on_food_ready, food_count: int):
        strength = self._body.get_some_food(food_count)
        if strength > 0:
            self._event_bus.emit('item_birth_request', ItemBirthRequest(self._body.position, strength, ItemTypes.ANT_FOOD, 0, None, on_food_ready))
            return True
        else:
            return False
        
    def take_fortificating_item(self, item: Item):
        self._body.take_fortificating_item(item)

    def raise_attack_alarm(self, enemies_positions):
        is_notification_needed = not self.is_under_attack and len(enemies_positions) > 0
        self._nearby_enemy_positions = enemies_positions
        self.events.emit('is_under_attack', enemies_positions)
        if is_notification_needed:
            self._emit_notification(NestAlarmRaisedNotification(self.owner_id, self.position, self.name))

    def cancel_attack_alarm(self):
        if self.is_under_attack:
            self.events.emit('attack_is_over')
            self._emit_notification(NestAlarmCanceledNotification(self.owner_id, self.position, self.name))
        self._nearby_enemy_positions = []

    def _on_stored_calories_changed(self):
        self._emit_action(NestStoredCaloriesChangedAction.build(self.id, self._body.stored_calories))

    def _on_build_status_changed(self):
        self._emit_action(NestBuildStatusChangedAction.build(self.id, self._body.is_built))

    def _on_larva_is_ready(self, larva: Larva):
        self._emit_action(NestLarvaIsReadyAction.build(self.id, larva, self._owner_id))
        self._event_bus.emit('ant_birth_request', AntBirthFromNestRequest(larva, self._id))

    def _on_larva_fed(self, larva: Larva):
        self._emit_action(NestLarvaFedAction.build(self.id, larva, self._owner_id))

    def _on_egg_develop(self, egg: Egg):
        self._emit_action(NestEggDevelopAction.build(self.id, egg, self._owner_id))

    def _on_fortification_changed(self):
        self._emit_action(NestFortificationChangedAction.build(self.id, self._body.fortification))

    def _on_body_died(self, death_record: BaseDeathRecord):
        self._emit_notification(DiedNestNotification(self.owner_id, self.position, self.name, death_record)) #before super because nest died notification then colony died notification
        super()._on_body_died(death_record)
    