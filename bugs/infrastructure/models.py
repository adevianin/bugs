from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import RegexValidator, MinLengthValidator, MaxLengthValidator, EmailValidator
from core.world.settings import MAX_USERNAME_LENGTH, MIN_USERNAME_LENGTH

class User(AbstractUser):
    is_email_verified = models.BooleanField(default=False)
    username = models.CharField(
        max_length=MAX_USERNAME_LENGTH,
        unique=True,
        validators=[
            MinLengthValidator(MIN_USERNAME_LENGTH),
            MaxLengthValidator(MAX_USERNAME_LENGTH),
            RegexValidator(
                regex=r'^[a-zA-Z0-9_-]+$',
                message="Username can only contain letters, numbers, underscores, and hyphens."
            )
        ],
        error_messages={
            'unique': "A user with this username already exists.",
        }
    )
    email = models.EmailField(
        unique=True,
        validators=[EmailValidator()],
        error_messages={
            'unique': "A user with this email already exists.",
        }
    )
    
    def get_general_data(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email
        }

class World(models.Model):
    state = models.JSONField()
