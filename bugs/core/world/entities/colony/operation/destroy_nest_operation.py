from typing import List
from core.world.entities.ant.base.ant import Ant
from core.world.entities.colony.operation.operation_types import OperationTypes
from core.world.utils.event_emiter import EventEmitter
from .operation import Operation
from core.world.entities.nest.nest import Nest
from core.world.entities.ant.base.ant_types import AntTypes
from .marker_types import MarkerTypes

class DestroyNestOperation(Operation):

    def __init__(self, events: EventEmitter, id: int, hired_ants: List[Ant], flags: dict, nest: Nest):
        super().__init__(events, id, OperationTypes.DESTROY_NEST, hired_ants, flags)
        self._nest = nest
        self._name = 'знищення мурашника'
        self._open_vacancies(AntTypes.WARRIOR, 2)
        self._add_marker(MarkerTypes.CROSS, nest.position)

    def _init_staff_connection(self):
        pass

    def _start_operation(self):
        pass