from .action_builder import ActionBuilder
from core.world.utils.event_emiter import EventEmitter
from core.world.world import World

class StepActivityAccumulator():

    STEPS_IN_BAG = 10

    def __init__(self, world: World, event_bus: EventEmitter, action_builder: ActionBuilder):
        self._world = world
        self._event_bus = event_bus
        self._action_builder = action_builder
        self._previous_activity_bag_start_step = None
        self._current_activity_bag_start_step = None
        self._current_step_number = 0
        self._previous_actions = []
        self._current_actions = []
        self._previous_world_state = None
        self._current_world_state = None

        self._event_bus.on('step_action_occurred', self._on_step_action_occurred)
        self._event_bus.on('step_start', self._on_step_start)

    def get_activity_bag(self):
        return self._previous_activity_bag_start_step, self._previous_world_state, self._previous_actions

    def _open_new_activity_bag(self, world_state: dict):
        self._previous_actions = self._current_actions
        self._current_actions = []
        self._previous_world_state = self._current_world_state
        self._current_world_state = world_state 
        self._previous_activity_bag_start_step = self._current_activity_bag_start_step
        self._current_activity_bag_start_step = self._current_step_number

        self._event_bus.emit('activity_bag_is_ready')

    def _accumulate_action(self, entity_id: int, action_type: str, action_data: dict = None):
        action = self._action_builder.build_action(entity_id, action_type,  self._current_step_number, action_data)
        self._validate_action(action)
        self._current_actions.append(action)

    def _on_step_action_occurred(self, entity_id: int, action_type: str, action_data: dict = None):
        self._accumulate_action(entity_id, action_type, action_data)

    def _on_step_start(self, step_number: int):
        self._current_step_number = step_number
        is_time_to_new_activity_bag = step_number % StepActivityAccumulator.STEPS_IN_BAG == 0 or step_number == 0
        if is_time_to_new_activity_bag:
            self._open_new_activity_bag(self._world.to_json())

    def _validate_action(self, validatingAction):
        for action in self._current_actions:
            if validatingAction['actor_id'] == action['actor_id'] and validatingAction['step_number'] == action['step_number']:
                raise Exception('action is not valid') 

