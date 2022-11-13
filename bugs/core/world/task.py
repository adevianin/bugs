class Task:

    @staticmethod
    def create(type, params):
        return Task(type, params)
    
    def __init__(self, type, params):
        self._type = type
        self._params = params
        self._is_done = False

    def get_type(self):
        return self._type

    def get_params(self):
        return self._params

    def is_done(self):
        return self._is_done

    def mark_as_done(self):
        self._is_done = True
    
