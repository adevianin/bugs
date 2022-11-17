class Bug:

    def __init__(self, bug_mind, bug_body):
        self._mind = bug_mind
        self._body = bug_body

    def do_step(self):
        self._body.replenish_step_energy()
        self._mind.do_step()
        self._body.emit_change()

    def to_json(self):
        return self._body.to_json()

    def get_body(self):
        return self._body
