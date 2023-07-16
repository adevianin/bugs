import threading

class IdGenerator():

    @classmethod
    def build_id_generator(cls, last_used_id: int):
        return IdGenerator(last_used_id)

    def __init__(self, last_id: int):
        self._lock = threading.Lock()
        self._last_used_id = last_id

    @property
    def last_used_id(self):
        return self._last_used_id
    
    def generate_id(self):
        with self._lock:
            self._last_used_id += 1
            return self._last_used_id