from core.world.entities.colony.colonies.ant_colony.operation.base.fight.fight import Fight

class FightSerializer():

    def serialize(self, fight: Fight):
        return {
            'ants_ids': fight.ants_ids,
            'is_started': fight.is_started
        }