from core.world.entities.world.world import World
from core.world.entities.colony.colony_factory import ColonyFactory
from core.world.entities.ant.ant_factory import AntFactory
from core.world.utils.event_emiter import EventEmitter
from core.world.entities.world.birthers.requests.ant_requests.ant_birth_from_system_request import AntBirthFromSystemRequest
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

    def prepare_starter_pack(self, player_id: int):
        player_ant_colonies = self._world.get_ant_colonies_by_owner(player_id)

        if len(player_ant_colonies) > 0:
            return
        
        owner_filter: Callable[[Ant], bool] = lambda ant: ant.owner_id == player_id
        player_ants = self._world.map.get_entities(entity_types=[EntityTypes.ANT], filter=owner_filter)

        if len(player_ants) > 0:
            return

        position = Point(-100, -100)
        larva = self._ant_factory.build_starter_queen_larva()
        def on_queen_born(queen: QueenAnt):
            queen.fly_nuptial_flight()
            
        self._event_bus.emit('ant_birth_request', AntBirthFromSystemRequest(larva, player_id, position, on_queen_born))

    