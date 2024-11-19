from core.world.entities.base.entity_types import EntityTypes
from core.world.entities.base.live_entity.live_body import LiveBody
from core.world.entities.base.live_entity.mind import Mind
from core.world.utils.event_emiter import EventEmitter
from core.world.entities.base.live_entity.live_entity import LiveEntity
from core.world.entities.item.items.base.item_types import ItemTypes
from core.world.entities.item.items.base.item import Item
from core.world.entities.world.birthers.requests.item_birth_request import ItemBirthRequest
from core.world.entities.base.ownership_config import OwnershipConfig
from core.world.entities.base.death_record.base_death_record import BaseDeathRecord

class GroundBeetle(LiveEntity):

    def __init__(self, event_bus: EventEmitter, events: EventEmitter, id: int, ownership: OwnershipConfig, body: LiveBody, mind: Mind):
        super().__init__(event_bus, events, id, EntityTypes.GROUND_BEETLE, ownership, body, mind)

    def _on_body_died(self, death_record: BaseDeathRecord):
        super()._on_body_died(death_record)
        def on_corpse_item_born(item: Item):
            item.body.angle = self._body.angle

        self._event_bus.emit('item_birth_request', ItemBirthRequest.build(self.position, 500, ItemTypes.GROUND_BEETLE_CORPSE, None, on_corpse_item_born))
