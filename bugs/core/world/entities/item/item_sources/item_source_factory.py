from core.world.utils.event_emiter import EventEmitter
from core.world.utils.point import Point
from core.world.entities.item.items.base.item_types import ItemTypes
from core.world.entities.item.item_sources.honeydew_item_source.honeydew_item_source import HoneydewItemSource
from core.world.entities.item.item_sources.honeydew_item_source.honeydew_item_source_body import HoneydewItemSourceBody
from core.world.entities.base.stats_library import StatsLibrary
from core.world.entities.base.ownership_config import OwnershipConfig
from core.world.entities.world.season_types import SeasonTypes
from core.world.id_generator import IdGenerator

class ItemSourceFactory():

    def __init__(self, event_bus: EventEmitter):
        self._event_bus = event_bus

    def build_new_honeydew_item_source(self, position: Point, item_type: ItemTypes, fertility: int, min_item_strength: int, max_item_strength: int, 
                                       current_season: SeasonTypes):
        id = IdGenerator.generate_id()
        ownership = OwnershipConfig.build_empty()
        hp = StatsLibrary.ITEM_SOURCE_DEFAULT.max_hp
        is_active = HoneydewItemSource.check_is_fertile_season(current_season)
        return self._build_honeydew_item_source(id, ownership, hp, position, 0, fertility, 0, min_item_strength, max_item_strength, is_active)


    def build_item_source(self, id: int, ownership: OwnershipConfig, hp: int, position: Point, angle: int, item_type: ItemTypes, 
                          fertility: int, accumulated: int, min_item_strength: int, max_item_strength: int, is_active: bool):
        match(item_type):
            case ItemTypes.HONEYDEW:
                return self._build_honeydew_item_source(id, ownership, hp, position, angle, fertility, accumulated, min_item_strength, max_item_strength, is_active)
            case _:
                raise Exception('unknown type of item source')

    def _build_honeydew_item_source(self, id: int, ownership: OwnershipConfig, hp: int, position: Point, angle: int, fertility: int, 
                                    accumulated: int, min_item_strength: int, max_item_strength: int, is_active: bool):
        stats = StatsLibrary.ITEM_SOURCE_DEFAULT
        body = HoneydewItemSourceBody(EventEmitter(), stats, position, angle, hp)
        return HoneydewItemSource(self._event_bus, EventEmitter(), id, ownership, body, fertility, accumulated, min_item_strength, max_item_strength, is_active)