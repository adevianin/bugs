from core.world.entities.world.world import World
from core.world.entities.ant.base.nuptial_environment.nuptial_male import NuptialMale
from core.world.utils.point import Point
from core.world.entities.ant.base.ant import Ant
from core.world.entities.colony.colonies.ant_colony.ant_colony import AntColony

from typing import List

class NuptialFlightService():

    def set_world(self, world: World):
        self._world = world

    def search_nuptial_males_for(self, user_id: int) -> List[NuptialMale]:
        nuptial_environment = self._world.get_nuptial_environment_by_owner(user_id)
        return nuptial_environment.search_males()
    
    def fly_nuptial_flight(self, user_id: int, ant_id: int):
        ant: Ant = self._world.map.get_entity_by_id(ant_id)
        
        if not ant:
            return
        
        colony: AntColony = self._world.get_colony_by_id(ant.from_colony_id)

        if colony.owner_id != user_id:
            raise Exception(f'user dont have this colony')

        if not ant.can_fly_nuptial_flight:
            return
        
        ant.fly_nuptial_flight()
    
    def found_new_colony(self, user_id: int, queen_id: int, nuptial_male_id: int, nest_building_site: Point):
        
        print('founding new colony')
        