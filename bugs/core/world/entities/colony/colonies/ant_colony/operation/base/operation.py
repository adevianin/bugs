from abc import ABC, abstractmethod
from core.world.entities.ant.base.ant_types import AntTypes
from core.world.entities.ant.base.ant import Ant
from core.world.utils.event_emiter import EventEmitter
from .operation_statuses import OperationStatuses
from core.world.utils.point import Point
from .marker_types import MarkerTypes
from .operation_types import OperationTypes
from typing import List, Callable
from functools import partial
from collections import Counter
from core.world.entities.colony.colonies.ant_colony.operation.base.formation.base.base_formation import BaseFormation
from core.world.entities.ant.base.genetic.genes.base.genes_types import GenesTypes
from core.world.entities.colony.colonies.ant_colony.operation.base.formation.formation_factory import FormationFactory
from core.world.entities.colony.colonies.ant_colony.operation.base.fight.fight_factory import FightFactory
from core.world.entities.colony.colonies.ant_colony.operation.base.fight.fight import Fight
from core.world.entities.base.live_entity.live_entity import LiveEntity
from core.world.entities.base.damage_types import DamageTypes
from core.world.entities.ant.worker.worker_ant import WorkerAnt
from core.world.entities.ant.warrior.warrior_ant import WarriorAnt

class Operation(ABC):

    class Flags():
        STAGE = 'stage'
        IS_OPERATION_STARTED = 'is_operation_started'
        MUST_RESPOND_TO_AGGRESSION = 'must_respond_to_aggression'
        IS_AGGRESSIVE = 'is_aggressive'
        ANT_FLAG_PREPARED = 'prepared'

    def __init__(self, event_bus: EventEmitter, events: EventEmitter, formation_factory: FormationFactory, fight_factory: FightFactory, id: int, type: OperationTypes, hired_ants: List[Ant], 
                 flags: dict, formation: BaseFormation, fight: Fight, worker_vacancies_count: int = 0, warrior_vacancies_count: int = 0):
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
        self._aggression_targets_filter: Callable[[LiveEntity], bool] = None
        self._worker_vacancies_count = worker_vacancies_count
        self._warrior_vacancies_count = warrior_vacancies_count

        for ant in self._hired_ants:
            self._listen_ant(ant)
        
        if (self._read_flag(self.Flags.IS_OPERATION_STARTED)):
            self._setup_operation()

    @property
    def formation(self) -> BaseFormation:
        return self._formation
    
    @property
    def fight(self) -> Fight:
        return self._fight
    
    @property
    def worker_vacancies_count(self):
        return self._worker_vacancies_count
    
    @property
    def warrior_vacancies_count(self):
        return self._warrior_vacancies_count
    
    @property
    def is_hiring(self):
        is_all_vacancies_taken = len(self._hired_ants) >= self._total_hiring_ants_count
        is_hiring_stopped = is_all_vacancies_taken or self._read_flag(self.Flags.IS_OPERATION_STARTED)
        return not is_hiring_stopped
    
    @property
    def is_done(self):
        return self._is_done
    
    @property
    def is_canceled(self):
        return self._is_canceled
    
    @property
    def is_completed(self):
        return self._is_done or self._is_canceled
    
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
    def _workers(self) -> List[WorkerAnt]:
        return self.get_hired_ants(AntTypes.WORKER)
    
    @property
    def _warriors(self) -> List[WarriorAnt]:
        return self.get_hired_ants(AntTypes.WARRIOR)
    
    @property
    def _all_ants_for_march(self):
        return self._warriors + self._workers
    
    @property
    def _stage(self):
        return self._flags[self.Flags.STAGE]
    
    @_stage.setter
    def _stage(self, name: str):
        print('stage', name)
        self._flags[self.Flags.STAGE] = name

    def _is_aggressive_now(self):
        return self._read_flag(self.Flags.IS_AGGRESSIVE)

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
            self._hire_ant(ant)
    
    def done(self):
        if self.is_completed:
            return
        self._is_done = True
        self.events.emit('change')
        self._on_operation_stop()
    
    def cancel(self):
        if self.is_completed:
            return
        self._is_canceled = True
        self.events.emit('change')
        self._on_operation_stop()

    def _start_operation(self):
        self._write_flag(self.Flags.IS_OPERATION_STARTED, True)
        self._stage = 'start'
        self._setup_operation()
        for ant in self._hired_ants:
            ant.toggle_auto_thought_generation(False)
            ant.free_mind()

    def _setup_operation(self):
        self._init_assemble_point()
        
        if self._fight:
            self._listen_fight(self._fight)

        if self._formation:
            self._listen_formation(self._formation)

        self._event_bus.add_listener('step_start', self._on_step_start) # on step start to have ability do something before walking

        self.events.add_listener('formation:march_to_assemble_point_to_done_operation:done', self.done)

        self.events.add_listener('fight_won:preparing_step', self._prepare_step)
        self.events.add_listener('fight_won:march_to_assemble_point_step', self._march_to_assemble_point_to_done_operation_step)

        for ant in self._hired_ants:
            ant.body.sayer.add_listener('prepared', partial(self._on_ant_prepared, ant))

    def _init_assemble_point(self):
        nests = [ant.home_nest for ant in self._hired_ants]
        nests_counts = Counter(nests)
        most_common_nest = nests_counts.most_common(1)[0][0]
        self._assemble_point = Point(most_common_nest.position.x, most_common_nest.position.y + 40) 

    def _on_step_start(self, step_number, season):
        if not self._fight:
            if self._read_flag(self.Flags.MUST_RESPOND_TO_AGGRESSION):
                self._write_flag(self.Flags.MUST_RESPOND_TO_AGGRESSION, False)
                self._init_fight(self._hired_ants)
            elif self._is_aggressive_now() and self._check_for_aggression_targets():
                self._init_fight(self._hired_ants)

        if self._fight:
            self._fight.step_pulse()
        elif self._formation:
            self._formation.step_pulse()

    def _check_for_aggression_targets(self):
        for ant in self._hired_ants:
            enemies = ant.look_around_for_enemies()
            if self._aggression_targets_filter:
                enemies = list(filter(self._aggression_targets_filter, enemies))
            if len(enemies):
                return True

        return False
    
    def _listen_ant(self, ant: Ant):
        self._ants_listeners[ant] = {}

        died_listener = partial(self._on_hired_ant_died, ant)
        self._ants_listeners[ant]['died'] = died_listener
        ant.events.add_listener('died', died_listener)

        received_combat_damage_listener = partial(self._on_hired_ant_received_damage, ant)
        self._ants_listeners[ant]['received_damage'] = received_combat_damage_listener
        ant.events.add_listener('received_damage', received_combat_damage_listener)

    def _stop_listen_ant(self, ant: Ant):
        ant_listeners = self._ants_listeners[ant]
        ant.events.remove_listener('died', ant_listeners['died'])
        ant.events.remove_listener('received_damage', ant_listeners['received_damage'])
        del self._ants_listeners[ant]

    def _register_formation(self, formation: BaseFormation):
        if self._fight:
            raise Exception('cant register formation during fight')
        if self._formation:
            raise Exception('formation already registered')
        self._formation = formation
        self._formation.start()
        self._listen_formation(formation)

    def _destroy_formation(self):
        if self._formation:
            self._formation.destroy()
            self._formation = None

    def _listen_formation(self, formation: BaseFormation):
        formation.events.add_listener('done', partial(self._on_formation_done, formation))
        formation.events.add_listener('no_units', partial(self._on_formation_no_units, formation))

    def _on_formation_done(self, formation: BaseFormation):
        self._destroy_formation()
        self.events.emit(f'formation:{formation.name}:done')

    def _on_formation_no_units(self, formation: BaseFormation):
        self._destroy_formation()
        self.events.emit(f'formation:{formation.name}:no_units')

    def _init_fight(self, ants: List[Ant]):
        print('init fight on stage =', self._stage)
        if self._fight:
            raise Exception('fight already inited')
        if self._formation:
            self._destroy_formation()
        self._fight = self._fight_factory.build_fight(ants)
        self._fight.start()
        self._listen_fight(self._fight)
        self.events.emit(f'fight_start')
        self.events.emit(f'fight_start:{self._stage}')

    def _destroy_fight(self):
        if self._fight:
            self._fight.destroy()
            self._fight = None

    def _listen_fight(self, fight: Fight):
        fight.events.add_listener('won', self._on_fight_won)
        fight.events.add_listener('defeated', self._on_fight_defeated)

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
        ant.join_operation()
        self._listen_ant(ant)

        if not self.is_hiring:
            self._on_hired_all()

        self.events.emit('change')

    def _on_hired_all(self):
        self._start_operation()

    def _read_flag(self, flag_name: str) -> bool:
        if flag_name in self._flags:
            return self._flags[flag_name]
        else: 
            return False
        
    def _write_flag(self, flag_name: str, value: bool):
        self._flags[flag_name] = bool(value)

    def _write_ant_flag(self, ant: Ant, flag_name: str, value: bool):
        self._write_flag(self._build_ant_flag(ant, flag_name), value)

    def _read_ant_flag(self, ant: Ant, flag_name: str) -> bool:
        return self._read_flag(self._build_ant_flag(ant, flag_name))
    
    def _check_ant_flag_for_ants(self, ants: List[Ant], flag_name: str) -> bool:
        for ant in ants:
            if not self._read_ant_flag(ant, flag_name):
                return False
        return True
        
    def _count_hired_ants(self, ant_type: AntTypes):
        count = 0
        for ant in self._hired_ants:
            if ant.ant_type == ant_type:
                count += 1

        return count
    
    def _open_vacancies(self, ant_type: AntTypes, count: int, required_genes: List[GenesTypes] = None):
        self._vacancies[ant_type] = { 'count': count, 'required_genes': required_genes }
        self._total_hiring_ants_count += count

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
        if self._formation:
            self._formation.remove_ant(ant)
        ant.leave_operation()
        self._hired_ants.remove(ant)
        self._stop_listen_ant(ant)
        if len(self._hired_ants) == 0:
            self.cancel()
        self.events.emit('hired_ant_died', ant)

    def _on_hired_ant_received_damage(self, ant: Ant, damage_type: DamageTypes):
        if not self._read_flag(self.Flags.IS_OPERATION_STARTED):
            return
        
        if not self._fight and damage_type == DamageTypes.COMBAT:
            self._write_flag(self.Flags.MUST_RESPOND_TO_AGGRESSION, True)

    def _on_operation_stop(self):
        if (self._read_flag(self.Flags.IS_OPERATION_STARTED)):
            self._event_bus.remove_listener('step_start', self._on_step_start)

        if self._formation:
            self._destroy_formation()

        if self._fight:
            self._destroy_fight()

        for ant in self._hired_ants:
            self._stop_listen_ant(ant)
            ant.leave_operation()

        self.events.remove_all_listeners()

    # <PREDEFINED_STEPS>
    def _prepare_step(self):
        self._stage = 'preparing_step'

        for ant in self._hired_ants:
            self._write_ant_flag(ant, self.Flags.ANT_FLAG_PREPARED, False)
            ant.prepare_for_operation(self._assemble_point, 'prepared')

    def _on_ant_prepared(self, ant: Ant):
        self._write_ant_flag(ant, self.Flags.ANT_FLAG_PREPARED, True)
        if self._check_ant_flag_for_ants(self._hired_ants, self.Flags.ANT_FLAG_PREPARED):
            self._on_all_ants_prepared()

    @abstractmethod
    def _on_all_ants_prepared(self):
        pass

    def _march_to_assemble_point_to_done_operation_step(self):
        self._stage = 'march_to_assemble_point_step'
        units = self._all_ants_for_march
        if BaseFormation.check_is_formation_needed(units, self._assemble_point):
            formation = self._formation_factory.build_convoy_formation('march_to_assemble_point_to_done_operation', units, self._assemble_point)
            self._register_formation(formation)
        else:
            self.done()
    # </PREDEFINED_STEPS>

    def _check_is_formation_needed(self, units: List[Ant], destination_point: Point) -> bool:
        return BaseFormation.check_is_formation_needed(units, destination_point)
    
    def _build_ant_flag(self, ant: Ant, flag_name: str):
        return f'ant_flag_{ant.id}_{flag_name}'
    
    def _workers_drop_picked_food(self):
        for ant in self._workers:
            if ant.has_picked_item():
                ant.drop_picked_item()
