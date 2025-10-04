from django.apps import AppConfig
import sys

class MainConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'main'

    def ready(self):

        ignored_commands = [
            'makemigrations', 
            'migrate', 
            'build_frontend',
            'createsuperuser'
        ]

        if len(sys.argv) > 1 and sys.argv[1] in ignored_commands:
            return
        
        from .init import init
        init()
            
