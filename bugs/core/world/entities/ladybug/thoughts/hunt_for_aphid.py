from core.world.entities.ladybug.ladybug_body import LadybugBody
from core.world.entities.thought.thought_types import ThoughtTypes
from core.world.entities.thought.thought import Thought
from core.world.entities.base.live_entity.thoughts.random_walk_thought import RandomWalkThought
from core.world.entities.base.live_entity.thoughts.fight_near_enemies_thought import FightNearEnemiesThought
from core.world.entities.item.item_sources.base.item_source import ItemSource

class HuntForAphid(Thought):

    class Flags(Thought.Flags):
        FOUND_APHID = 'found_aphid'
        IS_NEAR_FOUND_APHID = 'is_near_found_aphid'
        IS_FOUND_APID_EATED = 'is_found_aphid_eated'

    _body: LadybugBody

    def __init__(self, random_walk_thought: RandomWalkThought, fight_near_enemies_thought: FightNearEnemiesThought, found_food_source: ItemSource, flags: dict, sayback: str):
        super().__init__(ThoughtTypes.HUNT_FOR_APHID, flags, sayback)
        self._nested_thoughts['random_walk_thought'] = random_walk_thought
        self._nested_thoughts['fight_near_enemies_thought'] = fight_near_enemies_thought
        self._found_food_source = found_food_source

    @property
    def random_walk_thought(self) -> RandomWalkThought:
        return self._nested_thoughts['random_walk_thought']
    
    @property
    def fight_near_enemies_thought(self) -> FightNearEnemiesThought:
        return self._nested_thoughts['fight_near_enemies_thought']
    
    @property
    def found_food_source_id(self) -> int:
        return self._found_food_source.id if self._found_food_source else None

    def do_step(self) -> bool:
        super().do_step()
        self.fight_near_enemies_thought.do_step()
        if self.fight_near_enemies_thought.is_fighting:
            return
        
        if not self._body.memory.read_flag(self.Flags.FOUND_APHID):
            food_sources = self._body.look_around_for_honeydew_food_sources()

            for food_source in food_sources:
                if food_source.is_fertile:
                    self._found_food_source = food_source
                    self._body.memory.save_flag(self.Flags.FOUND_APHID, True)
                    break

        if self._body.memory.read_flag(self.Flags.FOUND_APHID) and not self._body.memory.read_flag(self.Flags.IS_NEAR_FOUND_APHID):
            is_walk_done = self._body.step_to(self._found_food_source.position)
            self._body.memory.save_flag(self.Flags.IS_NEAR_FOUND_APHID, is_walk_done)
            return
        
        if self._body.memory.read_flag(self.Flags.IS_NEAR_FOUND_APHID) and not self._body.memory.read_flag(self.Flags.IS_FOUND_APID_EATED):
            if self._found_food_source.is_fertile:
                self._body.eat_aphid(self._found_food_source)
            if not self._found_food_source.is_fertile:
                self._body.memory.save_flag(self.Flags.IS_FOUND_APID_EATED, True)
                self.done()
            return
        
        self.random_walk_thought.do_step()