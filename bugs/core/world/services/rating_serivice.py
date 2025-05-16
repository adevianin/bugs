from .base_service import BaseService
from core.world.entities.world.player_stats import PlayerStats
from core.world.entities.action.rating_updated_action import RatingUpdatedAction
from core.world.entities.world.player_stats_factory import PlayerStatsFactory
from core.world.entities.ant.base.ant import Ant
from core.world.entities.base.entity_types import EntityTypes
from typing import Callable

class RatingService(BaseService):

    def __init__(self, event_bus, player_stats_factory: PlayerStatsFactory):
        super().__init__(event_bus)
        self._player_stats_factory = player_stats_factory
        self._rating = []

    @property
    def rating(self):
        return self._rating

    def generate_rating(self, user_datas):
        self._generate_rating(user_datas)
        self._event_bus.emit('action', RatingUpdatedAction(self.rating))

    def _generate_rating(self, user_datas):
        stats = []
        for user_data in user_datas:
            id = user_data['id']
            player_stats = self._get_or_create_player_stats(id)
            stat = {
                'id': id,
                'username': user_data['username'],
                'colonies':  player_stats.colonies_count,
                'ants': player_stats.ants_count,
                'place': -1
            }
            stats.append(stat)

        stats.sort(key = lambda stat: stat['ants'], reverse=True)
        
        place = 1
        for stat in stats:
            stat['place'] = place
            place += 1

        self._rating = stats

    def _get_or_create_player_stats(self, owner_id: int) -> PlayerStats:
        player_stats = self._get_player_stats_for_owner(owner_id)
        if not player_stats:
            ants_count = self._count_player_ants(owner_id)
            colonies_count = self._count_player_colonies(owner_id)
            player_stats = self._player_stats_factory.build_player_stats(owner_id, ants_count, colonies_count)
            self._world.add_new_player_stats(player_stats)

        return player_stats

    def _get_player_stats_for_owner(self, owner_id: int) -> PlayerStats:
        for player_stats in self._world.player_stats_list:
            if player_stats.owner_id == owner_id:
                return player_stats
            
        return None
    
    def _count_player_ants(self, player_id: int):
        owner_filter: Callable[[Ant], bool] = lambda ant: ant.owner_id == player_id
        player_ants = self._world.map.get_entities(entity_types=[EntityTypes.ANT], filter=owner_filter)
        return len(player_ants)
    
    def _count_player_colonies(self, player_id: int):
        count = 0
        for colony in self._world.ant_colonies:
            if (colony.owner_id == player_id):
                count += 1
        return count
    

        