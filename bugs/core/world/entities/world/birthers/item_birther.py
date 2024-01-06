from core.world.entities.item.items.base.item import Item
from core.world.entities.world.birthers.requests.item_birth_request import ItemBirthRequest
from core.world.entities.map.map import Map
from core.world.id_generator import IdGenerator
from core.world.utils.event_emiter import EventEmitter
from .entity_birther import EntityBirther
from core.world.entities.item.items.item_factory import ItemFactory

class ItemBirther(EntityBirther):

    def __init__(self, event_bus: EventEmitter, id_generator: IdGenerator, map: Map, item_factory: ItemFactory):
        super().__init__(event_bus, id_generator, 'item_birth_request', map)
        self._item_factory = item_factory

    def _build_entity(self, id, request: ItemBirthRequest) -> Item:
        return self._item_factory.build_new_item(id, request.item_type, request.position, request.strength)