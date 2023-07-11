from django.apps import AppConfig
from django.conf import settings
import sys

class CoreConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'core'

    def ready(self):
        if 'runserver' in sys.argv:
            from .start import start
            start()
            


           
            
