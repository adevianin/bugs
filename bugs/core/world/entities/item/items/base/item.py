from core.world.entities.base.entity_types import EntityTypes
from core.world.utils.event_emiter import EventEmitter
from core.world.utils.point import Point
from core.world.entities.item.items.base.item_types import ItemTypes
from core.world.entities.base.body import Body
from core.world.entities.base.entity import Entity
from core.world.entities.colony.formation.formation import Formation

class Item(Entity):

    def __init__(self, events: EventEmitter, id: int, body: Body, item_type: ItemTypes, strength: int, variety: int, life_span: int, is_picked: bool):
        super().__init__(events, id, EntityTypes.ITEM, None, body)
        self._item_type = item_type
        self._is_picked = is_picked
        self._variety = variety
        self._strength = strength
        self._life_span = life_span

    @property
    def item_type(self):
        return self._item_type
    
    @property
    def is_picked(self):
        return self._is_picked
    
    @property
    def variety(self):
        return self._variety
    
    @property
    def strength(self):
        return self._strength
    
    @property
    def life_span(self):
        return self._life_span
    
    def do_step(self):
        if self._life_span != -1:
            self._life_span -= 1
            if self._life_span == 0 and not self._is_picked:
                self.die()
    
    def use(self, using_strength: int = None) -> int:
        if (using_strength is None):
            using_strength = self._strength
        used_strength = using_strength if self._strength > using_strength else self._strength
        self._strength -= used_strength
        if self._strength == 0:
            self.die()

        return used_strength
    
    def pickup(self):
        self._is_picked = True
        self._emit_action('item_was_picked_up')

    def drop(self, position: Point):
        self._is_picked = False
        self._body.position = position
        self._emit_action('item_was_dropped', {
            'position': self.position.to_public_json()
        })

    def set_formation(self, formation: Formation, bringing_speed: int, special_unit_id: str):
        self._formation = formation
        self._formation_bringing_speed = bringing_speed
        self._formation_unit_id = self._formation.register_unit(self._body.position, is_passive_unit=True, special_unit_id=special_unit_id)
        self._formation.events.add_listener(f'passive_unit_move_request:{self._formation_unit_id}', self._on_formation_move_request)
        self._formation.events.add_listener('destroyed', self._remove_formation)

    def _remove_formation(self):
        self._formation.remove_unit(self._formation_unit_id)
        self._formation.events.remove_listener(f'passive_unit_move_request:{self._formation_unit_id}', self._on_formation_move_request)
        self._formation.events.remove_listener('destroyed', self._remove_formation)
        self._formation = None

    def to_public_json(self):
        json = super().to_public_json()
        json.update({
            'item_type': self._item_type,
            'is_picked': self._is_picked,
            'variety': self._variety
        })
        
        return json
    
    def _on_formation_move_request(self):
        pos = self._formation.get_position_for_unit(self._formation_unit_id)
        self._be_bringed_to(pos, self._formation_bringing_speed)
        self._formation.unit_changed_position(pos, self._formation_unit_id)

    def _be_bringed_to(self, position: Point, bringing_speed: int):
        self._body.position = position
        self._emit_action('being_bringed', {
            'new_position': self._body.position.to_public_json(),
            'bring_user_speed': bringing_speed
        })