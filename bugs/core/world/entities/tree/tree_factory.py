from core.world.utils.event_emiter import EventEmitter
from .tree import Tree
from .tree_body import TreeBody
from core.world.entities.base.stats_library import StatsLibrary
from core.world.utils.point import Point
from core.world.entities.base.ownership_config import OwnershipConfig

class TreeFactory():

    def __init__(self, event_bus: EventEmitter):
        self._event_bus = event_bus

    def build_new_tree(self, id: int, position: Point):
        ownership = OwnershipConfig.build_empty()
        hp = StatsLibrary.GHOST_DEFAULT.max_hp
        return self.build_tree(id, ownership, position, 0, hp)

    def build_tree(self, id: int, ownership: OwnershipConfig, position: Point, angle: int, hp: int) -> Tree:
        body = TreeBody(EventEmitter(), StatsLibrary.GHOST_DEFAULT, position, angle, hp)
        return Tree(self._event_bus, EventEmitter(), id, ownership, body)