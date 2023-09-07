from core.world.utils.event_emiter import EventEmitter
from core.world.utils.point import Point
from .build_new_nest_operation import BuildNewNestOperation
from .destroy_nest_operation import DestroyNestOperation
from typing import List
from core.world.entities.ant.base.ant import Ant
from core.world.entities.nest.nest import Nest
from core.world.entities.colony.formation.formation_factory import FormationFactory
from core.world.entities.colony.operation.bring_item_to_nest_operation import BringItemToNestOperation
from core.world.entities.item.items.base.item import Item

class OperationFactory():

    def __init__(self, event_bus: EventEmitter, formation_factory: FormationFactory):
        self._event_bus = event_bus
        self._formation_factory = formation_factory

    def build_build_new_nest_operation(self, building_site: Point, id: int = None, hired_ants: List[Ant] = None, flags: dict = None):
        return BuildNewNestOperation(EventEmitter(), self._formation_factory, id, hired_ants, flags, building_site)
    
    def build_destroy_nest_operation(self, nest: Nest, id: int = None, hired_ants: List[Ant] = None, flags: dict = None):
        return DestroyNestOperation(EventEmitter(), self._formation_factory, id, hired_ants, flags, nest)
    
    def build_bring_item_to_nest_operation(self, nest: Nest, item: Item, id: int = None, hired_ants: List[Ant] = None, flags: dict = None):
        return BringItemToNestOperation(self._event_bus, EventEmitter(), self._formation_factory, id, hired_ants, flags, nest, item)