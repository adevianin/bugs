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
from core.world.entities.base.ownership_config import OwnershipConfig
from core.world.entities.base.death_record.nuptiali_fly_death_record import NuptialFlyDeathRecord

class MaleAnt(Ant):

    _mind: MaleAntMind
    _body: MaleAntBody
    body: MaleAntBody

    def __init__(self, event_bus: EventEmitter, events: EventEmitter, id: int, name: str, ownership: OwnershipConfig, body: AntBody, mind: AntMind):
        super().__init__(event_bus, events, id, name, ownership, body, AntTypes.MALE, mind)

        self._body.events.add_listener('flew_nuptial_flight', self._on_flew_nuptial_flight)

    @property
    def can_fly_nuptial_flight(self):
        return True
    
    def fly_nuptial_flight(self):
        super().fly_nuptial_flight()
        if self._body.check_am_i_freezing():
            self.cold_die()
            return False
        self._body.die(NuptialFlyDeathRecord(self.position))
        return True

    def _on_flew_nuptial_flight(self):
        self._emit_action(AntFlewNuptialFlightAction.build(self.id))