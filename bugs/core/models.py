from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    
    def get_general_data(self):
        return {
            'id': self.id,
            'username': self.username,
        }

# Create your models here.
