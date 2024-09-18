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
from core.world.entities.colony.colonies.ant_colony.operation.base.fight.fight_factory import FightFactory
from core.world.entities.colony.colonies.ant_colony.operation.base.fight.fight import Fight

class Operation(ABC):

    def __init__(self, event_bus: EventEmitter, events: EventEmitter, formation_factory: FormationFactory, fight_factory: FightFactory, id: int, type: OperationTypes, hired_ants: List[Ant], 
                 flags: dict, formation: BaseFormation, fight: Fight):
        self._event_bus = event_bus
        self.events = events
        self._formation_factory = formation_factory
        self._fight_factory = fight_factory
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
        self._formation = formation
        self._fight = fight
        self._ants_listeners = {}

        if self._fight:
            self._listen_fight(self._fight)

        if self._formation:
            self._listen_formation(self._formation)

        if (self._read_flag('is_operation_started')):
            self._subscribe_events()

    @property
    def formation(self) -> BaseFormation:
        return self._formation
    
    @property
    def fight(self) -> Fight:
        return self._fight
    
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
    
    @property
    def _stage(self):
        return self._flags['stage'] or 'start'
    
    @_stage.setter
    def _stage(self, name: str):
        self._flags['stage'] = name

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

        self._on_operation_stop()

        self.events.emit('change')
    
    def cancel(self):
        self._is_canceled = True

        self._on_operation_stop()
        
        self.events.emit('change')

    def _on_step_start(self, step_number):
        if self._fight:
            self._fight.step_pulse()
        elif self._formation:
            self._formation.step_pulse()

        if not self._fight and self._is_aggressive_now():
            if self._are_enemies_around():
                self._init_fight(self._hired_ants)

    def _is_aggressive_now(self):
        return False
    
    def _are_enemies_around(self):
        for ant in self._hired_ants:
            enemies = ant.look_around_for_enemies()
            if len(enemies):
                return True

        return False
    
    def _subscribe_events(self):
        self._event_bus.add_listener('step_start', self._on_step_start)
        self._init_staff()

    def _init_staff(self):
        ants = self.get_hired_ants()
        for ant in ants:
            self._listen_ant(ant)

    def _listen_ant(self, ant: Ant):
        self._ants_listeners[ant] = {}

        died_listener = partial(self._on_hired_ant_died, ant)
        self._ants_listeners[ant]['died'] = died_listener
        ant.events.add_listener('died', died_listener)

        received_combat_damage_listener = partial(self._on_hired_ant_received_combat_damage, ant)
        self._ants_listeners[ant]['received_combat_damage'] = received_combat_damage_listener
        ant.events.add_listener('received_combat_damage', received_combat_damage_listener)

    def _stop_listen_ant(self, ant: Ant):
        ant_listeners = self._ants_listeners[ant]
        ant.events.remove_listener('died', ant_listeners['died'])
        ant.events.remove_listener('received_combat_damage', ant_listeners['received_combat_damage'])
        del self._ants_listeners[ant]

    def _register_formation(self, formation: BaseFormation):
        if self._formation:
            raise Exception('formation already registered')
        self._formation = formation
        self._listen_formation(formation)

    def _listen_formation(self, formation: BaseFormation):
        def on_formation_event(event_name: str):
            def handler(*args, **kwargs):
                self.events.emit(f'formation:{formation.name}:{event_name}')
            return handler
        
        formation.events.add_listener('destroyed', self._on_formation_destroyed)
        formation.events.add_listener('destroyed', on_formation_event('destroyed'))
        formation.events.add_listener('done', on_formation_event('done'))

    def _on_formation_destroyed(self):
        self._formation = None

    def _init_fight(self, ants: List[Ant]):
        if self._fight:
            raise Exception('fight already inited')
        if self._formation:
            self._formation.destroy()
        self.events.emit(f'fight_start:{self._stage}')
        self._fight = self._fight_factory.build_fight(ants)
        self._listen_fight(self._fight)

    def _destroy_fight(self):
        self._fight.destroy()
        self._fight = None

    def _listen_fight(self, fight: Fight):
        fight.events.add_listener('won', self._on_fight_won)
        fight.events.add_listener('defeated', self._on_fight_defeated)

    def _stop_listen_fight(self, fight: Fight):
        fight.events.remove_listener('won', self._on_fight_won)
        fight.events.remove_listener('defeated', self._on_fight_defeated)

    def _on_fight_won(self):
        self._destroy_fight()
        self.events.emit(f'fight_won:{self._stage}')

    def _on_fight_defeated(self):
        self._destroy_fight()
        self.events.emit(f'fight_defeated:{self._stage}')

    def _check_hiring_ant(self, ant: Ant):
        if ant.mind.is_in_opearetion:
            return False
        
        if not ant.is_cooperative:
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
        self._subscribe_events()
        self._start_operation()

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
        if self._fight:
            self._fight.remove_ant(ant)
        # if self._formation:
        #     self._formation.remove_ant(ant)
        ant.leave_operation()
        self._hired_ants.remove(ant)
        self._stop_listen_ant(ant)
        if len(self._hired_ants) == 0:
            self.cancel()

    def _on_hired_ant_received_combat_damage(self, ant: Ant):
        if not self._fight:
            self._init_fight(self._hired_ants)

    def _on_operation_stop(self):
        self._event_bus.remove_listener('step_start', self._on_step_start)

        if self._formation:
            self._formation.destroy()

        if self._fight:
            self._destroy_fight()

        for ant in self._hired_ants:
            self._stop_listen_ant(ant)
            ant.leave_operation()
    