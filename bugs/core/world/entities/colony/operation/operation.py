from abc import ABC, abstractmethod
from core.world.entities.ant.base.ant_types import AntTypes
from core.world.entities.ant.base.ant import Ant
from core.world.utils.event_emiter import EventEmitter
from .operation_statuses import OperationStatuses
from core.world.utils.point import Point
from .marker_types import MarkerTypes
from .operation_types import OperationTypes
from typing import List
from functools import partial

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
        self._flags = flags or {}

        if (self._read_flag('is_operation_started')):
            self._init_staff()

    @property
    def is_hiring(self):
        is_all_vacancies_taken = len(self._hired_ants) >= self._total_hiring_ants_count
        is_hiring_stopped = is_all_vacancies_taken or self._read_flag('is_operation_started')
        return not is_hiring_stopped
    
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
        
    def hire_ant(self, ant: Ant):
        if (not self.is_hiring):
            raise Exception('operation is not hiring')

        self._hired_ants.append(ant)

        if not self.is_hiring:
            self._on_hired_all()
        
        self.events.emit('change')

    def get_hiring_ant_types(self):
        hiring_ant_type = []
        for ant_type in self._vacancies.keys():
            needed_count = self._vacancies[ant_type]
            hired_count = self._count_hired_ants(ant_type)
            if (needed_count > hired_count):
                hiring_ant_type.append(ant_type)
        return hiring_ant_type
    
    def stop_operation(self):
        ants = self.get_hired_ants()
        for ant in ants:
            ant.leave_operation()

        self._mark_as_done()

    def _on_hired_all(self):
        self._init_staff()
        self._start_operation()

    def _init_staff(self):
        ants = self.get_hired_ants()
        for ant in ants:
            ant.events.add_listener('died', partial(self._on_hired_ant_died, ant))

    def _read_flag(self, flag_name: str):
        if flag_name in self._flags:
            return self._flags[flag_name]
        else: 
            return False
        
    def _write_flag(self, flag_name: str, value: bool):
        self._flags[flag_name] = value

    def _count_hired_ants(self, ant_type: AntTypes):
        count = 0
        for ant in self._hired_ants:
            if ant.ant_type == ant_type:
                count += 1

        return count
    
    def _open_vacancies(self, ant_type: AntTypes, count: int):
        self._vacancies[ant_type] = count
        self._total_hiring_ants_count += count

    def _start_operation(self):
        self._write_flag('is_operation_started', True)

    def _mark_as_done(self):
        self._is_done = True
        self.events.emit('change')

    def _add_pointer_marker(self, point: Point):
        self._markers.append({
            'type': MarkerTypes.POINTER,
            'point': point
        })

    def _add_marker(self, type: MarkerTypes, point: Point):
        self._markers.append({
            'type': type,
            'point': point
        })

    def to_public_json(self):
        return {
            'id': self.id,
            'name': self.name,
            'status': self.status,
            'markers': self._markers
        }
    
    def _on_hired_ant_died(self, ant: Ant):
        ant.leave_operation()
        self._hired_ants.remove(ant)
        if len(self._hired_ants) == 0:
            self.stop_operation()
    