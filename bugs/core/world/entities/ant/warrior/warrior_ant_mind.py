from ..base.ant_mind import AntMind

class WarrirorAntMind(AntMind):

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
        return self._task_factory.build_patrolling_town_territory_task(self._home_town)

    def _generate_feed_myself_task(self):
        return self._task_factory.build_feed_myself_task(self._home_town, self._memory)