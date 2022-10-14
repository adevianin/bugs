from .entity import Entity
import threading

class Bug(Entity):
    def __init__(self, main_event_bus, id, pos):
        super().__init__(main_event_bus, id, pos)
        self.is_jump_right = True


    def plan_jump(self):
        t = threading.Timer(3, self._jump)
        t.start()

    def toJSON(self):
        json = super().toJSON()
        json.update({

        })
        return json

    def _jump(self):
        if self.is_jump_right:
            self.set_position({
                'x': self.pos['x'] + 20,
                'y': self.pos['y']
            })
        else:
            self.set_position({
                'x': self.pos['x'] - 20,
                'y': self.pos['y']
            })

        self.is_jump_right = not self.is_jump_right
        self.plan_jump()
