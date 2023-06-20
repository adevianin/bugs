from core.world.entities.base.live_entity.body import Body
from core.world.entities.map import Map

from core.world.entities.nest.nest import Nest

from core.world.entities.base.live_entity.thoughts.go_in_nest import GoInNestThought

class ThoughtFactory:

    def __init__(self, map: Map) -> None:
        self._map = map

    def build_thougth_from_json(self, body: Body, thought_json: dict):
        match thought_json['type']:
            case 'go_in_nest':
                nest = self._map.get_entity_by_id(thought_json['nest_id'])
                return self.build_go_in_nest_thought(body=body, nest=nest, flags=thought_json['flags'], sayback=thought_json['sayback'])

    def build_go_in_nest_thought(self, body: Body, nest: Nest, flags: dict = None, sayback: str = None):
        return GoInNestThought(body=body, map=self._map, flags=flags, sayback=sayback, nest=nest)
    
    # def build_walk_to_thought(self, position: Point, sayback: str = None):
    #     return WalkToThought(body=self._body, map=self._map, flags={}, position=position, sayback=sayback)
    
    # def build_searching_walk_thought(self, search_near_point: Point, search_radius: int) -> SearchingWalkThought:
    #     return SearchingWalkThought(self._body, self._map, search_near_point, search_radius)

    # def build_find_entity_by_type_thought(self, entity_type: EntityTypes, search_near_point: Point, search_radius: int) -> FindEntityByTypeThought:
    #     searching_walk_subthought = self.build_searching_walk_thought(search_near_point, search_radius)
    #     return FindEntityByTypeThought(self._body, self._map, entity_type, searching_walk_subthought)

    # def build_collect_food_thought(self, nest: Nest, memory: Memory):
    #     find_food_thought = self.build_find_food_thought(memory, nest.position, nest.area)
    #     go_gome_thought = self.build_go_in_nest_thought(nest)
    #     return CollectFoodThought(self._body, self._map, nest, find_food_thought, go_gome_thought)
    
    # def build_find_food_thought(self, memory: Memory, search_near_point: Point, search_radius: int):
    #     searching_walk_subthought = self.build_searching_walk_thought(search_near_point, search_radius)
    #     return FindFoodThought(self._body, self._map, memory, searching_walk_subthought)
    
    # def build_feed_myself_thought(self, home: Nest, memory: Memory):
    #     find_food_thought = self.build_find_food_thought(memory, home.position, home.area)
    #     go_gome_thought = self.build_go_in_nest_thought(home)
    #     return FeedMyselfThought(self._body, self._map, home, find_food_thought, go_gome_thought)

    # def build_prepare_for_operation_thought(self, home: Nest, memory: Memory, assemble_point: Point, sayback: str):
    #     feed_myself_thought = self.build_feed_myself_thought(home, memory)
    #     return PrepareForOperationThought(self._body, self._map, feed_myself_thought, assemble_point, sayback)
    
    # def build_build_new_nest_thought(self, new_nest: Nest, sayback: str):
    #     return BuildNestThought(body=self._body, new_nest=new_nest, sayback=sayback)
    
    # def build_patrolling_nest_territory_thought(self, nest: Nest):
    #     searching_thought = self.build_searching_walk_thought(nest.position, nest.area)
    #     return PatrollingTerritoryThought(self._body, self._map, searching_thought)

    