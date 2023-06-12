from ..base.ant_mind import AntMind

class WorkerAntMind(AntMind):

    def _generate_tasks(self):
        super()._generate_tasks()
        if not self._has_tasks_to_do():
            task = self._task_factory.build_collect_food_task(self._home_nest, self._memory)
            self._register_task(task)

    def _generate_feed_myself_task(self):
        return self._task_factory.build_feed_myself_task(self._home_nest, self._memory)