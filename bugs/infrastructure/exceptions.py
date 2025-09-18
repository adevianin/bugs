class DailyEmailLimitExceededException(Exception): pass

class IncorrectPasswordException(Exception): pass
class IncorrectNewPasswordException(Exception): pass
class SocialAccountException(Exception): pass
class UserDoesNotExistException(Exception): pass
class EmailTakenException(Exception): pass
class EmailFormatException(Exception): pass
class UsernameTakenException(Exception): pass
class UsernameFormatException(Exception): pass
class Base64DecodingException(Exception): pass
class InvalidTokenException(Exception): pass
class InvalidAccountException(Exception): pass
class GoogleAuthException(Exception): pass