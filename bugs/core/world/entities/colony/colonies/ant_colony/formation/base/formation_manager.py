from core.world.entities.colony.colonies.ant_colony.formation.formation_factory import FormationFactory
from core.world.utils.point import Point
from core.world.entities.item.items.base.item import Item
from typing import List
from .base_formation import BaseFormation

class FormationManager():

    @classmethod
    def build_formation_manager(cls, formation_factory: FormationFactory) -> 'FormationManager':
        return FormationManager(formation_factory)

    def __init__(self, formation_factory: FormationFactory):
        self._formation_factory = formation_factory
        self._formations: List[BaseFormation] = []

    @property
    def formations(self):
        return self._formations.copy()

    def clear(self):
        for formation in self._formations:
            if not formation.is_destroyed:
                formation.destroy()

        self._formations = []

    def prepare_bring_item_formation(self, units, dest_point: Point, item: Item) -> BaseFormation:
        formation = self._formation_factory.build_bring_item_formation(units, dest_point, False, item)
        self._formations.append(formation)
        return formation
    
    def prepare_attack_formation(self, units, dest_point: Point) -> BaseFormation:
        formation = self._formation_factory.build_attack_formation(units, dest_point, False)
        self._formations.append(formation)
        return formation
    
    def prepare_convoy_formation(self, units, dest_point: Point) -> BaseFormation:
        formation = self._formation_factory.build_convoy_formation(units, dest_point, False)
        self._formations.append(formation)
        return formation
    