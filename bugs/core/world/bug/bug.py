class Bug:

    def __init__(self, bug_mind, bug_body):
        self._mind = bug_mind
        self._body = bug_body

    def do_step(self):
        self._body.replenish_step_energy()
        self._mind.do_step()
        self._body.emit_change()

    def to_json(self):
        town = self._mind.get_home_town()
        json = self._body.to_json()
        json.update({
            'from_town': town.id
        })
        return json

    def get_body(self):
        return self._body
