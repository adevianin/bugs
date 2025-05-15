from django.core.management.base import BaseCommand
from bugs.settings import BASE_DIR
import os
import subprocess

class Command(BaseCommand):
    help = "Builds frontend app"

    def add_arguments(self, parser):
        parser.add_argument('--prod', action='store_true', help='Build for production mode')
        parser.add_argument('--inst_deps', action='store_true', help='Intall dependencies')

    def handle(self, *args, **options):
        mode = 'production' if options.get('prod') else 'development'

        client_dir = os.path.join(BASE_DIR, 'client')

        env = {
            **os.environ,
            'NODE_ENV': mode,
        }

        if options.get('inst_deps'):
            self.stdout.write(self.style.WARNING('Installing frontend dependencies...'))
            subprocess.run(['npm', 'install'], cwd=client_dir, env=env, check=True)

        self.stdout.write(self.style.WARNING(f'Building frontend in mode = "{mode}"...'))
        subprocess.run(['npx', 'webpack'], cwd=client_dir, env=env, check=True)

        self.stdout.write(self.style.SUCCESS(f'Frontend is built in mode = "{mode}"'))