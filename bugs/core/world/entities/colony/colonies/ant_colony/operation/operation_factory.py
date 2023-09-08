from core.world.utils.event_emiter import EventEmitter
from core.world.utils.point import Point
from .build_new_nest_operation import BuildNewNestOperation
from .destroy_nest_operation import DestroyNestOperation
from typing import List
from core.world.entities.ant.base.ant import Ant
from core.world.entities.nest.nest import Nest
from core.world.entities.colony.colonies.ant_colony.formation.formation_factory import FormationFactory
from core.world.entities.colony.colonies.ant_colony.operation.bring_item_to_nest_operation import BringItemToNestOperation
from core.world.entities.item.items.base.item import Item
from core.world.entities.colony.colonies.ant_colony.operation.pillage_nest_operation import PillageNestOperation

class OperationFactory():

    def __init__(self, formation_factory: FormationFactory):
        self._formation_factory = formation_factory

    def build_build_new_nest_operation(self, building_site: Point, id: int = None, hired_ants: List[Ant] = None, flags: dict = None):
        return BuildNewNestOperation(EventEmitter(), self._formation_factory, id, hired_ants, flags, building_site)
    
    def build_destroy_nest_operation(self, nest: Nest, id: int = None, hired_ants: List[Ant] = None, flags: dict = None):
        return DestroyNestOperation(EventEmitter(), self._formation_factory, id, hired_ants, flags, nest)
    
    def build_bring_item_to_nest_operation(self, nest: Nest, item: Item, id: int = None, hired_ants: List[Ant] = None, flags: dict = None):
        return BringItemToNestOperation(EventEmitter(), self._formation_factory, id, hired_ants, flags, nest, item)
    
    def build_pillage_nest_operation(self, nest_to_pillage: Nest, nest_to_unload: Nest, id: int = None, hired_ants: List[Ant] = None, flags: dict = None):
        return PillageNestOperation(EventEmitter(), self._formation_factory, id, hired_ants, flags, nest_to_pillage, nest_to_unload)