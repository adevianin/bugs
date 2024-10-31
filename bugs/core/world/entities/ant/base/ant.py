from core.world.entities.base.live_entity.live_entity import LiveEntity
from core.world.entities.base.entity_types import EntityTypes
from core.world.utils.event_emiter import EventEmitter
from .ant_body import AntBody
from .ant_mind import AntMind
from .ant_types import AntTypes
from core.world.utils.point import Point
from core.world.entities.nest.nest import Nest
from core.world.entities.action.entity_got_in_nest_action import EntityGotInNestAction
from core.world.entities.action.entity_got_out_of_nest_action import EntityGotOutOfNestAction
from core.world.entities.action.ant_picked_up_item_action import AntPickedUpItemAction
from core.world.entities.action.ant_dropped_picked_item import AntDroppedPickedItemAction
from core.world.entities.world.birthers.requests.nest_birth_request import NestBirthRequest
from .guardian_behaviors import GuardianBehaviors
from core.world.entities.base.ownership_config import OwnershipConfig
from core.world.entities.world.notification.notifications.died_ant_notification import DiedAntNotification
from core.world.entities.base.death_record.base_death_record import BaseDeathRecord
from core.world.entities.base.death_record.no_home_death_record import NoHomeDeathRecord

class Ant(LiveEntity):

    _mind: AntMind
    mind: AntMind
    _body: AntBody
    body: AntBody

    def __init__(self, event_bus: EventEmitter, events: EventEmitter, id: int, name: str, ownership: OwnershipConfig, body: AntBody, 
                 ant_type: AntTypes, mind: AntMind):
        super().__init__(event_bus, events, id, EntityTypes.ANT, ownership, body, mind)
        self._ant_type = ant_type
        self._name = name

        self._body.events.add_listener('got_in_nest', self._on_got_in_nest)
        self._body.events.add_listener('got_out_of_nest', self._on_got_out_of_nest)
        self._body.events.add_listener('picked_up_item', self._on_picked_up_item)
        self._body.events.add_listener('dropped_picked_item', self._on_dropped_picked_item)

    @property
    def name(self):
        return self._name
        
    @property
    def sayer(self) -> EventEmitter:
        return self._body.sayer

    @property
    def ant_type(self):
        return self._ant_type
    
    @property
    def home_nest_id(self):
        return self._mind.home_nest.id if self._mind.home_nest else None
    
    @property
    def home_nest(self):
        return self._mind.home_nest
    
    @property
    def located_in_nest_id(self):
        return self._body.located_in_nest_id
    
    @property
    def is_detectable(self):
        return super().is_detectable and not self._body.is_in_nest
    
    @property
    def is_cooperative(self) -> bool:
        return self._mind.is_cooperative
    
    @is_cooperative.setter
    def is_cooperative(self, is_enabled):
        self._mind.is_cooperative = is_enabled
    
    @property
    def guardian_behavior(self) -> GuardianBehaviors:
        return self._mind.guardian_behavior
    
    @property
    def is_in_nest(self) -> bool:
        return self._body.is_in_nest
    
    @guardian_behavior.setter
    def guardian_behavior(self, behavior: GuardianBehaviors):
        self._mind.guardian_behavior = behavior
    
    def prepare_for_operation(self, assemble_point: Point = None, sayback: str = None):
        self._mind.prepare_for_operation(assemble_point, sayback)
    
    def collect_food(self, sayback: str = None):
        self._mind.collect_food(sayback)
    
    def relocate_to_nest(self, nest: Nest):
        self._mind.relocate_to_nest(nest)

    def found_nest(self, building_site: Point, callback):
        self._event_bus.emit('nest_birth_request', NestBirthRequest.build(building_site, self.from_colony_id, self.owner_id, callback))

    def build_nest(self, nest: Nest, get_inside_once_done: bool = False, sayback: str = None):
        self._mind.build_nest(nest=nest, get_inside_once_done=get_inside_once_done, sayback=sayback)

    def attack_nest(self, nest: Nest, sayback: str = None):
        self._mind.attack_nest(nest=nest, sayback=sayback)

    def build_fortification(self, nest: Nest, sayback: str = None):
        self._mind.build_fortification(nest=nest, sayback=sayback)

    def get_in_nest(self, nest: Nest):
        self._body.get_in_nest(nest)

    def get_out_of_nest(self):
        self._body.get_out_of_nest()

    def pick_up_item(self, item):
        self._body.pick_up_item(item)

    def drop_picked_item(self):
        self._body.drop_picked_item()

    def has_picked_item(self):
        return self._body.has_picked_item()

    # def stash_picked_item(self):
    #     self._body.stash_picked_item()

    # def get_stashed_item_back(self):
    #     self._mind.get_stashed_item_back()

    # def has_stashed_item(self):
    #     return self._body.has_stashed_item()
    
    # def get_stashed_item_data(self):
    #     return self._body.get_stashed_item_data()
    
    # def pickup_stashed_item(self):
    #     self._body.pickup_stashed_item()

    def give_food(self, nest: Nest):
        self._body.give_food(nest)

    def free_mind(self):
        self._mind.free_mind()

    def toggle_auto_thought_generation(self, is_enabled: bool):
        self._mind.toggle_auto_thought_generation(is_enabled)

    def get_food_item_from_nest(self, nest: Nest):
        return self._body.get_food_item_from_nest(nest)

    def join_operation(self):
        if self._mind.is_in_opearetion:
            raise Exception('already in operation')
        self._mind.toggle_is_in_operation(True)

    def leave_operation(self):
        self._mind.toggle_is_in_operation(False)
        self._mind.free_mind()
        self._mind.toggle_auto_thought_generation(True)
        self._body.sayer.remove_all_listeners()

    def no_home_die(self):
        self._body.die(NoHomeDeathRecord(self.position))

    def _on_got_in_nest(self, nest_id: int):
        self._emit_action(EntityGotInNestAction.build(self.id, nest_id))

    def _on_got_out_of_nest(self):
        self._emit_action(EntityGotOutOfNestAction.build(self.id))

    def _on_picked_up_item(self, item_id: int):
        self._emit_action(AntPickedUpItemAction.build(self.id, item_id))
    
    def _on_dropped_picked_item(self):
        self._emit_action(AntDroppedPickedItemAction.build(self.id))

    def _on_body_died(self, death_record: BaseDeathRecord):
        super()._on_body_died(death_record)
        self._emit_notification(DiedAntNotification(self.owner_id, self._name, death_record))

        