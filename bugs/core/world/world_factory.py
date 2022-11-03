from .bug import Bug
from .world import World
from pyee.base import EventEmitter
from .point import Point
from .block import Block
from .size import Size

class WorldFactory:

    def __init__(self, main_event_bus):
        self.main_event_bus = main_event_bus

    def build_world(self, world_json):
        inited_bugs = []
        for bug_json in world_json['bugs']:
            bug = self.build_bug(bug_json)
            inited_bugs.append(bug)

        inited_blocks = []
        for block_json in world_json['blocks']:
            block = self.build_block(block_json)
            inited_blocks.append(block)

        world = World(inited_bugs, inited_blocks)

        return world

    def build_bug(self, bug_json):
        events = EventEmitter()
        pos = Point(bug_json['pos']['x'], bug_json['pos']['y'])
        return Bug(events, self.main_event_bus, bug_json['id'], pos)

    def build_block(self, block_json):
        pos = Point(block_json["x"], block_json["y"])
        size = Size(block_json["width"], block_json["height"])
        return Block(block_json["id"], pos, size)
