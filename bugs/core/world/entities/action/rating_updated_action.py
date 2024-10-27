from core.world.entities.action.base.action_types import ActionTypes
from core.world.entities.action.base.actor_types import ActorTypes
from .base.action import Action

from typing import Dict

class RatingUpdatedAction(Action):

    @classmethod
    def build(cls, rating_places: Dict):
        return RatingUpdatedAction(rating_places)

    def __init__(self, rating_places: Dict):
        super().__init__(None, ActionTypes.RATING_UPDATED, ActorTypes.RATING)
        self.rating_places = rating_places
