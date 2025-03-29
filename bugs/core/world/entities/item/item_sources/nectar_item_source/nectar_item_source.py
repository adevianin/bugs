from .nectart_item_source_body import NectarItemSourceBody
from core.world.entities.item.items.base.item_types import ItemTypes
from core.world.utils.event_emiter import EventEmitter
from core.world.entities.item.item_sources.base.item_source import ItemSource
from core.world.entities.base.ownership_config import OwnershipConfig
from core.world.entities.world.season_types import SeasonTypes

class NectarItemSource(ItemSource):

    ACTIVE_SEASONS = [SeasonTypes.SUMMER]

    def __init__(self, event_bus: EventEmitter, events: EventEmitter, id: int, ownership: OwnershipConfig, body: NectarItemSourceBody):
        super().__init__(event_bus, events, id, ownership, body, ItemTypes.NECTAR)