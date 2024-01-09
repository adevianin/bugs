from core.world.entities.world.world import World
from core.world.entities.colony.colony_factory import ColonyFactory
from core.world.entities.ant.ant_factory import AntFactory
from core.world.entities.ant.base.ant_types import AntTypes
from core.world.entities.base.live_entity.live_stats import LiveStats

class PlayerService():

    def __init__(self, colony_factory: ColonyFactory, ant_factory: AntFactory):
        self._colony_factory = colony_factory
        self._ant_factory = ant_factory

    def set_world(self, world: World):
        self._world = world

    def build_player_starter_pack(self, user_id: int):
        colony_id = self._world.generate_id()
        colony = self._colony_factory.build_new_ant_colony(id=colony_id, owner_id=user_id, map=self._world.map, colony_relations_table=self._world.colony_relations_table)
        self._world.add_new_colony(colony)

        stats = LiveStats.build(300, 20, 32, 200, 1000, 2, 20, 5)
        position = self._world.map.generate_random_point()
        queen_id = self._world.generate_id()
        queen_ant = self._ant_factory.build_new_ant(id=queen_id, from_colony_id=colony_id, stats=stats, ant_type=AntTypes.QUEEN, position=position)
        # queen_ant.mind.toggle_auto_thought_generation(False)
        raise Exception('use entity birther here')
        # self._world.map.add_new_entity(queen_ant)
    