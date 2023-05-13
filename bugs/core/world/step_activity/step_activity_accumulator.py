from .action_builder import ActionBuilder

class StepActivityAccumulator():

    def __init__(self, action_builder: ActionBuilder):
        self._action_builder = action_builder
        self._previous_step_actions = []
        self._current_step_actions = []
        self._previous_step_state = None
        self._current_step_state = None
        self._current_step_number = None
        self._previous_step_number = None

    def start_step(self, step_number: int, world_state: dict):
        self._current_step_state = world_state
        self._current_step_number = step_number

    def accumulate_action(self, entity_id: int, action_type: str, consumed_time_points: int, action_data: dict = None):
        action = self._action_builder.build_action(entity_id, action_type, consumed_time_points, action_data)
        self._current_step_actions.append(action)

    def step_done(self):
        self._previous_step_actions = self._current_step_actions
        self._current_step_actions = []
        self._previous_step_state = self._current_step_state
        self._current_step_state = None
        self._previous_step_number = self._current_step_number
        self._current_step_number = None

    def get_previous_step_activity(self):
        return self._previous_step_number, self._previous_step_state, self._previous_step_actions

    
    