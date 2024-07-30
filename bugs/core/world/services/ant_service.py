from core.world.entities.ant.base.ant_types import AntTypes
from core.world.entities.ant.male.male_ant import MaleAnt
from core.world.entities.ant.base.ant import Ant
from core.world.entities.ant.queen.queen_ant import QueenAnt
from core.world.entities.world.world import World

class AntService():

    def set_world(self, world: World):
        self._world = world

    def fly_nuptial_flight(self, user_id: int, ant_id: int):
        ant: Ant = self._world.map.get_entity_by_id(ant_id)
        
        if not ant or ant.owner_id != user_id:
            raise Exception('user dont have this ant')
        
        if ant.ant_type == AntTypes.QUEEN:
            queen: QueenAnt = ant
            if queen.can_fly_nuptial_flight:
                queen.fly_nuptial_flight()
                return
        elif ant.ant_type == AntTypes.MALE:
            male: MaleAnt = ant
            male.fly_nuptial_flight()
            nuptial_environment = self._world.get_nuptial_environment_by_owner(user_id)
            nuptial_environment.fly_in_male(male)
            return
            
        raise Exception('cant fly nuptial flight')
    
    def change_ant_guardian_behavior(self, user_id: int, ant_id: int, is_enabled: bool):
        ant: Ant = self._world.map.get_entity_by_id(ant_id)
        
        if not ant or ant.owner_id != user_id:
            raise Exception('user dont have this ant')
        
        ant.body.toggle_guardian_behavior(is_enabled)

    def change_ant_cooperative_behavior(self, user_id: int, ant_id: int, is_enabled: bool):
        ant: Ant = self._world.map.get_entity_by_id(ant_id)
        
        if not ant or ant.owner_id != user_id:
            raise Exception('user dont have this ant')
        
        ant.body.toggle_cooperative_behavior(is_enabled)