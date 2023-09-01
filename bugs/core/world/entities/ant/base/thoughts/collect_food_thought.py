from core.world.entities.thought.thought import Thought
from core.world.entities.nest.nest import Nest
from core.world.entities.base.live_entity.thoughts.go_in_nest import GoInNestThought
from core.world.entities.thought.thought_types import ThoughtTypes
from core.world.entities.ant.base.ant_body import AntBody
from core.world.utils.point import Point
from core.world.entities.base.live_entity.thoughts.random_walk_thought import RandomWalkThought
from core.world.entities.item.item_source import ItemSource
from core.world.entities.item.item import Item

class CollectFoodThought(Thought):

    _body: AntBody

    def __init__(self, body: AntBody, nest: Nest, random_walk_thought: RandomWalkThought, go_home_thought: GoInNestThought, found_food: Item = None, flags: dict = None, sayback: str = None):
        super().__init__(body=body, type=ThoughtTypes.COLLECT_FOOD, flags=flags, sayback=sayback)
        self._nest = nest
        self._nested_thoughts['random_walk_thought'] = random_walk_thought
        self._nested_thoughts['go_home_thought'] = go_home_thought
        self._found_food = found_food
        self._food_source_position = None

        self._nest.events.add_listener('died', self._on_nest_died)

    @property
    def nest_id(self):
        return self._nest.id
    
    @property
    def random_walk_thought(self) -> RandomWalkThought:
        return self._nested_thoughts['random_walk_thought']
    
    @property
    def go_home_thought(self) -> GoInNestThought:
        return self._nested_thoughts['go_home_thought']
    
    @property
    def found_food_id(self):
        return self._found_food.id if self._found_food else None

    def do_step(self):
        if not self._read_flag('am_i_got_food') and self._food_source_position == None:
            found_food_source_position_data = self._body.memory.read('found_food_source_position')
            empty_food_source_position_data = self._body.memory.read('empty_food_source_position')

            if found_food_source_position_data and found_food_source_position_data != empty_food_source_position_data:
                self._food_source_position = Point(found_food_source_position_data[0], found_food_source_position_data[1])

        if not self._read_flag('am_i_got_food') and self._food_source_position and not self._read_flag('am_i_near_food_source_position'):
            is_walk_done = self._body.step_to(self._food_source_position)
            if (is_walk_done):
                self._write_flag('am_i_near_food_source_position', True)
            return
        
        if not self._read_flag('am_i_got_food') and self._read_flag('am_i_near_food_source_position'):
            food_sources = self._body.look_around_for_food_sources()
            if (len(food_sources) == 0):
                self._clear_knowledge_about_food_source()
                return

            food_source: ItemSource = food_sources[0]
            def on_got_food(edible_item: Item):
                self._body.pick_up_item(edible_item)
                self._write_flag('am_i_got_food', True)
            is_food_in_source = food_source.take_some_item(on_got_food)

            if not is_food_in_source:
                self._clear_knowledge_about_food_source()
                self._body.memory.save('empty_food_source_position', [food_source.position.x, food_source.position.y], 20)
            return

        if not self._read_flag('am_i_got_food'):
            self.random_walk_thought.do_step()
            food_sources = self._body.look_around_for_food_sources()
            if len(food_sources) > 0:
                food_source = food_sources[0]
                self._body.memory.save('found_food_source_position', [food_source.position.x, food_source.position.y])
            return

        if self._read_flag('am_i_got_food') and not self._read_flag('is_go_home_done'):
            self.go_home_thought.do_step()
            self._write_flag('is_go_home_done', self.go_home_thought.is_done)
            return
        
        if (self._read_flag('is_go_home_done') and not self._read_flag('is_food_taken_by_home')):
            self._body.give_food(self._nest)
            self._write_flag('is_food_taken_by_home', True)
            self._found_food = None
            return
        
        if (self._read_flag('is_food_taken_by_home') and not self._read_flag('is_got_out_of_nest')):
            self._body.get_out_of_nest()
            self._write_flag('is_got_out_of_nest', True)
            return

        if (self._read_flag('is_got_out_of_nest')):
            self.done()

    def _clear_knowledge_about_food_source(self):
        self._body.memory.save('found_food_source_position', None)
        self._write_flag('am_i_know_where_food_source', False)
        self._write_flag('am_i_near_food_source_position', False)
        self._food_source_position = None


    def can_be_delayed(self):
        if (self._read_flag('is_pickup_food_done')):
            return False
        else:
            return True
        
    def delay(self):
        self.restart()

    def cancel(self):
        super().cancel()
        if self._body.is_item_picked:
            self._body.drop_picked_food()

    def _on_nest_died(self):
        self.cancel()

    def _on_stop_thinking(self):
        self._nest.events.remove_listener('died', self._on_nest_died)