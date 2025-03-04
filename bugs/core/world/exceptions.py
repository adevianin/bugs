class GameError(Exception): pass
class AccessDeniedError(GameError): pass
class GameRuleError(GameError): pass
class EntityNotFoundError(GameError): pass

class StateConflictError(GameError):
    def __init__(self, message, step):
        super().__init__(message)
        self._step = step

    def to_dict(self):
        return {
            'step': self._step
        }

