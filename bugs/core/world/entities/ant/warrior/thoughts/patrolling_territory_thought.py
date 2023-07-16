from ..warrior_ant_body import WarriorAntBody
from core.world.entities.base.live_entity.memory import Memory
from core.world.entities.base.live_entity.world_interactor import WorldInteractor
from core.world.entities.thought.thought import Thought
from core.world.entities.thought.thought_types import ThoughtTypes
from core.world.entities.ant.base.thoughts.searching_walk_thought import SearchingWalkThought

class PatrollingTerritoryThought(Thought):

    _body: WarriorAntBody

    def __init__(self, search_walk_thought: SearchingWalkThought, flags: dict = None, sayback: str = None):
        super().__init__(type=ThoughtTypes.PATROLLING_TERRITORY, flags=flags, sayback=sayback)
        self._searching_walk_thought = search_walk_thought

    def do_step(self):
        self._searching_walk_thought.do_step()
        self._look_for_enemies()

    def set_mind_parts(self, body: WarriorAntBody, memory: Memory, world_interactor: WorldInteractor):
        super().set_mind_parts(body, memory, world_interactor)
        self._searching_walk_thought.set_mind_parts(body=body, memory=memory, world_interactor=world_interactor)

    def _look_for_enemies(self):
        print('looking for enemies')