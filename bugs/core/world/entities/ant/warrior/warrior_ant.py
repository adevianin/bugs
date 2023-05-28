from ..base.ant import Ant
from ..base.ant_types import AntTypes
from core.world.utils.event_emiter import EventEmitter
from .warrior_ant_body import WarriorAntBody
from .warrior_ant_mind import WarrirorAntMind

class WarriorAnt(Ant):

    def __init__(self, event_bus: EventEmitter, id: int, mind: WarrirorAntMind, body: WarriorAntBody):
        super().__init__(event_bus, id, AntTypes.WARRIOR, mind, body)