import threading

class IdGenerator():

    _global_generator: 'IdGenerator' = None

    @classmethod
    def generate_id(cls):
        if not cls._global_generator:
            raise Exception('global generator is not setted')
        
        return cls._global_generator.generate_next_id()
    
    @classmethod
    def set_global_generator(cls, id_generator: 'IdGenerator'):
        cls._global_generator = id_generator
        
    def __init__(self, last_used_id: int):
        self._last_used_id = last_used_id
        self._lock = threading.Lock()

    @property
    def last_used_id(self):
        return self._last_used_id

    def generate_next_id(self):
        with self._lock:
            self._last_used_id += 1
            return self._last_used_id
        