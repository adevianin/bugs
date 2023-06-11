from ..base.ant_mind import AntMind
from core.world.entities.town.town import Town

class QueenAntMind(AntMind):

    def build_new_town(self, new_town: Town):
        task = self._task_factory.build_build_new_town_task(new_town)
        self._register_task(task)
        return task

    def _generate_tasks(self):
        super()._generate_tasks()
        # if not self._has_tasks_to_do():
        #     task = self._task_factory.build_collect_food_task(self._home_town, self._memory)
        #     self._register_task(task)

    def _generate_feed_myself_task(self):
        return self._task_factory.build_feed_myself_task(self._home_town, self._memory)
