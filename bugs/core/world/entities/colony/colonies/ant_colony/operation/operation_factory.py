from core.world.utils.event_emiter import EventEmitter
from core.world.utils.point import Point
from .build_new_sub_nest_operation import BuildNewSubNestOperation
from .destroy_nest_operation import DestroyNestOperation
from typing import List
from core.world.entities.ant.base.ant import Ant
from core.world.entities.nest.nest import Nest
from core.world.entities.colony.colonies.ant_colony.formation.formation_factory import FormationFactory
from core.world.entities.colony.colonies.ant_colony.operation.bring_item_to_nest_operation import BringItemToNestOperation
from core.world.entities.item.items.base.item import Item
from core.world.entities.colony.colonies.ant_colony.operation.pillage_nest_operation import PillageNestOperation
from core.world.entities.colony.colonies.ant_colony.formation.base.base_formation import BaseFormation
from core.world.entities.colony.colonies.ant_colony.operation.transport_food_operation import TransportFoodOperation

class OperationFactory():

    def __init__(self, formation_factory: FormationFactory):
        self._formation_factory = formation_factory

    def build_build_new_sub_nest_operation(self, building_site: Point, workers_count: int, id: int = None, hired_ants: List[Ant] = None, flags: dict = None, formations: List[BaseFormation] = []):
        return BuildNewSubNestOperation(EventEmitter(), self._formation_factory, id, hired_ants, flags, formations, building_site, workers_count)
    
    def build_destroy_nest_operation(self, nest: Nest, warriors_count: int, id: int = None, hired_ants: List[Ant] = None, flags: dict = None, formations: List[BaseFormation] = []):
        return DestroyNestOperation(EventEmitter(), self._formation_factory, id, hired_ants, flags, formations, nest, warriors_count)
    
    def build_bring_item_to_nest_operation(self, nest: Nest, item: Item, id: int = None, hired_ants: List[Ant] = None, flags: dict = None, formations: List[BaseFormation] = []):
        return BringItemToNestOperation(EventEmitter(), self._formation_factory, id, hired_ants, flags, formations, nest, item)
    
    def build_pillage_nest_operation(self, nest_to_pillage: Nest, nest_for_loot: Nest, workers_count: int, warriors_count: int, id: int = None, hired_ants: List[Ant] = None, flags: dict = None, formations: List[BaseFormation] = []):
        return PillageNestOperation(EventEmitter(), self._formation_factory, id, hired_ants, flags, formations, nest_to_pillage, nest_for_loot, workers_count, warriors_count)
    
    def build_transport_food_operation(self, nest_from: Nest, nest_to: Nest, workers_count: int, id: int = None, hired_ants: List[Ant] = None, flags: dict = None, formations: List[BaseFormation] = []):
        return TransportFoodOperation(EventEmitter(), self._formation_factory, id, hired_ants, flags, formations, nest_from, nest_to, workers_count)