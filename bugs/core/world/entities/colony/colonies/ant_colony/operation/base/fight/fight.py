from core.world.utils.event_emiter import EventEmitter
from core.world.entities.ant.base.ant import Ant
from core.world.entities.base.live_entity.live_entity import LiveEntity

from typing import List, Callable
from functools import partial

class Fight():

    def __init__(self, events: EventEmitter, ants: List[Ant], is_started: bool):
        self._listeners = {}
        self.events = events
        self._ants = ants.copy()
        self._is_started = is_started
        self._targets = []

        for ant in self._ants:
            self._listen_ant(ant)

        self._update_targets()

    @property
    def ants_ids(self) -> List[int]:
        return [ant.id for ant in self._ants]
    
    @property
    def is_started(self):
        return self._is_started
    
    def start(self):
        for ant in self._ants:
            ant.free_mind()
            self._order_ant_to_fight_enemies(ant)

    def step_pulse(self):
        self._update_targets()

        if len(self._targets) == 0:
            self._done()

    def destroy(self):
        self.events.remove_all_listeners()
        for ant in self._ants:
            self._stop_listen_ant(ant)

    def remove_ant(self, ant: Ant):
        self._ants.remove(ant)
        self._stop_listen_ant(ant)
        if len(self._ants) == 0:
            self.events.emit('defeated')

    def _done(self):
        self.events.emit('won')

    def _update_targets(self):
        enemies = []
        for ant in self._ants:
            enemies += ant.look_around_for_enemies()

        self._targets = list(set(enemies))

    def _filter_died_targets(self):
        is_alive_filter: Callable[[LiveEntity], bool] = lambda entity: not entity.is_died
        self._targets = list(filter(is_alive_filter, self._targets))

    def _order_ant_to_fight_enemies(self, ant: Ant):
        enemies = ant.sort_by_distance(self._targets)
        if len(enemies) > 0:
            ant.fight_enemy(enemies[0], sayback='killed_enemy')

    def _listen_ant(self, ant: Ant):
        self._listeners[ant] = {}
        
        killed_enemy_listener = partial(self._on_ant_killed_enemy, ant)
        ant.sayer.add_listener('killed_enemy', killed_enemy_listener)
        self._listeners[ant]['killed_enemy'] = killed_enemy_listener

    def _stop_listen_ant(self, ant: Ant):
        killed_enemy_listener = self._listeners[ant]['killed_enemy']
        ant.sayer.remove_listener('killed_enemy', killed_enemy_listener)

        del self._listeners[ant]

    def _on_ant_killed_enemy(self, ant: Ant):
        self._filter_died_targets()
        self._order_ant_to_fight_enemies(ant)
