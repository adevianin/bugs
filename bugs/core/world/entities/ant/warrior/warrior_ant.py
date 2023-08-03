from ..base.ant import Ant
from ..base.ant_types import AntTypes
from core.world.utils.event_emiter import EventEmitter
from .warrior_ant_body import WarriorAntBody
from .warrior_ant_mind import WarrirorAntMind

class WarriorAnt(Ant):

    MAX_HP = 500

    def __init__(self, events: EventEmitter, id: int, from_colony: int, mind: WarrirorAntMind, body: WarriorAntBody):
        super().__init__(events, id, AntTypes.WARRIOR, from_colony, mind, body)