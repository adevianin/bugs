from core.world.utils.event_emiter import EventEmitter
from core.world.utils.point import Point
from .build_new_nest_operation import BuildNewNestOperation
from .destroy_nest_operation import DestroyNestOperation
from typing import List
from core.world.entities.ant.base.ant import Ant
from core.world.entities.nest.nest import Nest
from core.world.entities.colony.formation.formation_factory import FormationFactory

class OperationFactory():

    def __init__(self, formation_factory: FormationFactory):
        self._formation_factory = formation_factory

    def build_build_new_nest_operation(self, building_site: Point, id: int = None, hired_ants: List[Ant] = None, flags: dict = None):
        return BuildNewNestOperation(EventEmitter(), self._formation_factory, id, hired_ants, flags, building_site)
    
    def build_destroy_nest_operation(self, nest: Nest, id: int = None, hired_ants: List[Ant] = None, flags: dict = None):
        return DestroyNestOperation(EventEmitter(), self._formation_factory, id, hired_ants, flags, nest)