from ..warrior_ant_body import WarriorAntBody
from core.world.entities.base.live_entity.tasks.task import Task

class PatrollingTerritoryTask(Task):

    def __init__(self, body: WarriorAntBody):
        super().__init__(body)