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
from core.world.entities.colony.colonies.ant_colony.formation.base.base_formation import BaseFormation
from core.world.entities.ant.base.genetic.genes.base.genes_types import GenesTypes
from core.world.entities.colony.colonies.ant_colony.formation.formation_factory import FormationFactory

class Operation(ABC):

    def __init__(self, events: EventEmitter, formation_factory: FormationFactory, id: int, type: OperationTypes, hired_ants: List[Ant], flags: dict, formations: List[BaseFormation]):
        self.events = events
        self._formation_factory = formation_factory
        self.id = id
        self._type = type
        self._vacancies = {}
        self._hired_ants = hired_ants or []
        self._is_done = False
        self._is_canceled = False
        self._name = 'operation name'
        self._markers = []
        self._total_hiring_ants_count = 0
        self._flags = flags or {}
        self._formations = formations

        self._listen_formations()

        if (self._read_flag('is_operation_started')):
            self._init_staff()

    @property
    def formations(self) -> List[BaseFormation]:
        return self._formations
    
    @property
    def is_hiring(self):
        is_all_vacancies_taken = len(self._hired_ants) >= self._total_hiring_ants_count
        is_hiring_stopped = is_all_vacancies_taken or self._read_flag('is_operation_started')
        return not is_hiring_stopped
    
    @property
    def is_done(self):
        return self._is_done
    
    @property
    def is_canceled(self):
        return self._is_canceled
    
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
        
    def try_hire_ant(self, ant: Ant):
        if (not self.is_hiring):
            raise Exception('operation is not hiring')
        
        is_ant_good = self._check_hiring_ant(ant)

        if is_ant_good:
            ant.join_operation()
            self._hire_ant(ant)
    
    def done(self):
        self._is_done = True

        ants = self.get_hired_ants()
        for ant in ants:
            ant.leave_operation()

        self._on_operation_stop()

        self.events.emit('change')
    
    def cancel(self):
        self._is_canceled = True

        ants = self.get_hired_ants()
        for ant in ants:
            ant.leave_operation()

        self._on_operation_stop()
        
        self.events.emit('change')

    def _register_formation(self, formation: BaseFormation):
        self._formations.append(formation)
        self._listen_formation(formation)

    def _listen_formations(self):
        for formation in self._formations:
            self._listen_formation(formation)

    def _listen_formation(self, formation: BaseFormation):
        def on_formation_reached_destination():
            self.events.emit(f'formation:{formation.name}:reached_destination')

        def on_formation_destroyed():
            self._formations.remove(formation)
            self.events.emit(f'formation:{formation.name}:destroyed')

        formation.events.add_listener('reached_destination', on_formation_reached_destination)
        formation.events.add_listener('destroyed', on_formation_destroyed)

    def _check_hiring_ant(self, ant: Ant):
        if ant.mind.is_in_opearetion:
            return False
        
        if not ant.body.is_cooperative_behavior:
            return False
        
        if ant.ant_type not in self._vacancies:
            return False

        vacancie = self._vacancies[ant.ant_type]

        if self._count_hired_ants(ant.ant_type) >= vacancie['count']:
            return False
        
        if vacancie['required_genes'] is not None:
            for gene_type in vacancie['required_genes']:
                if not ant.body.genome.check_gene_presence(gene_type):
                    return False
                
        return True

    def _hire_ant(self, ant: Ant):
        self._hired_ants.append(ant)

        if not self.is_hiring:
            self._on_hired_all()
        
        self.events.emit('change')

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
    
    def _open_vacancies(self, ant_type: AntTypes, count: int, required_genes: List[GenesTypes] = None):
        self._vacancies[ant_type] = { 'count': count, 'required_genes': required_genes }
        self._total_hiring_ants_count += count

    def _start_operation(self):
        self._write_flag('is_operation_started', True)

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

    def _on_hired_ant_died(self, ant: Ant):
        ant.leave_operation()
        self._hired_ants.remove(ant)
        if len(self._hired_ants) == 0:
            self.cancel()

    def _on_operation_stop(self):
        for formation in self._formations:
            formation.destroy()
    