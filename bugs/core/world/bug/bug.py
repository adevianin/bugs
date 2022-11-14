class Bug:

    def __init__(self, main_event_bus, bug_mind, bug_body):
        self._mind = bug_mind
        self._body = bug_body
        self._main_event_bus = main_event_bus

    def do_step(self):
        self._body.replenish_step_energy()
        self._mind.do_step()
        self._emit_change()

    def to_json(self):
        return self._body.to_json()

    def get_body(self):
        return self._body

    def _emit_change(self):
        self._main_event_bus.emit('entity_changed', self)

