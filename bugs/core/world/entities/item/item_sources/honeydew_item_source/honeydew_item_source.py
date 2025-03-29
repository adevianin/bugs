from .honeydew_item_source_body import HoneydewItemSourceBody
from core.world.entities.item.items.base.item_types import ItemTypes
from core.world.utils.event_emiter import EventEmitter
from core.world.entities.item.item_sources.base.item_source import ItemSource
from core.world.entities.base.ownership_config import OwnershipConfig
from core.world.entities.world.season_types import SeasonTypes

class HoneydewItemSource(ItemSource):

    ACTIVE_SEASONS = [SeasonTypes.SUMMER, SeasonTypes.AUTUMN]

    def __init__(self, event_bus: EventEmitter, events: EventEmitter, id: int, ownership: OwnershipConfig, body: HoneydewItemSourceBody):
        super().__init__(event_bus, events, id, ownership, body, ItemTypes.HONEYDEW)