from .action_types import ActionTypes

class Action():

    def __init__(self, actor_id: int, action_type: ActionTypes, actor_type: str):
        self.actor_id = actor_id
        self.action_type = action_type
        self.actor_type = actor_type
