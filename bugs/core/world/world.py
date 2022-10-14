import json

class World:
    _instance = None

    @classmethod
    def get_instance(cls):
        if World._instance == None: 
            World()
        return World._instance

    def __init__(self):
        if World._instance != None:
            raise Exception('world is singleton')
        else:
            World._instance = self
            self.is_running = False
            self.bugs = []

    def run(self):
        if self.is_running == True: 
            raise Exception('world can be runned once')

        world_json = json.loads(self._dataRepo.get())

        self._build_bugs(world_json['bugs'])

        self.is_running = True

    def stop(self):
        print('world is stopped')
        

    def inject_data_repository(self, repo):
        self._dataRepo = repo

    def inject_world_factory(self, factory):
        self._worldFactory = factory

    def _build_bugs(self, bugsJson):
        for bugJson in bugsJson:
            bug = self._worldFactory.buildBug(bugJson['id'], bugJson['pos'])
            self.bugs.append(bug)

    def toJSON(self):
        bugsJson = []
        for bug in self.bugs:
            bugsJson.append(bug.toJSON())

        return {
            'bugs': bugsJson
        }