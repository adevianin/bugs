from ..base.entity_types import EntityTypes
from core.world.utils.event_emiter import EventEmitter
from core.world.entities.ant.base.larva import Larva
from core.world.entities.item.items.base.item import Item
from core.world.entities.base.body import Body
from core.world.entities.base.entity import Entity
from core.world.entities.item.items.base.item_types import ItemTypes
from core.world.entities.world.birthers.requests.ant_birth_request import AntBirthRequest
from core.world.entities.world.birthers.requests.item_birth_request import ItemBirthRequest

class Nest(Entity):

    def __init__(self, events: EventEmitter, id: int, from_colony_id: int,  body: Body, larvae: list[Larva], larva_places_count: int, stored_calories: int, area: int, build_progress: int):
        super().__init__(events, id, EntityTypes.NEST, from_colony_id, body)
        self._area = area
        self._stored_calories = stored_calories
        self._larvae = larvae
        self._larva_places_count = larva_places_count
        self._build_progress = build_progress

    @property
    def area(self):
        return self._area
    
    @property
    def stored_calories(self):
        return self._stored_calories
    
    @property
    def larvae(self):
        return self._larvae
    
    @property
    def larva_places_count(self):
        return self._larva_places_count
    
    @property
    def build_progress(self):
        return self._build_progress
    
    @property
    def is_built(self):
        return self._build_progress == 100

    def do_step(self):
        self._feed_larvae()

    def take_edible_item(self, item: Item):
        self._stored_calories += item.use()
        self._emit_stored_calories_changed()

    def take_calories(self, caloris_count: int):
        self._stored_calories += caloris_count
        self._emit_stored_calories_changed()

    def give_calories(self, count: int) -> int:
        if (self._stored_calories >= count):
            self._stored_calories -= count
            self._emit_stored_calories_changed()
            return count
        else:
            can_give = self._stored_calories
            self._stored_calories = 0
            self._emit_stored_calories_changed()
            return can_give

    def to_public_json(self):
        json = super().to_public_json()
        json.update({
            'stored_calories': self._stored_calories,
            'larvae': self._larvae_to_public_json(),
            'larva_places_count': self._larva_places_count,
            'is_built': self.is_built
        })
        
        return json
    
    def add_larva(self, larva: Larva):
        self._larvae.append(larva)
        self._emit_larvae_changed()

    def build(self):
        is_build_before = self.is_built
        build_step = 5
        if not self.is_built:
            if self._build_progress + build_step >= 100:
                self._build_progress = 100
                self._body.hp = self._body.stats.max_hp
            else:
                self._build_progress += build_step

        if is_build_before != self.is_built:
            self._emit_building_status_changed()

    def steal_food(self, on_food_ready):
        strength = min(300, self._stored_calories)
        if strength > 0:
            self.events.emit('birth_request', ItemBirthRequest.build(self._body.position, strength, ItemTypes.ANT_FOOD, None, on_food_ready))
            self._stored_calories -= strength
            return True
        else:
            return False

    def _feed_larvae(self):
        larvae_count = len(self._larvae)
        if larvae_count == 0:
            return 
        portion_size = 10
        needed_calories = larvae_count * portion_size
        calories_for_feeding = self.give_calories(needed_calories)
        actual_portion_size = calories_for_feeding / larvae_count
        larvae_ready_to_born = []
        for larva in self._larvae:
            larva.feed(actual_portion_size)
            if larva.is_ready_to_born:
                larvae_ready_to_born.append(larva)

        for larva in larvae_ready_to_born:
            self._larvae.remove(larva)
            self.events.emit('birth_request', AntBirthRequest.build(self._id, larva))
        
        self._emit_larvae_changed()

    def _emit_stored_calories_changed(self):
        self._emit_action('nest_stored_calories_changed', {
            'stored_calories': self._stored_calories
        })

    def _emit_larvae_changed(self):
        self._emit_action('nest_larvae_changed', {
            'larvae': self._larvae_to_public_json()
        })

    def _emit_building_status_changed(self):
        self._emit_action('nest_build_status_changed', {
            'is_built': self.is_built
        })
    
    def _larvae_to_public_json(self):
        larvae_json = []
        for larva in self._larvae:
            larvae_json.append(larva.to_public_json())
        
        return larvae_json