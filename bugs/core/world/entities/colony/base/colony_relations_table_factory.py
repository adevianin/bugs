from core.world.utils.event_emiter import EventEmitter
from .colony_relations_table import ColonyRelationsTable
from typing import Dict

class ColonyRelationsTableFactory():

    def __init__(self, event_bus: EventEmitter):
        self._event_bus = event_bus

    def build_relations_table(self, relations_data: Dict):
        return ColonyRelationsTable(self._event_bus, relations_data)