from core.world.usernames_repository_interface import iUsernamesRepository
from core.world.utils.event_emiter import EventEmitter
from core.world.entities.world.world import World
from core.world.entities.base.entity_types import EntityTypes
from core.world.entities.ant.base.ant import Ant
from core.world.entities.colony.colonies.ant_colony.ant_colony import AntColony
from core.world.settings import STEPS_IN_YEAR
from core.world.entities.action.rating_updated_action import RatingUpdatedAction
from typing import List
from collections import Counter

class RatingService():

    def __init__(self, event_bus: EventEmitter, usernames_repository: iUsernamesRepository):
        self._event_bus = event_bus
        self._usernames_repository = usernames_repository
        self._rating = []

        self._event_bus.add_listener('step_done', self._on_step_done)

    @property
    def rating(self):
        return self._rating

    def set_world(self, world: World):
        self._world = world
        self._generate_rating()

    def _on_step_done(self, step_number: int):
        if step_number % STEPS_IN_YEAR == 0:
            self._generate_rating()
            self._event_bus.emit('action', RatingUpdatedAction(self.rating))

    def _generate_rating(self):
        user_datas = self._usernames_repository.get_usernames()
        colonies: List[AntColony] = self._world.ant_colonies
        ants: List[Ant] = self._world.map.get_entities(entity_types=[EntityTypes.ANT])
        colony_owner_ids = [colony.owner_id for colony in colonies]
        colonies_count = dict(Counter(colony_owner_ids))
        ant_owner_ids = [ant.owner_id for ant in ants]
        ants_count = dict(Counter(ant_owner_ids))

        stats = []
        for user_data in user_datas:
            id = user_data['id']
            stat = {
                'id': id,
                'username': user_data['username'],
                'colonies':  colonies_count.get(id, 0),
                'ants': ants_count.get(id, 0),
                'place': -1
            }
            stats.append(stat)

        stats.sort(key = lambda stat: stat['ants'], reverse=True)
        
        place = 1
        for stat in stats:
            stat['place'] = place
            place += 1

        self._rating = stats
        