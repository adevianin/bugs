from .base_service import BaseService
from core.world.entities.item.items.base.item import Item
from core.world.entities.item.items.base.item_types import ItemTypes
from core.world.entities.base.entity_types import EntityTypes
from core.world.utils.event_emiter import EventEmitter
from typing import List
import logging

class ItemService(BaseService):

    def __init__(self, event_bus: EventEmitter, logger: logging.Logger):
        super().__init__(event_bus)
        self._item_die_schedule = {}
        self._bug_corpses: List[Item] = []
        self._logger = logger

        event_bus.add_listener('items_step_pulse', self._on_items_step_pulse)
        event_bus.add_listener('item_born', self._on_item_born)

    def set_world(self, world):
        super().set_world(world)
        self._handle_stucked_items()
        self._sort_all_items()

    def _handle_stucked_items(self):
        stucked_items: List[Item] = self._world.map.get_entities(entity_types=[EntityTypes.ITEM], filter=self._check_is_item_stucked)
        self._logger.warning(f'world has stucked items count={len(stucked_items)}')
        if len(stucked_items):
            for item in stucked_items:
                item.die_step = self._world.current_step + 10
        self._logger.warning(f'stucked items rescheduled')

    def _sort_all_items(self):
        items: List[Item] = self._world.map.get_entities(entity_types=[EntityTypes.ITEM])
        for item in items:
            self._sort_item(item)

    def _sort_item(self, item: Item):
        self._add_item_to_die_schedule(item)
        if item.item_type == ItemTypes.BUG_CORPSE:
            self._bug_corpses.append(item)

    def _add_item_to_die_schedule(self, item: Item):
        items_to_die: List = self._item_die_schedule.get(item.die_step, [])
        items_to_die.append(item)
        self._item_die_schedule[item.die_step] = items_to_die

    def _kill_items_for_step(self, step: int):
        if step in self._item_die_schedule:
            items_to_kill: List[Item] = self._item_die_schedule[step]
            for item in items_to_kill:
                if not item.is_died:
                    if not item.is_picked and not item.is_bringing:
                        item.simple_die()
                    else:
                        new_die_step = item.die_step + 10
                        self._change_die_step_for_item(item, new_die_step)

            del self._item_die_schedule[step]

    def _check_is_item_stucked(self, item: Item):
        return (
            item.die_step < self._world.current_step 
            and not item.is_died
            and not item.is_picked
            and not item.is_bringing
            )
    
    def _change_die_step_for_item(self, item: Item, die_step: int):
        items_to_die: List = self._item_die_schedule.get(item.die_step, [])
        if item in items_to_die:
            items_to_die.remove(item)
        item.die_step = die_step
        self._add_item_to_die_schedule(item)

    def _bring_bug_corpses(self):
        died_bug_corpses = []
        for bug_corpse in self._bug_corpses:
            if bug_corpse.is_died:
                died_bug_corpses.append(bug_corpse)
            else:
                if bug_corpse.is_bringing:
                    bug_corpse.be_bringed()

        for bug_corpse in died_bug_corpses:
            self._bug_corpses.remove(bug_corpse)

    def _on_items_step_pulse(self):
        self._kill_items_for_step(self._world.current_step)
        self._bring_bug_corpses()

    def _on_item_born(self, item: Item):
        self._sort_item(item)