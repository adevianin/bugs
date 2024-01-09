from core.world.entities.world.world import World

class NuptialFlightService():

    def set_world(self, world: World):
        self._world = world

    def generate_nuptial_males(self, user_id: int):
        nuptial_environment = self._world.get_nuptial_environment_by_owner(user_id)
        nuptial_environment.generate_males()
        