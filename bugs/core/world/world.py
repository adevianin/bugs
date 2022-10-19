class World:

    def __init__(self, bugs):
        World._instance = self
        self.bugs = bugs

    def run(self):
        # self.bugs[0].plan_jump()
        bug = self.bugs[0]
        bug.walk_to(90, 40)

        bug.events.once('arrived', self.on_arrived)

    def on_arrived(self):
        print('arrived')

    def stop(self):
        print('world is stopped')
        
    def to_json(self):
        bugs_json = []
        for bug in self.bugs:
            bugs_json.append(bug.to_json())

        return {
            'bugs': bugs_json
        }