import threading

class IdGenerator():

    def __init__(self, last_used_id: int):
        self._last_used_id = last_used_id
        self._lock = threading.Lock()

    def generate_id(self):
        with self._lock:
            self._last_used_id += 1
            return self._last_used_id