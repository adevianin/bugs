from .action_builder import ActionBuilder

class ActionAccumulator():

    def __init__(self, action_builder: ActionBuilder):
        self._action_builder = action_builder
        self._previous_step_actions = []
        self._current_step_actions = []

    def step(self):
        self._previous_step_actions = self._current_step_actions
        self._current_step_actions = []

    def accumulate_entity_action(self, entity_id: int, action_type: str, consumed_time_points: int, action_data: dict = None):
        action = self._action_builder.build_action(entity_id, action_type, consumed_time_points, action_data)
        self._current_step_actions.append(action)

    def get_prev_step_actions(self):
        return self._previous_step_actions

    
    