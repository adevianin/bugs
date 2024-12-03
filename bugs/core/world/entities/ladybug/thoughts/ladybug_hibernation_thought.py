from core.world.entities.ladybug.ladybug_body import LadybugBody
from core.world.entities.thought.thought_types import ThoughtTypes
from core.world.entities.thought.thought import Thought
from core.world.entities.base.live_entity.thoughts.random_walk_thought import RandomWalkThought
from core.world.entities.base.live_entity.thoughts.fight_near_enemies_thought import FightNearEnemiesThought
from core.world.entities.tree.tree import Tree
from core.world.utils.point import Point

class LadybugHibernationThought(Thought):

    class Flags(Thought.Flags):
        FOUND_TREE = 'found_tree'
        IS_NEAR_HIBERNATION_POINT = 'is_near_hibernation_point'

    _body: LadybugBody

    def __init__(self, random_walk_thought: RandomWalkThought, fight_near_enemies_thought: FightNearEnemiesThought, found_tree: Tree, flags: dict, sayback: str):
        super().__init__(ThoughtTypes.LADYBUG_HIBERNATION, flags, sayback)
        self._nested_thoughts['random_walk_thought'] = random_walk_thought
        self._nested_thoughts['fight_near_enemies_thought'] = fight_near_enemies_thought
        self._found_tree = found_tree

    @property
    def random_walk_thought(self) -> RandomWalkThought:
        return self._nested_thoughts['random_walk_thought']
    
    @property
    def fight_near_enemies_thought(self) -> FightNearEnemiesThought:
        return self._nested_thoughts['fight_near_enemies_thought']
    
    @property
    def found_tree_id(self):
        return self._found_tree.id if self._found_tree else None
    
    def do_step(self) -> bool:
        super().do_step()

        if self._body.check_urge_to_exit_hibernation():
            self.cancel()
            return
        
        if not self._body.am_i_in_hibernation():
            self.fight_near_enemies_thought.do_step()
            if self.fight_near_enemies_thought.is_fighting:
                return
        
        if not self._read_flag(self.Flags.FOUND_TREE):
            trees = self._body.look_aroung_for_trees()
            if len(trees) > 0:
                self._found_tree = trees[0]
                self._write_flag(self.Flags.FOUND_TREE, True)

        if not self._read_flag(self.Flags.FOUND_TREE):
            self.random_walk_thought.do_step()
            return
            
        if self._read_flag(self.Flags.FOUND_TREE) and not self._read_flag(self.Flags.IS_NEAR_HIBERNATION_POINT):
            hibernation_point = Point(self._found_tree.position.x, self._found_tree.position.y - 100)
            is_walk_done = self._body.step_to(hibernation_point)
            if is_walk_done:
                self._write_flag(self.Flags.IS_NEAR_HIBERNATION_POINT, True)
            return
        
        if not self._body.am_i_in_hibernation() and self._read_flag(self.Flags.IS_NEAR_HIBERNATION_POINT):
            self._body.enter_hibernation()
            self.done() 
        