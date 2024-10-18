from core.world.entities.thought.thought import Thought
from core.world.entities.thought.thought_types import ThoughtTypes
from core.world.entities.ant.base.ant_body import AntBody
from core.world.utils.point import Point
from core.world.entities.base.entity_types import EntityTypes

class GetStashedItemBack(Thought):

    _body: AntBody

    def __init__(self, flags: dict = None, sayback: str = None):
        super().__init__(type=ThoughtTypes.GET_STAHED_ITEM_BACK, flags=flags, sayback=sayback)

    def do_step(self):
        stashed_item_data = self._body.memory.read('stashed_item')

        if not self._read_flag('am_i_near_item_pos'):
            stashed_item_coords = stashed_item_data['position']
            stashed_item_pos = Point(stashed_item_coords[0], stashed_item_coords[1])
            is_walk_done = self._body.step_to(stashed_item_pos)
            if (is_walk_done):
                self._write_flag('am_i_near_item_pos', True)
            return
        
        if self._read_flag('am_i_near_item_pos'):
            items = self._body.visual_sensor.get_nearby_entities(EntityTypes.ITEM, lambda item: item.id == stashed_item_data['item_id'])
            if len(items) == 1:
                self._body.pick_up_item(items[0])
            self.done()
    