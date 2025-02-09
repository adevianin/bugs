class GameError(Exception): pass
class AccessDeniedError(GameError): pass
class GameRuleError(GameError): pass
class EntityNotFoundError(GameError): pass
