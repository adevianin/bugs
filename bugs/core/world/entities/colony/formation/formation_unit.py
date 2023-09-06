from abc import ABC, abstractmethod
from .formation import Formation
from core.world.utils.point import Point

class FormationUnit(ABC):

    @property
    def has_formation(self):
        return self._formation != None
    
    @property
    def formation(self):
        return self._formation

    @property
    @abstractmethod
    def position(self) -> Point:
        pass

    def set_formation(self, formation: Formation):
        self._formation = formation
        unit_number = self._formation.register_unit(self.position)
        self._formation_unit_number = unit_number
        self._formation.events.add_listener('reached_destination', self.remove_formation)

    def remove_formation(self):
        if self.has_formation:
            self._formation.events.remove_listener('reached_destination', self.remove_formation)
            self.formation.remove_unit(self._formation_unit_number)
            self._formation_unit_number = None
            self._formation = None

    def step_in_formation(self):
        position = self._formation.get_position_for_unit(self._formation_unit_number)
        return self._move_to_formation_unit_position(position)
    
    @abstractmethod
    def _move_to_formation_unit_position(self, position: Point):
        pass