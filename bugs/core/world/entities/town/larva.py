from core.world.entities.ant.base.ant_types import AntTypes

class Larva:

    def __init__(self, ant_type: AntTypes, progress: int):
        self._ant_type = ant_type
        self._progress = progress

    def to_json(self):
        return {
            'ant_type': self._ant_type,
            'progress': self._progress
        }