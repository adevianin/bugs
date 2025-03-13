from django.core import signing
from infrastructure.models import User

class ResetPasswordTokenGenerator:
    SALT = 'rp'
    MAX_AGE = 60 * 60 * 24

    @staticmethod
    def generate(user: User):
        data = {
            'i': user.pk, 
            'e': user.email, 
            'l': int(user.last_login.timestamp()) if user.last_login else 0 
        }
        return signing.dumps(data, salt=ResetPasswordTokenGenerator.SALT)

    @staticmethod
    def validate(user: User, token):
        try:
            data = signing.loads(token, salt=ResetPasswordTokenGenerator.SALT, max_age=ResetPasswordTokenGenerator.MAX_AGE)

            required_keys = {'i', 'e', 'l'}
            if not required_keys.issubset(data):
                return False
            
            if data.get('i') != user.pk:
                return False
            
            if data.get('e') != user.email:
                return False
            
            token_last_login = data.get('l')
            user_last_login = int(user.last_login.timestamp()) if user.last_login else 0
            if user_last_login != token_last_login:
                return False

            return True
        except signing.SignatureExpired:
            return False
        except signing.BadSignature:
            return False