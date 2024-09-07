from .nest_stats import NestStats
from core.world.utils.event_emiter import EventEmitter
from core.world.utils.point import Point
from core.world.entities.base.body import Body
from core.world.entities.ant.base.larva import Larva
from core.world.entities.item.items.base.item import Item
from core.world.entities.ant.base.egg import Egg
from core.world.entities.ant.base.ant_types import AntTypes

from typing import List

class NestBody(Body):

    stats: NestStats
    
    def __init__(self, events: EventEmitter, stats: NestStats, position: Point, angle: int, hp: int, larvae: List[Larva], eggs: List[Egg], larva_places_count: int, egg_places_count: int,
                stored_calories: int, area: int, build_progress: int, fortification: int):
        super().__init__(events, stats, position, angle, hp)
        self._area = area
        self._stored_calories = stored_calories
        self._larvae = larvae
        self._eggs = eggs
        self._larva_places_count = larva_places_count
        self._egg_places_count = egg_places_count
        self._build_progress = build_progress
        self._fortification = fortification

    @property
    def area(self):
        return self._area
    
    @property
    def stored_calories(self):
        return self._stored_calories
    
    @stored_calories.setter
    def stored_calories(self, value: int):
        self._stored_calories = value
        self.events.emit('stored_calories_changed')
    
    @property
    def larvae(self):
        return self._larvae
    
    @property
    def eggs(self):
        return self._eggs
    
    @property
    def larva_places_count(self):
        return self._larva_places_count
    
    @property
    def egg_places_count(self):
        return self._egg_places_count
    
    @property
    def build_progress(self):
        return self._build_progress
    
    @property
    def is_built(self):
        return self._build_progress == 100
    
    @property
    def fortification(self):
        return self._fortification
    
    @fortification.setter
    def fortification(self, fortification: int):
        self._fortification = fortification
        self.events.emit('fortification_changed')

    def add_egg(self, egg: Egg):
        self.eggs.append(egg)
        self.events.emit('egg_added', egg)

    def change_egg_caste(self, egg_id: str, ant_type: AntTypes):
        egg = self._get_egg_by_id(egg_id)
        if egg:
            egg.ant_type = ant_type
    
    def take_edible_item(self, item: Item):
        self.stored_calories += item.use()

    def take_calories(self, caloris_count: int):
        self.stored_calories += caloris_count

    def give_calories(self, count: int) -> int:
        if (self.stored_calories >= count):
            self.stored_calories -= count
            return count
        else:
            can_give = self.stored_calories
            self.stored_calories = 0
            return can_give
        
    def get_some_food(self, food_count: int):
        strength = min(food_count, self.stored_calories)
        self.stored_calories -= strength
        return strength
        
    def build(self):
        is_build_before = self.is_built
        build_step = 5
        hp_step = 5 * self.stats.max_hp / 100
        if not self.is_built:
            if self._build_progress + build_step >= 100:
                self._build_progress = 100
                self.hp = self.stats.max_hp
            else:
                self._build_progress += build_step
                self.hp += hp_step

        if is_build_before != self.is_built:
            self.events.emit('build_status_changed')

    def feed_larvae(self):
        larvae_count = len(self._larvae)
        if larvae_count == 0 or self.stored_calories == 0:
            return 
        portion_size = 10
        needed_calories = larvae_count * portion_size
        calories_for_feeding = self.give_calories(needed_calories)
        actual_portion_size = calories_for_feeding / larvae_count
        larvae_ready_to_born = []

        for larva in self._larvae:
            if larva.is_ready_to_born:
                larvae_ready_to_born.append(larva)
            else:
                larva.feed(actual_portion_size)
                self.events.emit('larva_fed', larva)

        for larva in larvae_ready_to_born:
            self._larvae.remove(larva)
            self.events.emit('larva_is_ready', larva)
        
    def develop_eggs(self):
        ready_eggs: List[Egg] = []

        for egg in self._eggs:
            if egg.is_ready:
                ready_eggs.append(egg)
            else:
                egg.develop()
                self.events.emit('egg_develop', egg)

        for egg in ready_eggs:
            self._eggs.remove(egg)
            larva = Larva.build_new(egg.name, egg.ant_type, egg.genome)
            self._add_larva(larva)
            self.events.emit('egg_became_larva', egg)

    def receive_damage(self, damage: int):
        if self.fortification > 0:
            self.fortification -= damage if damage <= self.fortification else self.fortification
            return False
        else:
            return super().receive_damage(damage)
        
    def take_fortificating_item(self, item: Item):
        item.die()

        if self.fortification + item.strength < self.stats.max_fortification:
            self.fortification += item.strength
        else:
            self.fortification = self.stats.max_fortification
        

    def _add_larva(self, larva: Larva):
        self._larvae.append(larva)
        self.events.emit('larva_added', larva)

    def _get_egg_by_id(self, egg_id: str):
        for egg in self._eggs:
            if egg.id == egg_id:
                return egg
            
        return None
        
