from core.world.entities.ant.base.ant_types import AntTypes
from core.world.entities.ant.male.male_ant import MaleAnt
from core.world.entities.ant.base.ant import Ant
from core.world.entities.ant.queen.queen_ant import QueenAnt
from core.world.entities.world.world import World
from core.world.entities.nest.nest import Nest
from core.world.entities.base.entity_types import EntityTypes
from core.world.entities.ant.base.guardian_behaviors import GuardianBehaviors

class AntService():

    def set_world(self, world: World):
        self._world = world

    def fly_nuptial_flight(self, user_id: int, ant_id: int):
        ant: Ant = self._world.map.get_entity_by_id(ant_id)
        
        if not ant or ant.owner_id != user_id:
            raise Exception('user dont have this ant')
        
        if not ant.can_fly_nuptial_flight:
            raise Exception('ant cant fly nuptial flight')
        
        if ant.ant_type == AntTypes.QUEEN:
            queen: QueenAnt = ant
            queen.fly_nuptial_flight()
        elif ant.ant_type == AntTypes.MALE:
            male: MaleAnt = ant
            is_success = male.fly_nuptial_flight()
            if is_success:
                nuptial_environment = self._world.get_nuptial_environment_by_owner(user_id)
                nuptial_environment.fly_in_male(male)
            
    def change_ant_guardian_behavior(self, user_id: int, ant_id: int, guaridan_behavior: GuardianBehaviors):
        ant: Ant = self._world.map.get_entity_by_id(ant_id)
        
        if not ant or ant.owner_id != user_id:
            raise Exception('user dont have this ant')
        
        if ant.ant_type == AntTypes.QUEEN or ant.ant_type == AntTypes.MALE:
            raise Exception('females and males cant change guardian behavior')
        
        ant.guardian_behavior = guaridan_behavior

    def change_ant_cooperative_behavior(self, user_id: int, ant_id: int, is_enabled: bool):
        ant: Ant = self._world.map.get_entity_by_id(ant_id)
        
        if not ant or ant.owner_id != user_id:
            raise Exception('user dont have this ant')
        
        if ant.ant_type == AntTypes.QUEEN or ant.ant_type == AntTypes.MALE:
            raise Exception('queen of colony cant change cooperative')
        
        ant.is_cooperative = is_enabled

    def relocate_ant(self, user_id: int, ant_id: int, nest_id: int):
        ant: Ant = self._world.map.get_entity_by_id(ant_id)
        
        if not ant or ant.owner_id != user_id or ant.type != EntityTypes.ANT:
            raise Exception('user dont have this ant')
        
        if ant.is_queen_of_colony:
            raise Exception('queen of colony cant relocate')
        
        nest: Nest = self._world.map.get_entity_by_id(nest_id)

        if not nest or nest.owner_id != user_id or nest.type != EntityTypes.NEST:
            raise Exception('user dont have this nest')
        
        if ant.from_colony_id != nest.from_colony_id:
            raise Exception('wrong nest')
        
        ant.relocate_to_nest(nest, True)