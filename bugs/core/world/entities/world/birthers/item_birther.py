from core.world.entities.item.items.base.item import Item
from core.world.entities.world.birthers.requests.item_birth_request import ItemBirthRequest
from core.world.entities.map.map import Map
from core.world.utils.event_emiter import EventEmitter
from .entity_birther import EntityBirther
from core.world.entities.item.items.item_factory import ItemFactory

class ItemBirther(EntityBirther):

    def __init__(self, event_bus: EventEmitter, map: Map, item_factory: ItemFactory):
        super().__init__(event_bus, 'item_birth_request', map)
        self._item_factory = item_factory

    def _build_entity(self, request: ItemBirthRequest) -> Item:
        return self._item_factory.build_new_item(request.item_type, request.position, request.strength, request.angle)