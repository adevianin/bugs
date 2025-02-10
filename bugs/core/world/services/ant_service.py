from .base_service import BaseService
from core.world.entities.ant.base.ant_types import AntTypes
from core.world.entities.ant.male.male_ant import MaleAnt
from core.world.entities.ant.queen.queen_ant import QueenAnt
from core.world.entities.nest.nest import Nest
from core.world.entities.ant.base.guardian_behaviors import GuardianBehaviors
from core.world.exceptions import GameRuleError

class AntService(BaseService):

    def fly_nuptial_flight(self, user_id: int, ant_id: int):
        ant = self._find_ant_for_owner(ant_id, user_id)
        
        if not ant.can_fly_nuptial_flight:
            raise GameRuleError(f'ant(id={ant_id}) cant fly nuptial flight')
        
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
        ant = self._find_ant_for_owner(ant_id, user_id)
        
        if ant.ant_type == AntTypes.QUEEN or ant.ant_type == AntTypes.MALE:
            raise GameRuleError('females and males cant change guardian behavior')
        
        ant.guardian_behavior = guaridan_behavior

    def change_ant_cooperative_behavior(self, user_id: int, ant_id: int, is_enabled: bool):
        ant = self._find_ant_for_owner(ant_id, user_id)
        
        if ant.ant_type == AntTypes.QUEEN or ant.ant_type == AntTypes.MALE:
            raise GameRuleError('queen of colony or male cant change cooperative')
        
        ant.is_cooperative = is_enabled

    def relocate_ant(self, user_id: int, ant_id: int, nest_id: int):
        ant = self._find_ant_for_owner(ant_id, user_id)
        
        if ant.is_queen_of_colony:
            raise GameRuleError('queen of colony cant relocate')
        
        nest: Nest = self._find_nest_for_owner(nest_id, user_id)

        if ant.from_colony_id != nest.from_colony_id:
            raise GameRuleError('cant relocate ant to nest from another colony')
        
        ant.relocate_to_nest(nest, True)
