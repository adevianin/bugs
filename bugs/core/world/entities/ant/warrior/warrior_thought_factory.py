from core.world.entities.ant.base.ant_thought_factory import AntThoughtFactory
from .thoughts.patrolling_territory_thought import PatrollingTerritoryThought
from core.world.entities.nest.nest import Nest

class WarriorThoughtFactory(AntThoughtFactory):

    def build_patrolling_nest_territory_thought(self, nest: Nest):
        searching_thought = self.build_searching_walk_thought(nest.position, nest.area)
        return PatrollingTerritoryThought(self._body, searching_thought)
