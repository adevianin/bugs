from core.world.utils.event_emiter import EventEmitter
from core.world.utils.point import Point
from .build_new_nest_operation import BuildNewNestOperation
from core.world.entities.nest.nest import Nest
from core.world.entities.nest.nest_factory import NestFactory

class OperationFactory():

    def __init__(self, nest_factory: NestFactory):
        self._nest_factory = nest_factory

    def build_build_new_nest_operation(self, building_site: Point):
        return BuildNewNestOperation(EventEmitter(), building_site, self._nest_factory)