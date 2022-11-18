from .base_task import BaseTask

class EatTask(BaseTask): 

    def __init__(self, task_factory, bug_body, food_entity):
        super().__init__(task_factory, bug_body)
        self._food_entity = food_entity

    def do_step(self):
        self._bug_body.eat(self._food_entity)

        if self._food_entity.is_eaten():
            self.mark_as_done()

        