from ..base.ant import Ant
from ..base.ant_types import AntTypes
from core.world.utils.event_emiter import EventEmitter
from .warrior_ant_body import WarriorAntBody
from .warrior_ant_mind import WarrirorAntMind

class WarriorAnt(Ant):

    def __init__(self, event_bus: EventEmitter, events: EventEmitter, id: int, from_colony: int, mind: WarrirorAntMind, body: WarriorAntBody, is_in_operation: bool):
        super().__init__(event_bus, events, id, AntTypes.WARRIOR, from_colony, mind, body, is_in_operation)