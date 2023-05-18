# from core.world.settings import TIME_POINTS_PER_TURN, STEP_TIME

class ActionBuilder:

    def build_action(self, entity_id: int, action_type: str, step_number: int, action_data: dict = None):
        return {
            'actor_id': entity_id,
            'action_type': action_type,
            'step_number': step_number,
            # 'time': self._convert_time_points_to_sec(consumed_time_points),
            'action_data': action_data
        }

    # def _convert_time_points_to_sec(self, time_points: int):
    #     return time_points * STEP_TIME / TIME_POINTS_PER_TURN