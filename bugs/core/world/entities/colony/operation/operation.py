from abc import ABC, abstractmethod
from core.world.entities.ant.base.ant_types import AntTypes
from core.world.entities.ant.base.ant import Ant

class Operation(ABC):

    def __init__(self):
        self._vacancies = {}
        self._hired = {}
        self._is_hiring = True

    @property
    def is_hiring(self):
        return self._is_hiring

    def _open_vacancies(self, ant_type: AntTypes, count: int):
        self._vacancies[ant_type] = count
        self._hired[ant_type] = []

    def _get_hired_ants(self, ant_type: AntTypes):
        return self._hired[ant_type]

    def hire_ant(self, ant: Ant):
        self._hired[ant.ant_type].append(ant)

        self._is_hiring = len(self.get_hiring_ant_types()) > 0

        if not self._is_hiring:
            self.start_operation()

    def get_hiring_ant_types(self):
        hiring_ant_type = []
        for ant_type in self._vacancies.keys():
            needed_count = self._vacancies[ant_type]
            hired_count = len(self._hired[ant_type])
            if (needed_count > hired_count):
                hiring_ant_type.append(ant_type)
        return hiring_ant_type
    
    @abstractmethod
    def start_operation(self):
        pass
