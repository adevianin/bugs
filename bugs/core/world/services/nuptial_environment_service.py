from core.world.entities.world.world import World
from core.world.utils.point import Point
from core.world.entities.ant.queen.queen_ant import QueenAnt
from core.world.entities.colony.colony_factory import ColonyFactory
from core.world.entities.nest.nest import Nest
from core.world.entities.ant.base.nuptial_environment.specie_builder.specie import Specie
from core.world.entities.ant.base.genetic.chromosome_types import ChromosomeTypes
from core.world.utils.remove_non_alphanumeric_and_spaces import remove_non_alphanumeric_and_spaces
from core.world.settings import FOOD_IN_NEW_COLONY_MAIN_NEST

from typing import List, Dict

class NuptialEnvironmentService():

    def __init__(self, colony_factory: ColonyFactory):
        self._colony_factory = colony_factory

    def set_world(self, world: World):
        self._world = world

    def found_new_colony(self, user_id: int, queen_id: int, nuptial_male_id: int, nest_building_site: Point, colony_name: str):
        queen: QueenAnt = self._world.map.get_entity_by_id(queen_id)

        if queen.owner_id != user_id:
            raise Exception('user dont have this ant')
        
        nuptial_environment = self._world.get_nuptial_environment_by_owner(user_id)
        male = nuptial_environment.get_male(nuptial_male_id)
        queen.fertilize(male)

        colony_name = remove_non_alphanumeric_and_spaces(colony_name)

        new_colony = self._colony_factory.build_new_ant_colony(user_id, self._world.map, self._world.colony_relations_table, colony_name)

        new_colony.add_new_member(queen)

        def on_nest_found(nest: Nest):
            queen.relocate_to_nest(nest)
            queen.fly_nuptial_flight_back(nest.position)
            # queen.build_nest(nest, True)
            nest.take_calories(FOOD_IN_NEW_COLONY_MAIN_NEST)
            self._world.add_new_colony(new_colony) # found nest before new colony

        queen.found_nest(colony_name, True, nest_building_site, on_nest_found)

    def get_specie_for(self, user_id: int) -> Specie:
        nuptial_environment = self._world.get_nuptial_environment_by_owner(user_id)

        return nuptial_environment.specie
    
    def change_specie_schema(self, user_id: int, specie_schema: Dict[ChromosomeTypes, List[str]]):
        nuptial_environment = self._world.get_nuptial_environment_by_owner(user_id)
        if nuptial_environment.specie.validate_schema(specie_schema):
            nuptial_environment.specie.apply_schema(specie_schema)
            return None
        else:
            return 'specie schema is not valid'
        