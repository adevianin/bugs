from abc import ABC, abstractmethod
from core.world.entities.ant.base.ant_types import AntTypes
from core.world.entities.ant.base.ant import Ant
from core.world.utils.event_emiter import EventEmitter
from .operation_statuses import OperationStatuses
from core.world.utils.point import Point
from .marker_types import MarkerTypes

class Operation(ABC):

    def __init__(self, events: EventEmitter):
        self.events = events
        self.id = 0
        self._vacancies = {}
        self._hired = {}
        self._is_hiring = True
        self._is_done = False
        self._name = 'operation name'
        self._markers = []

    @property
    def is_hiring(self):
        return self._is_hiring
    
    @property
    def is_done(self):
        return self._is_done
    
    @property
    def _status(self):
        if self._is_hiring:
            return OperationStatuses.HIRING
        else:
            return OperationStatuses.INPROGRESS
        
    @property
    def name(self):
        return self._name

    def _open_vacancies(self, ant_type: AntTypes, count: int):
        self._vacancies[ant_type] = count
        self._hired[ant_type] = []

    def _get_hired_ants(self, ant_type: AntTypes = None):
        if (ant_type):
            return self._hired[ant_type]
        else:
            hired_ants = []
            for ant_type in self._hired.keys():
                hired_ants.extend(self._hired[ant_type])
            return hired_ants

    def hire_ant(self, ant: Ant):
        if (not self._is_hiring):
            raise Exception('operation is not hiring')
        self._hired[ant.ant_type].append(ant)

        self._is_hiring = len(self.get_hiring_ant_types()) > 0

        if not self._is_hiring:
            self._start_operation()
        
        self.events.emit('change')

    def get_hiring_ant_types(self):
        hiring_ant_type = []
        for ant_type in self._vacancies.keys():
            needed_count = self._vacancies[ant_type]
            hired_count = len(self._hired[ant_type])
            if (needed_count > hired_count):
                hiring_ant_type.append(ant_type)
        return hiring_ant_type
    
    def stop_operation(self):
        self._is_hiring = False
        
        ants = self._get_hired_ants()
        for ant in ants:
            ant.leave_operation()

        self._mark_as_done()
    
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

    def to_json(self):
        return {
            'id': self.id,
            'name': self.name,
            'status': self._status,
            'markers': self._markers
        }
