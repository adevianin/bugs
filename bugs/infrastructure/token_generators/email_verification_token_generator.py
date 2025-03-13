from django.core import signing
from infrastructure.models import User

class EmailVerificationToken:
    SALT = 'ec'
    MAX_AGE = 60 * 60 * 24

    @staticmethod
    def generate(user: User):
        data = {'i': user.pk, 'e': user.email}
        return signing.dumps(data, salt=EmailVerificationToken.SALT)

    @staticmethod
    def validate(user: User, token):
        try:
            data = signing.loads(token, salt=EmailVerificationToken.SALT, max_age=EmailVerificationToken.MAX_AGE)
            if data.get('i') == user.pk and data.get('e') == user.email:
                return True
            
            return False
        except signing.SignatureExpired:
            return False
        except signing.BadSignature:
            return False