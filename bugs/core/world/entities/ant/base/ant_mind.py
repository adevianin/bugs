from core.world.entities.base.live_entity.mind import Mind
from .ant_task_factory import AntTaskFactory
from .ant_body import AntBody
from core.world.map import Map
from core.world.entities.town.town import Town
from core.world.entities.base.live_entity.memory import Memory
from core.world.utils.event_emiter import EventEmitter
from core.world.utils.point import Point

class AntMind(Mind):

    def __init__(self, events: EventEmitter, body: AntBody, task_factory: AntTaskFactory, map: Map, memory: Memory, home_town: Town):
        super().__init__(events, body, task_factory, map, memory)
        self._home_town = home_town

    def prepare_for_operation(self):
        self.toggle_auto_task_generation(False)
        self.force_free()
        task = self._task_factory.build_prepare_for_operation_task(self._home_town, self._memory, self._calc_assemble_point())
        self._register_task(task, True)

        return task
    
    def leave_operation(self):
        self.toggle_auto_task_generation(True)
    
    def walk_to(self, position: Point):
        task = self._task_factory.build_walk_to_task(position)
        self._register_task(task, True)

        return task
    
    def relocate_to_town(self, town: Town):
        self._home_town = town
    
    def _calc_assemble_point(self):
        return Point(self._home_town.position.x, self._home_town.position.y + 40)

