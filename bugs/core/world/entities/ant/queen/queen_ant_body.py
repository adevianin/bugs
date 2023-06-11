from ..base.ant_body import AntBody
from core.world.entities.town.town import Town

class QueenAntBody(AntBody):

    def build_town(self, town: Town):
        return town.build()
