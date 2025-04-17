from .entity_birther_service import EntityBirtherService
from core.world.utils.event_emiter import EventEmitter
from core.world.entities.item.items.item_factory import ItemFactory
from core.world.entities.item.items.base.item import Item
from core.world.entities.world.birth_requests.item_birth_request import ItemBirthRequest

class ItemBirtherService(EntityBirtherService):

    def __init__(self, event_bus: EventEmitter, item_factory: ItemFactory):
        super().__init__(event_bus, 'item_birth_request')
        self._item_factory = item_factory

    def _build_entity(self, request: ItemBirthRequest) -> Item:
        return self._item_factory.build_new_item(request.item_type, request.position, request.strength, request.angle, self._world.current_step)