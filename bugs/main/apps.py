from django.apps import AppConfig
import sys

class MainConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'main'

    def ready(self):

        if 'manage.py' in sys.argv[0]:
            if len(sys.argv) > 1 and sys.argv[1] != 'runserver':
                return
        
        from .init import init
        init()
            
