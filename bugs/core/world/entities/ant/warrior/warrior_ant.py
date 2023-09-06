from core.world.entities.ant.base.ant_body import AntBody
from core.world.entities.ant.base.ant_mind import AntMind
from core.world.entities.ant.base.ant_types import AntTypes
from core.world.utils.event_emiter import EventEmitter
from ..base.ant import Ant
from ..base.ant_types import AntTypes
from core.world.utils.event_emiter import EventEmitter
from .warrior_ant_body import WarriorAntBody
from .warrior_ant_mind import WarrirorAntMind

class WarriorAnt(Ant):

    def __init__(self, events: EventEmitter, id: int, from_colony_id: int, body: AntBody, mind: AntMind):
        super().__init__(events, id, from_colony_id, body, AntTypes.WARRIOR, mind)