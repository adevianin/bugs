from core.world.entities.base.live_entity.tasks.task import Task
from ..body import BugBody
from core.world.entities.town import Town

class GoHomeToEatTask(Task):

    def __init__(self, body: BugBody, home: Town):
        super().__init__(body)
        self._home = home

        self._is_at_home = False

    def can_be_delayed(self):
        return False

    def do_step(self):
        self._is_at_home = self._body.step_to(self._home.position)
        if (self._is_at_home):
            needed_calories = self._body.calc_how_much_calories_is_need()
            calories = self._home.give_calories(needed_calories)
            self._body.eat_calories(calories)
            self.mark_as_done()