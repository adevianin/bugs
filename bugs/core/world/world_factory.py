from .bug import Bug
from .world import World
from pyee.base import EventEmitter
from .point import Point
from .block import Block
from .size import Size
from .map import Map

class WorldFactory:

    def __init__(self, main_event_bus):
        self.main_event_bus = main_event_bus

    def build_world(self, world_json):
        map_width = world_json["map"]["size"]["width"]
        map_height = world_json["map"]["size"]["height"]
        map = Map(Size(map_width, map_height))

        for bug_json in world_json['bugs']:
            bug = self.build_bug(bug_json, map)
            map.add_bug(bug)

        for block_json in world_json['blocks']:
            block = self.build_block(block_json)
            map.add_block(block)

        world = World(map)

        return world

    def build_bug(self, bug_json, map):
        events = EventEmitter()
        pos = Point(bug_json['pos']['x'], bug_json['pos']['y'])
        return Bug(map, events, self.main_event_bus, bug_json['id'], pos)

    def build_block(self, block_json):
        pos = Point(block_json["x"], block_json["y"])
        size = Size(block_json["width"], block_json["height"])
        return Block(block_json["id"], pos, size)
