class IdGenerator:
    def __init__(self, last_id: int):
        self._last_id = last_id

    def generate_id(self):
        self._last_id += 1
        return self._last_id
