from core.world.utils.event_emiter import EventEmitter
from core.world.utils.point import Point
from .build_new_sub_nest_operation import BuildNewSubNestOperation
from .destroy_nest_operation import DestroyNestOperation
from typing import List
from core.world.entities.ant.base.ant import Ant
from core.world.entities.nest.nest import Nest
from core.world.entities.colony.colonies.ant_colony.formation.formation_factory import FormationFactory
from core.world.entities.colony.colonies.ant_colony.operation.bring_item_to_nest_operation import BringItemToNestOperation
from core.world.entities.item.items.base.item import Item
from core.world.entities.colony.colonies.ant_colony.operation.pillage_nest_operation import PillageNestOperation
from core.world.entities.colony.colonies.ant_colony.formation.base.formation_manager import FormationManager
from core.world.entities.colony.colonies.ant_colony.formation.bring_item_formation import BringItemFormation
from core.world.entities.colony.colonies.ant_colony.formation.attack_formation import AttackFormation

class OperationFactory():

    def __init__(self, formation_factory: FormationFactory):
        self._formation_factory = formation_factory

    def build_build_new_sub_nest_operation(self, building_site: Point, workers_count: int, id: int = None, hired_ants: List[Ant] = None, flags: dict = None):
        formation_manager = self._build_formation_manager()
        return BuildNewSubNestOperation(EventEmitter(), formation_manager, id, hired_ants, flags, building_site, workers_count)
    
    def build_destroy_nest_operation(self, nest: Nest, warriors_count: int, id: int = None, hired_ants: List[Ant] = None, flags: dict = None, attack_formation: AttackFormation = None):
        formation_manager = self._build_formation_manager()
        return DestroyNestOperation(EventEmitter(), formation_manager, id, hired_ants, flags, nest, warriors_count, attack_formation)
    
    def build_bring_item_to_nest_operation(self, nest: Nest, item: Item, id: int = None, hired_ants: List[Ant] = None, flags: dict = None, bring_item_formation: BringItemFormation = None):
        formation_manager = self._build_formation_manager()
        return BringItemToNestOperation(EventEmitter(), formation_manager, id, hired_ants, flags, nest, item, bring_item_formation)
    
    def build_pillage_nest_operation(self, nest_to_pillage: Nest, nest_for_loot: Nest, workers_count: int, warriors_count: int, id: int = None, hired_ants: List[Ant] = None, flags: dict = None, attack_formation: AttackFormation = None, go_home_formation: AttackFormation = None):
        formation_manager = self._build_formation_manager()
        return PillageNestOperation(EventEmitter(), formation_manager, id, hired_ants, flags, nest_to_pillage, nest_for_loot, workers_count, warriors_count, attack_formation, go_home_formation)
    
    def _build_formation_manager(self) -> FormationManager:
        return FormationManager.build_formation_manager(self._formation_factory)