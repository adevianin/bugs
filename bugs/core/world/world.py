class World:

    def __init__(self, bugs):
        World._instance = self
        self.bugs = bugs

    def run(self):
        self.bugs[0].plan_jump()

    def stop(self):
        print('world is stopped')
        
    def toJSON(self):
        bugs_json = []
        for bug in self.bugs:
            bugs_json.append(bug.toJSON())

        return {
            'bugs': bugs_json
        }