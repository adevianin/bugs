from core.world.utils.event_emiter import EventEmitter
from core.world.entities.action.base.action import Action

from typing import List, Callable

class ActionAccumulator():

    def __init__(self, event_bus: EventEmitter):
        self._event_bus = event_bus
        self._common_actions: List[Action] = []
        self._personal_actions: List[Action] = []

        self._event_bus.add_listener('action', self._on_action)

    def pull_common_actions(self) -> List[Action]:
        actions = self._common_actions
        self._common_actions = []
        return actions
    
    def pull_personal_actions(self, user_id: int):
        user_filter: Callable[[Action], bool] = lambda action: action.for_user_id == user_id
        actions = list(filter(user_filter, self._personal_actions))
        for action in actions:
            self._personal_actions.remove(action)
        return actions

    def _on_action(self, action: Action):
        if action.is_personal():
            self._personal_actions.append(action)
        else:
            self._common_actions.append(action)
