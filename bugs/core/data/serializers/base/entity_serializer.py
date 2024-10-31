from core.world.entities.base.entity import Entity

class EntitySerializer():

    def serialize(self, entity: Entity):
        json = {}
        json.update({
            'id': entity.id,
            'type': entity.type,
            'from_colony_id': entity.from_colony_id,
            'owner_id': entity.owner_id,
            'is_removal_blocked': entity.is_removal_blocked,
            'hp': entity.body.hp,
            'position': entity.position,
            'angle': entity.body.angle
        })

        return json