from ..warrior_ant_body import WarriorAntBody
from core.world.entities.thought.thought import Thought
from core.world.entities.ant.base.thoughts.searching_walk_thought import SearchingWalkThought

class PatrollingTerritoryThought(Thought):

    def __init__(self, body: WarriorAntBody, search_walk_thought: SearchingWalkThought):
        super().__init__(body)
        self._searching_walk_thought = search_walk_thought

    def do_step(self):
        print('patroling')
        self._searching_walk_thought.do_step()