import threading

class IdGenerator():

    _lock = threading.Lock()
    _instance = None
    last_used_id = 0
    _is_inited = False

    @classmethod
    def init(cls, last_used_id: int):
        cls.last_used_id = last_used_id
        cls._is_inited = True
    
    @classmethod
    def generate_id(cls):
        if not cls._is_inited:
            raise Exception('generator is not inited')
        
        with cls._lock:
            cls.last_used_id += 1
            return cls.last_used_id
        
    def __new__(cls, *args, **kwargs):
        raise Exception('instance cant be created')
