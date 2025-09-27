from django.core.management.base import BaseCommand
from core.application.engine_start import run_engine
import logging

class Command(BaseCommand):
    help = 'Runs engine'

    def handle(self, *args, **options):
        logger = logging.getLogger('game_logger')
        run_engine(logger)