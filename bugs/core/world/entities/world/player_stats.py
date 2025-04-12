from core.world.utils.event_emiter import EventEmitter
from core.world.entities.base.entity import Entity
from core.world.entities.base.entity_types import EntityTypes
from core.world.entities.colony.base.colony import Colony
from core.world.entities.colony.colonies.ant_colony.ant_colony import AntColony

class PlayerStats():

    def __init__(self, event_bus: EventEmitter, owner_id: int, ants_count: int, colonies_count: int):
        self._event_bus = event_bus
        self._owner_id = owner_id
        self._ants_count = ants_count
        self._colonies_count = colonies_count

        self._event_bus.add_listener('ant_died', self._on_ant_died)
        self._event_bus.add_listener('ant_born', self._on_ant_born)
        self._event_bus.add_listener('colony_died', self._on_colony_died)
        self._event_bus.add_listener('colony_born', self._on_colony_born)

    @property
    def owner_id(self):
        return self._owner_id

    @property
    def ants_count(self):
        return self._ants_count

    @property
    def colonies_count(self):
        return self._colonies_count
    
    def _on_ant_born(self, entity: Entity):
        if entity.owner_id == self.owner_id:
            self._ants_count += 1
    
    def _on_ant_died(self, entity: Entity):
        if entity.owner_id == self.owner_id:
            self._ants_count -= 1

    def _on_colony_died(self, colony: Colony):
        if colony.member_type == EntityTypes.ANT:
            colony: AntColony = colony
            if colony.owner_id == self.owner_id:
                self._colonies_count -= 1

    def _on_colony_born(self, colony: Colony):
        if colony.member_type == EntityTypes.ANT:
            colony: AntColony = colony
            if colony.owner_id == self.owner_id:
                self._colonies_count += 1
    
