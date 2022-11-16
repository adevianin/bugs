class Map:

    def __init__(self, size):
        self._size = size
        self._bugs = []

    def add_bug(self, bug):
        self._bugs.append(bug)

    def get_bugs(self):
        return self._bugs

    def get_size(self):
        return self._size

    def validate_point(self, point):
        is_x_valid = point.x >= 0 and point.x <= self._size.width
        is_y_valid = point.y >= 0 and point.y <= self._size.height

        return is_x_valid and is_y_valid
