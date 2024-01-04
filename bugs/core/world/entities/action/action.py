from .action_types import ActionTypes
from .actor_types import ActorTypes

class Action():

    @classmethod
    def build_entity_action(self, actor_id: int, action_type: ActionTypes, action_data: dict):
        return Action(actor_id, action_type, ActorTypes.ENTITY, action_data)
    
    @classmethod
    def build_colony_action(self, actor_id: int, action_type: ActionTypes, action_data: dict):
        return Action(actor_id, action_type, ActorTypes.COLONY, action_data)

    def __init__(self, actor_id: int, action_type: ActionTypes, actor_type: str, action_data: dict):
        self.actor_id = actor_id
        self.action_type = action_type
        self.action_data = action_data
        self.actor_type = actor_type
