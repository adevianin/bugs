from core.world.utils.point import Point

class PrebornEntity():

    def __init__(self, position: Point) -> None:
        self._position = position

    @property
    def position(self):
        return self._position