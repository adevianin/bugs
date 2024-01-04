from core.world.entities.base.entity_types import EntityTypes
from core.world.entities.base.live_entity.live_body import LiveBody
from core.world.entities.base.live_entity.mind import Mind
from core.world.utils.event_emiter import EventEmitter
from core.world.entities.base.live_entity.live_entity import LiveEntity
from core.world.entities.item.items.base.item_types import ItemTypes
from core.world.entities.item.items.base.item import Item
from core.world.entities.world.birthers.requests.item_birth_request import ItemBirthRequest

class GroundBeetle(LiveEntity):

    def __init__(self, event_bus: EventEmitter, events: EventEmitter, id: int, from_colony_id: int, body: LiveBody, mind: Mind):
        super().__init__(event_bus, events, id, EntityTypes.GROUND_BEETLE, from_colony_id, body, mind)

        self.events.add_listener('died', self._on_died)

    def _on_died(self):
        def preborn_corpse_item(item: Item):
            item.body.angle = self._body.angle

        self.events.emit('birth_request', ItemBirthRequest.build(self.position, 500, ItemTypes.GROUND_BEETLE_CORPSE, preborn_corpse_item))