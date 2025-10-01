class EngineError(Exception): pass
class EngineResponseTimeoutError(EngineError): pass
class EngineAdminCommandError(EngineError): pass
class EnginePlayerCommandError(EngineError): pass
class EngineStateConflictError(EngineError):
    def __init__(self, step):
        super().__init__('engine state conflict error')
        self.step = step
