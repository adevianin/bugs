class BaseTask:

    def __init__(self, bug_body):
        self._bug_body = bug_body
        self._is_done = False

    def is_done(self):
        return self._is_done

    def mark_as_done(self):
        self._is_done = True
    
    def do_step(self):
        pass