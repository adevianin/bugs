from core.world.utils.event_emiter import EventEmitter
from core.world.utils.point import Point
from .build_new_nest_operation import BuildNewNestOperation
from core.world.entities.nest.nest import Nest

class OperationFactory():

    def build_build_new_nest_operation(self, building_site: Point, new_nest: Nest):
        return BuildNewNestOperation(EventEmitter(), building_site, new_nest)