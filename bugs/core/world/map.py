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
