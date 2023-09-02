from core.world.entities.base.entity_types import EntityTypes
from core.world.entities.base.live_entity.body import Body
from core.world.entities.base.live_entity.mind import Mind
from core.world.utils.event_emiter import EventEmitter
from core.world.entities.base.live_entity.live_entity import LiveEntity
from core.world.entities.item.item_types import ItemTypes
from core.world.entities.item.item import Item

class GroundBeetle(LiveEntity):

    MAX_HP = 800

    def __init__(self, events: EventEmitter, id: int, from_colony_id: int, mind: Mind, body: Body):
        super().__init__(events, id, EntityTypes.GROUND_BEETLE, from_colony_id, mind, body)

        self.events.add_listener('died', self._on_died)

    def _on_died(self):
        def preborn_corpse_item(item: Item):
            item.angle = self.angle

        self.events.emit('birth_request', {
            'entity_type': EntityTypes.ITEM,
            'item_type': ItemTypes.GROUND_BEETLE_CORPSE,
            'position': self.position,
            'strength': 500,
            'preborn_callback': preborn_corpse_item
        })