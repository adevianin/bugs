from .base_service import BaseService
from core.world.entities.world.world import World
from core.world.utils.point import Point
from core.world.entities.ant.queen.queen_ant import QueenAnt
from core.world.entities.colony.colony_factory import ColonyFactory
from core.world.entities.nest.nest import Nest
from core.world.entities.ant.base.nuptial_environment.specie_builder.specie import Specie
from core.world.entities.ant.base.genetic.chromosome_types import ChromosomeTypes
from core.world.utils.remove_non_alphanumeric_and_spaces import remove_non_alphanumeric_and_spaces
from core.world.settings import FOOD_IN_NEW_COLONY_MAIN_NEST
from core.world.entities.ant.base.ant import Ant
from core.world.entities.ant.base.ant_types import AntTypes
from core.world.exceptions import EntityNotFoundError
from core.world.messages import Messages

from typing import List, Dict

class NuptialEnvironmentService(BaseService):

    def __init__(self, event_bus, colony_factory: ColonyFactory):
        super().__init__(event_bus)
        self._colony_factory = colony_factory

    def found_new_colony(self, user_id: int, queen_id: int, nuptial_male_id: int, nest_building_site: Point, colony_name: str):
        ant: Ant = self._find_ant_for_owner(queen_id, user_id)
        if ant.ant_type != AntTypes.QUEEN:
            raise EntityNotFoundError(f'queen(id={queen_id}) not found')
        queen: QueenAnt = ant
        
        nuptial_environment = self._find_nuptial_environment_for_owner(user_id)
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
        nuptial_environment = self._find_nuptial_environment_for_owner(user_id)

        return nuptial_environment.specie
    
    def get_nuptial_males_for_owner(self, user_id: int):
        nuptial_environment = self._find_nuptial_environment_for_owner(user_id)
        return nuptial_environment.males
    
    def change_specie_schema(self, user_id: int, specie_schema: Dict[ChromosomeTypes, List[str]]):
        nuptial_environment = self._find_nuptial_environment_for_owner(user_id)
        if nuptial_environment.specie.validate_schema(specie_schema):
            nuptial_environment.specie.apply_schema(specie_schema)
            return None
        else:
            return Messages.SPECIE_SCHEMA_IS_NOT_VALID
        