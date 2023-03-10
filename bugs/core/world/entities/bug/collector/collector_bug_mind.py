from ..base.bug_mind import BugMind

class CollectorBugMind(BugMind):

    def _do_step_activity(self):
        if (self._body.check_am_i_hungry()):
            if (self._has_tasks_to_do()):
                if (self._get_current_task().can_be_delayed()):
                    self._register_task(self._generate_feed_myself_task(), True)
            else:
                self._register_task(self._generate_feed_myself_task())

        if not self._has_tasks_to_do():
            self._register_task(self._generate_task())

        self._get_current_task().do_step()

    def _generate_task(self):
        # return self._task_factory.build_find_food_task(self._memory, self._home_town.position, self._home_town.area)
        return self._task_factory.build_collect_food_task(self._home_town, self._memory)
        # return self._task_factory.build_searching_walk_task(self._home_town.position, self._home_town.area)

    def _generate_feed_myself_task(self):
        return self._task_factory.build_go_home_to_eat_task(self._home_town)