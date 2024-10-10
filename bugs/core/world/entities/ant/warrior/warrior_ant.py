from core.world.entities.ant.base.ant_types import AntTypes
from core.world.utils.event_emiter import EventEmitter
from ..base.ant import Ant
from ..base.ant_types import AntTypes
from core.world.utils.event_emiter import EventEmitter
from .warrior_ant_body import WarriorAntBody
from .warrior_ant_mind import WarrirorAntMind
from core.world.utils.point import Point

class WarriorAnt(Ant):

    _body: WarriorAntBody
    _mind: WarrirorAntMind

    def __init__(self, event_bus: EventEmitter, events: EventEmitter, id: int, name: str, from_colony_id: int, owner_id: int, body: WarriorAntBody, mind: WarrirorAntMind):
        super().__init__(event_bus, events, id, name, from_colony_id, owner_id, body, AntTypes.WARRIOR, mind)

    def keep_clear_territory(self, position: Point, area: int):
        self._mind.keep_clear_territory(position=position, area=area)
