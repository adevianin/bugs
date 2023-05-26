from core.world.utils.event_emiter import EventEmitter
from core.world.world import World

class SynchronizationService():

    SYNC_STEP_FREQUENCY = 10

    def __init__(self, world: World, event_bus: EventEmitter):
        self._world = world
        self._event_bus = event_bus

        self._event_bus.on('step_start', self._on_step_start)

    def _on_step_start(self, step_number: int):
        is_time_to_sync_step = step_number % SynchronizationService.SYNC_STEP_FREQUENCY == 0
        if is_time_to_sync_step:
            self._event_bus.emit('sync_step', self._world.to_json())
    