from core.world.entities.world.world import World
from core.world.entities.ant.base.ant import Ant
from core.world.entities.base.entity_types import EntityTypes
from core.world.entities.nest.nest import Nest
from core.world.entities.colony.colonies.ant_colony.ant_colony import AntColony
from core.world.entities.colony.base.colony import Colony
from core.world.exceptions import EntityNotFoundError, AccessDeniedError
from core.world.entities.ant.base.nuptial_environment.nuptial_environment import NuptialEnvironment

class BaseService():

    def set_world(self, world: World):
        self._world = world

    def _find_ant_for_owner(self, ant_id: int, owner_id: int) -> Ant: 
        ant: Ant = self._world.map.get_entity_by_id(ant_id)

        if not ant or ant.type != EntityTypes.ANT:
            raise EntityNotFoundError(f'ant(id={ant_id}) not found')
        
        if ant.owner_id != owner_id:
            raise AccessDeniedError(f'user(id={owner_id}) dont have ant(id={ant_id})')
        
        return ant
    
    def _find_nest_for_owner(self, nest_id: int, owner_id: int) -> Nest:
        nest: Nest = self._world.map.get_entity_by_id(nest_id)
        if not nest or nest.type != EntityTypes.NEST: 
            raise EntityNotFoundError(f'nest(id={nest_id}) not found')

        if nest.owner_id != owner_id:
            raise AccessDeniedError(f'user(id={owner_id}) doesn\'t have nest(id={nest.id})')
        
        return nest
    
    def _find_ant_colony_for_owner(self, colony_id: int, owner_id: int) -> AntColony:
        colony: AntColony = self._find_colony_by_id(colony_id)
        if not colony or colony.member_type != EntityTypes.ANT: 
            raise EntityNotFoundError(f'colony(id={colony_id}) not found')

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