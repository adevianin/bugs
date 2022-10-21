class World:

    def __init__(self, bugs):
        World._instance = self
        self.bugs = bugs

    def run(self):
        # self.bugs[0].plan_jump()
        bug = self.bugs[0]
        bug.walk_path([
            {'x': 90, 'y': 40},
            {'x': 90, 'y': 90},
            {'x': 150, 'y': 150},
            {'x': 250, 'y': 150},
        ])

        bug = self.bugs[1]
        bug.walk_path([
            {'x': 90, 'y': 40},
            {'x': 90, 'y': 90},
            {'x': 150, 'y': 150},
            {'x': 250, 'y': 150},
        ])

        bug.events.on('arrived', self.on_arrived)

    def on_arrived(self):
        print('arrived1')

    def stop(self):
        print('world is stopped')
        
    def to_json(self):
        bugs_json = []
        for bug in self.bugs:
            bugs_json.append(bug.to_json())

        return {
            'bugs': bugs_json
        }