from core.world.entities.base.live_entity.body import Body

class ActionBuilder:

    def __init__(self, step_time: int):
        self._step_time = step_time

    def build_action(self, entity_id: int, action_type: str, consumed_time_points: int, action_data: dict = None):
        return {
            'entity_id': entity_id,
            'action_type': action_type,
            'time': self._convert_time_points_to_sec(consumed_time_points),
            'action_data': action_data
        }

    def _convert_time_points_to_sec(self, time_points: int):
        return time_points * self._step_time / Body.TIME_POINTS_PER_TURN