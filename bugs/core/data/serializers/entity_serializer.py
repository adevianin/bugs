from core.world.entities.base.entity import Entity

class EntitySerializer():

    def serialize(self, entity: Entity):
        json = {}
        json.update({
            'id': entity.id,
            'type': entity.type,
            'from_colony': entity.from_colony
        })

        return json