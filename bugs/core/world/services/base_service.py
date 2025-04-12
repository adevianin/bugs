from abc import ABC
from core.world.entities.world.world import World
from core.world.entities.ant.base.ant import Ant
from core.world.entities.base.entity_types import EntityTypes
from core.world.entities.nest.nest import Nest
from core.world.entities.colony.colonies.ant_colony.ant_colony import AntColony
from core.world.entities.colony.base.colony import Colony
from core.world.exceptions import EntityNotFoundError, AccessDeniedError, StateConflictError
from core.world.entities.ant.base.nuptial_environment.nuptial_environment import NuptialEnvironment
from core.world.utils.event_emiter import EventEmitter
from core.world.entities.action.base.action import Action
from core.world.entities.ant.queen.queen_ant import QueenAnt
from typing import Callable

class BaseService(ABC):

    def __init__(self, event_bus: EventEmitter):
        self._event_bus = event_bus

    def set_world(self, world: World):
        self._world = world

    def _find_ant_for_owner(self, ant_id: int, owner_id: int) -> Ant:
        if not self._world.map.has_entity(ant_id):
            self._raise_state_conflict_error()
        
        ant: Ant = self._world.map.get_entity_by_id(ant_id)

        if ant.type != EntityTypes.ANT:
            self._raise_state_conflict_error()
        
        if ant.owner_id != owner_id:
            raise AccessDeniedError(f'user(id={owner_id}) dont have ant(id={ant_id})')
        
        return ant
    
    def _find_nest_for_owner(self, nest_id: int, owner_id: int) -> Nest:
        if not self._world.map.has_entity(nest_id):
            self._raise_state_conflict_error()
        
        nest: Nest = self._world.map.get_entity_by_id(nest_id)
        if nest.type != EntityTypes.NEST: 
            self._raise_state_conflict_error()

        if nest.owner_id != owner_id:
            raise AccessDeniedError(f'user(id={owner_id}) doesn\'t have nest(id={nest.id})')
        
        return nest
    
    def _find_ant_colony_for_owner(self, colony_id: int, owner_id: int) -> AntColony:
        colony: AntColony = self._find_colony_by_id(colony_id)
        if not colony or colony.member_type != EntityTypes.ANT: 
            self._raise_state_conflict_error(f'ant colony(id={colony_id}) not found')

        if colony.owner_id != owner_id:
            raise AccessDeniedError(f'user(id={owner_id}) doesn\'t have colony(id={colony.id})')
        
        return colony
    
    def _find_nuptial_environment_for_owner(self, owner_id: int) -> NuptialEnvironment:
        for environment in self._world.nuptial_environments:
            if environment.owner_id == owner_id:
                return environment
            
        raise EntityNotFoundError(f'nuptial environment for user(id={owner_id}) not found')
    
    def _find_colony_by_id(self, colony_id: int) -> Colony:
        for colony in self._world.colonies:
            if colony.id == colony_id:
                return colony
        
        return None
    
    def _find_queen_of_colony(self, colony_id: int) -> QueenAnt:
        colony_queen_filter: Callable[[QueenAnt], bool] = lambda ant: ant.is_queen_of_colony
        queens = self._world.map.get_entities(from_colony_id=colony_id, entity_types=[EntityTypes.ANT], filter=colony_queen_filter)

        if len(queens) > 0:
            return queens[0]
        else:
            return None
        
    def _find_main_nest_of_colony(self, colony_id: int) -> Nest:
        colony_nest_filter: Callable[[Nest], bool] = lambda nest: nest.is_main
        nests = self._world.map.get_entities(from_colony_id=colony_id, entity_types=[EntityTypes.NEST], filter=colony_nest_filter)

        if len(nests) > 0:
            return nests[0]
        else:
            return None
    
    def _emit_action(self, action: Action):
        self._event_bus.emit('action', action)

    def _raise_state_conflict_error(self, msg: str = ''):
        raise StateConflictError(msg, self._world.current_step)
