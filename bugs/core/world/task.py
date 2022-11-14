class Task:

    @staticmethod
    def create(type, params):
        return Task(type, params)
    
    def __init__(self, type, params):
        self._type = type
        self._params = params
        self._is_done = False
        self._working_data = {}

    def get_type(self):
        return self._type

    def get_param(self, key):
        return self._params[key] if key in self._params else None

    def set_param(self, key, value):
        self._params[key] = value

    def is_done(self):
        return self._is_done

    def mark_as_done(self):
        self._is_done = True

    def set_working_data(self, key, value):
        self._working_data[key] = value
    
    def get_working_data(self, key):
        return self._working_data[key] if key in self._working_data else None
    
