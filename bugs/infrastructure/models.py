from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import RegexValidator, MinLengthValidator, MaxLengthValidator, EmailValidator

class User(AbstractUser):
    MAX_USERNAME_LENGTH = 50
    MIN_USERNAME_LENGTH = 4
    USERNAME_REGEX = r'^[a-zA-Z0-9_-]+$'
    MIN_EMAIL_LENGTH = 4
    MAX_EMAIL_LENGTH = 254
    EMAIL_REGEX=r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'

    is_email_verified = models.BooleanField(default=False)
    username = models.CharField(
        max_length=MAX_USERNAME_LENGTH,
        unique=True,
        validators=[
            MinLengthValidator(MIN_USERNAME_LENGTH),
            MaxLengthValidator(MAX_USERNAME_LENGTH),
            RegexValidator(
                regex=USERNAME_REGEX,
                message="Username can only contain letters, numbers, underscores, and hyphens.",
                code='invalid_chars'
            )
        ],
        error_messages={
            'unique': "A user with this username already exists.",
        }
    )
    email = models.CharField(
        max_length=MAX_EMAIL_LENGTH,
        unique=True,
        validators=[
            MinLengthValidator(MIN_EMAIL_LENGTH),
            MaxLengthValidator(MAX_EMAIL_LENGTH),
            RegexValidator(
                regex=EMAIL_REGEX,
                message="invalid email format",
                code='invalid_chars'
            )
        ],
        error_messages={
            'unique': "A user with this email already exists.",
        }
    )

    def is_social_account(self) -> bool:
        return not self.has_usable_password()
    
    def get_general_data(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'isEmailVerified': self.is_email_verified,
            'isSocialAccount': self.is_social_account()
        }

class World(models.Model):
    state = models.JSONField()
