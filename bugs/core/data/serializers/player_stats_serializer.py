from core.world.entities.world.player_stats import PlayerStats

class PlayerStatsSerializer():

    def serialize(self, player_stats: PlayerStats):
        return {
            'owner_id': player_stats.owner_id,
            'ants_count': player_stats.ants_count,
            'colonies_count': player_stats.colonies_count
        }
