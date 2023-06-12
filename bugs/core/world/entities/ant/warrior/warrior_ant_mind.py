from ..base.ant_mind import AntMind

class WarrirorAntMind(AntMind):

    def _generate_tasks(self):
        super()._generate_tasks()
        if not self._has_tasks_to_do():
            task = self._task_factory.build_patrolling_nest_territory_task(self._home_nest)
            self._register_task(task)

    def _generate_feed_myself_task(self):
        return self._task_factory.build_feed_myself_task(self._home_nest, self._memory)