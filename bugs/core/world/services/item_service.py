from .base_service import BaseService
from core.world.entities.item.items.base.item import Item
from core.world.entities.base.entity_types import EntityTypes
from typing import List
import random

class ItemService(BaseService):

    def __init__(self, event_bus):
        super().__init__(event_bus)
        self._item_die_schedule = {}
        self._bringing_items: List[Item] = []

        # event_bus.add_listener('step_start', self._on_step_start)
        # event_bus.add_listener('item_dropped', self._on_item_dropped)
        # event_bus.add_listener('item_born', self._on_item_born)
        # event_bus.add_listener('time_to_bring_items', self._bring_bringing_items)
        # event_bus.add_listener('item_bringing_start', self._on_item_bringing_start)
        # event_bus.add_listener('item_bringing_stop', self._on_item_bringing_stop)

    def set_world(self, world):
        super().set_world(world)
        self._sort_all_items()

    def _sort_all_items(self):
        items: List[Item] = self._world.map.get_entities(entity_types=[EntityTypes.ITEM])
        for item in items:
            if item.is_bringing:
                self._bringing_items.append(item)
            elif not item.is_picked:
                self._add_item_to_die_schedule(item)

        print(1)

    def _add_item_to_die_schedule(self, item: Item):
        die_step = self._world.current_step + item.life_span
        items_to_die: List = self._item_die_schedule.get(die_step, [])
        items_to_die.append(item)
        self._item_die_schedule[die_step] = items_to_die

    def _kill_items_on_current_step(self):
        current_step = self._world.current_step
        if current_step in self._item_die_schedule:
            items: List[Item] = self._item_die_schedule[current_step]
            for item in items:
                if not item.is_died and not item.is_picked and not item.is_bringing:
                    item.simple_die()
            del self._item_die_schedule[current_step]

    def _bring_bringing_items(self):
        for item in self._bringing_items:
            item.be_bringed()

    def _on_step_start(self, current_step, season):
        self._kill_items_on_current_step()

    def _on_item_dropped(self, item: Item):
        item.life_span = random.randint(3, 6)
        self._add_item_to_die_schedule(item)

    def _on_item_born(self, item: Item):
        self._add_item_to_die_schedule(item)

    def _on_item_bringing_start(self, item: Item):
        self._bringing_items.append(item)

    def _on_item_bringing_stop(self, item: Item):
        self._bringing_items.remove(item)