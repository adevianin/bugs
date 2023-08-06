class Action():

    @classmethod
    def build_action(cls, actor_id: int, action_type: str, actor_type: str, action_data: dict = None):
        return Action(actor_id=actor_id, action_type=action_type, actor_type=actor_type, action_data=action_data)

    def __init__(self, actor_id: int, action_type: str, actor_type: str, action_data: dict = None) -> None:
        self._actor_id = actor_id
        self._action_type = action_type
        self._action_data = action_data
        self._actor_type = actor_type

    def to_public_json(self):
        return {
            'actor_id': self._actor_id,
            'actor_type': self._actor_type,
            'action_type': self._action_type,
            'action_data': self._action_data
        }