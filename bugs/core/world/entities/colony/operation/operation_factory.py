from core.world.utils.event_emiter import EventEmitter
from core.world.utils.point import Point
from .build_new_nest_operation import BuildNewNestOperation
from .destroy_nest_operation import DestroyNestOperation
from core.world.entities.nest.nest_factory import NestFactory
from typing import List
from core.world.entities.ant.base.ant import Ant
from core.world.entities.nest.nest import Nest

class OperationFactory():

    def __init__(self, nest_factory: NestFactory):
        self._nest_factory = nest_factory

    def build_build_new_nest_operation(self, building_site: Point, id: int = None, hired_ants: List[Ant] = None, flags: dict = None):
        return BuildNewNestOperation(EventEmitter(), id, hired_ants, flags, building_site, self._nest_factory)
    
    def build_destroy_nest_operation(self, nest: Nest, id: int = None, hired_ants: List[Ant] = None, flags: dict = None):
        return DestroyNestOperation(EventEmitter(), id, hired_ants, flags, nest)