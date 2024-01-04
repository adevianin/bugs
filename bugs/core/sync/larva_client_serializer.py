from core.world.entities.ant.base.larva import Larva

class LarvaClientSerializer():

    def serialize(self, larva: Larva):
        return {
            'ant_type': larva.ant_type,
            'progress': larva.progress
        }