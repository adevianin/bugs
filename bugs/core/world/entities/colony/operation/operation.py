from abc import ABC, abstractmethod
from core.world.entities.ant.base.ant_types import AntTypes
from core.world.entities.ant.base.ant import Ant
from core.world.utils.event_emiter import EventEmitter
from .operation_statuses import OperationStatuses
from core.world.utils.point import Point
from .marker_types import MarkerTypes
from .operation_types import OperationTypes
from typing import List

class Operation(ABC):

    def __init__(self, events: EventEmitter, id: int, type: OperationTypes, hired_ants: List[Ant], flags: dict):
        self.events = events
        self.id = id
        self._type = type
        self._vacancies = {}
        self._hired_ants = hired_ants or []
        self._is_done = False
        self._name = 'operation name'
        self._markers = []
        self._total_hiring_ants_count = 0
        self._flags = {}

        self._reset_flags()
        if flags:
            self._flags.update(flags)

        if self.status == OperationStatuses.INPROGRESS:
            self._init_staff_connection()

    @property
    def is_hiring(self):
        hired_count = len(self._hired_ants)
        return hired_count == 0 or hired_count < self._total_hiring_ants_count
    
    @property
    def is_done(self):
        return self._is_done
    
    @property
    def status(self):
        if self.is_hiring:
            return OperationStatuses.HIRING
        else:
            return OperationStatuses.INPROGRESS
        
    @property
    def name(self):
        return self._name
    
    @property
    def type(self):
        return self._type
    
    @property
    def markers(self):
        return self._markers
    
    @property
    def vacancies(self):
        return self._vacancies
    
    @property
    def flags(self):
        return self._flags
    
    def get_hired_ants(self, ant_type: AntTypes = None):
        if (ant_type):
            res = []
            for ant in self._hired_ants:
                if ant.ant_type == ant_type:
                    res.append(ant)
            return res
        else:
            return self._hired_ants
        
    def count_hired_ants(self, ant_type: AntTypes):
        count = 0
        for ant in self._hired_ants:
            if ant.ant_type == ant_type:
                count += 1

        return count
    
    def _open_vacancies(self, ant_type: AntTypes, count: int):
        self._vacancies[ant_type] = count
        self._total_hiring_ants_count += count

    def hire_ant(self, ant: Ant):
        if (not self.is_hiring):
            raise Exception('operation is not hiring')

        self._hired_ants.append(ant)

        if not self.is_hiring:
            self._init_staff_connection()
            self._start_operation()
        
        self.events.emit('change')

    def get_hiring_ant_types(self):
        hiring_ant_type = []
        for ant_type in self._vacancies.keys():
            needed_count = self._vacancies[ant_type]
            hired_count = self.count_hired_ants(ant_type)
            if (needed_count > hired_count):
                hiring_ant_type.append(ant_type)
        return hiring_ant_type
    
    def stop_operation(self):
        ants = self.get_hired_ants()
        for ant in ants:
            ant.leave_operation()

        self._mark_as_done()

    @abstractmethod
    def _init_staff_connection(self):
        pass

    @abstractmethod
    def _start_operation(self):
        pass

    def _mark_as_done(self):
        self._is_done = True
        self.events.emit('change')

    def _add_pointer_marker(self, point: Point):
        self._markers.append({
            'type': MarkerTypes.POINTER,
            'point': point
        })

    def _reset_flags(self):
        self._flags = {
            'is_first_step_started': False
        }

    def to_public_json(self):
        return {
            'id': self.id,
            'name': self.name,
            'status': self.status,
            'markers': self._markers
        }
    