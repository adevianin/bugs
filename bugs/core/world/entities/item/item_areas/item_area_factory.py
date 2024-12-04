from core.world.utils.event_emiter import EventEmitter
from core.world.utils.point import Point
from core.world.utils.size import Size
from core.world.entities.item.items.base.item_types import ItemTypes
from core.world.entities.item.item_areas.base.item_area import ItemArea
from core.world.entities.base.body import Body
from core.world.entities.base.stats_library import StatsLibrary
from core.world.entities.base.ownership_config import OwnershipConfig
from core.world.entities.world.season_types import SeasonTypes
from core.world.id_generator import IdGenerator

class ItemAreaFactory():

    def __init__(self, event_bus: EventEmitter):
        self._event_bus = event_bus

    def build_new_item_area(self, position: Point, size: Size, item_type: ItemTypes, fertility: int, current_season: SeasonTypes):
        id = IdGenerator.generate_id()
        ownership = OwnershipConfig.build_empty()
        hp = StatsLibrary.GHOST_DEFAULT.max_hp
        is_active = ItemArea.check_is_fertile_season_for_item_type(current_season, item_type)
        return self.build_item_area(id, ownership, hp, position, 0, size, item_type, fertility, 0, is_active)

    def build_item_area(self, id: int, ownership: OwnershipConfig, hp: int, position: Point, angle: int, size: Size, item_type: ItemTypes, fertility: int, accumulated: int, 
                        is_active: bool):
        body = Body(EventEmitter(), StatsLibrary.GHOST_DEFAULT, position, angle, hp)
        return ItemArea(self._event_bus, EventEmitter(), id, ownership, body, size, item_type, fertility, accumulated, is_active)