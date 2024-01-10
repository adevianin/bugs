from core.world.entities.world.world import World
from core.world.entities.ant.base.nuptial_environment.nuptial_male import NuptialMale
from core.world.utils.point import Point

from typing import List

class NuptialFlightService():

    def set_world(self, world: World):
        self._world = world

    def search_nuptial_males_for(self, user_id: int) -> List[NuptialMale]:
        nuptial_environment = self._world.get_nuptial_environment_by_owner(user_id)
        return nuptial_environment.search_males()
    
    def found_new_colony(self, user_id: int, queen_id: int, nuptial_male_id: int, nest_building_site: Point):
        
        print('founding new colony')
        