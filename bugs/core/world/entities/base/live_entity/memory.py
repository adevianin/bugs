class Memory():

    def __init__(self, data = None):
        self._data = data or {}

    @property
    def data(self):
        return self._data

    def remember(self, memory_name: str, data):
        self._data[memory_name] = data
    
    def read(self, memory_name: str):
        if memory_name in self._data:
            return self._data[memory_name]
        else:
            return None
        