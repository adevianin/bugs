from core.world.entities.world.world import World
from core.world.entities.colony.colony_factory import ColonyFactory
from core.world.entities.ant.ant_factory import AntFactory
from core.world.utils.event_emiter import EventEmitter
from core.world.entities.base.entity_types import EntityTypes
from core.world.entities.ant.base.ant import Ant
from core.world.utils.point import Point
from core.world.entities.ant.queen.queen_ant import QueenAnt

from typing import Callable

class PlayerService():

    def __init__(self, event_bus: EventEmitter, colony_factory: ColonyFactory, ant_factory: AntFactory):
        self._event_bus = event_bus
        self._colony_factory = colony_factory
        self._ant_factory = ant_factory

    def set_world(self, world: World):
        self._world = world

    def born_new_antara(self, player_id: int):
        player_ant_colonies = self._world.get_ant_colonies_by_owner(player_id)

        if len(player_ant_colonies) > 0:
            return
        
        owner_filter: Callable[[Ant], bool] = lambda ant: ant.owner_id == player_id
        player_ants = self._world.map.get_entities(entity_types=[EntityTypes.ANT], filter=owner_filter)

        if len(player_ants) > 0:
            return
        
        def on_antara_born(queen: QueenAnt):
            queen.fly_nuptial_flight()

        nuptial_env = self._world.get_nuptial_environment_by_owner(player_id)
        nuptial_env.born_antara(on_antara_born)
    