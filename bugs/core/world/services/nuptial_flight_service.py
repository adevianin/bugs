from core.world.entities.world.world import World
from core.world.entities.ant.base.nuptial_environment.nuptial_male import NuptialMale
from core.world.utils.point import Point
from core.world.entities.ant.base.ant import Ant
from core.world.entities.ant.queen.queen_ant import QueenAnt
from core.world.entities.colony.colony_factory import ColonyFactory
from core.world.entities.nest.nest import Nest
from core.world.entities.ant.base.ant_types import AntTypes

from typing import List

class NuptialFlightService():

    def __init__(self, colony_factory: ColonyFactory):
        self._colony_factory = colony_factory

    def set_world(self, world: World):
        self._world = world

    def search_nuptial_males_for(self, user_id: int) -> List[NuptialMale]:
        nuptial_environment = self._world.get_nuptial_environment_by_owner(user_id)
        return nuptial_environment.search_males()
    
    def fly_nuptial_flight(self, user_id: int, ant_id: int):
        ant: Ant = self._world.map.get_entity_by_id(ant_id)
        
        if not ant or ant.owner_id != user_id:
            raise Exception('user dont have this ant')
        
        if ant.ant_type == AntTypes.QUEEN:
            ant: QueenAnt = ant
            if ant.can_fly_nuptial_flight:
                ant.fly_nuptial_flight()
                return
            
        raise Exception('cant fly nuptial flight')
    
    def found_new_colony(self, user_id: int, queen_id: int, nuptial_male_id: int, nest_building_site: Point):
        queen: QueenAnt = self._world.map.get_entity_by_id(queen_id)

        if queen.owner_id != user_id:
            raise Exception('user dont have this ant')
        
        nuptial_environment = self._world.get_nuptial_environment_by_owner(user_id)
        male = nuptial_environment.get_male(nuptial_male_id)
        queen.fertilize(male)

        new_colony = self._colony_factory.build_new_ant_colony(self._world.generate_id(), user_id, self._world.map, self._world.colony_relations_table, queen.id)
        self._world.add_new_colony(new_colony)

        queen.from_colony_id = new_colony.id
        queen.fly_nuptial_flight_back(nest_building_site)

        def on_nest_found(nest: Nest):
            queen.relocate_to_nest(nest)
            queen.build_nest(nest, 'new_nest_is_built')

        queen.found_nest(nest_building_site, on_nest_found)
        