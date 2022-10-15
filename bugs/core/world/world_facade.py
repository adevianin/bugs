class WorldFacade:
    _instance = None

    @classmethod
    def get_instance(cls):
        if WorldFacade._instance == None: 
            WorldFacade()
        return WorldFacade._instance

    def __init__(self):
        if WorldFacade._instance != None:
            raise Exception('WorldFacade is singleton')
        else:
            WorldFacade._instance = self

    def run(self):
        world_json = self._data_repo.get()
        self._world = self._world_factory.build_world(world_json)
        self._world.run()

    def get_world(self):
        return self._world

    def get_event_bus(self):
        return self.main_event_bus

    def inject_data_repository(self, repo):
        self._data_repo = repo

    def inject_world_factory(self, factory):
        self._world_factory = factory

    def inject_main_bus(self, main_event_bus):
        self.main_event_bus = main_event_bus

        