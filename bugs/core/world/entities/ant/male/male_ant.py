from core.world.entities.ant.base.ant_body import AntBody
from core.world.entities.ant.base.ant_mind import AntMind
from core.world.entities.ant.base.ant_types import AntTypes
from core.world.utils.event_emiter import EventEmitter
from ..base.ant import Ant
from ..base.ant_types import AntTypes
from core.world.utils.event_emiter import EventEmitter
from .male_ant_body import MaleAntBody
from .male_ant_mind import MaleAntMind
from core.world.entities.action.ant_flew_nuptial_flight_action import AntFlewNuptialFlightAction

class MaleAnt(Ant):

    _mind: MaleAntMind
    _body: MaleAntBody
    body: MaleAntBody

    def __init__(self, event_bus: EventEmitter, events: EventEmitter, id: int, name: str, from_colony_id: int, owner_id: int, body: AntBody, mind: AntMind):
        super().__init__(event_bus, events, id, name, from_colony_id, owner_id, body, AntTypes.MALE, mind)

        self._body.events.add_listener('flew_nuptial_flight', self._on_flew_nuptial_flight)
    
    def fly_nuptial_flight(self):
        self.from_colony_id = None
        self._mind.free_mind()
        self._mind.toggle_auto_thought_generation(False)
        self._body.fly_nuptial_flight()
        self.die()

    def _on_flew_nuptial_flight(self):
        self._emit_action(AntFlewNuptialFlightAction.build(self.id))