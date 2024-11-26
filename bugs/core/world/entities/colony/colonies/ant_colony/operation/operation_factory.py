from core.world.utils.event_emiter import EventEmitter
from core.world.utils.point import Point
from .build_new_sub_nest_operation import BuildNewSubNestOperation
from .destroy_nest_operation import DestroyNestOperation
from typing import List
from core.world.entities.ant.base.ant import Ant
from core.world.entities.nest.nest import Nest
from core.world.entities.colony.colonies.ant_colony.operation.base.formation.formation_factory import FormationFactory
from core.world.entities.colony.colonies.ant_colony.operation.bring_item_to_nest_operation import BringItemToNestOperation
from core.world.entities.item.items.base.item import Item
from core.world.entities.colony.colonies.ant_colony.operation.pillage_nest_operation import PillageNestOperation
from core.world.entities.colony.colonies.ant_colony.operation.base.formation.base.base_formation import BaseFormation
from core.world.entities.colony.colonies.ant_colony.operation.transport_food_operation import TransportFoodOperation
from .build_fortification_operation import BuildFortificationOperation
from .base.fight.fight_factory import FightFactory
from .base.fight.fight import Fight

class OperationFactory():

    def __init__(self, event_bus: EventEmitter, formation_factory: FormationFactory, fight_factory: FightFactory):
        self._event_bus = event_bus
        self._formation_factory = formation_factory
        self._fight_factory = fight_factory

    def build_build_new_sub_nest_operation(self, building_site: Point, worker_vacancies_count: int, warrior_vacancies_count: int, building_nest: Nest = None, id: int = None, hired_ants: List[Ant] = None, flags: dict = None, formation: BaseFormation = None, fight: Fight = None):
        return BuildNewSubNestOperation(self._event_bus, EventEmitter(), self._formation_factory, self._fight_factory, id, hired_ants, flags, formation, fight, worker_vacancies_count, warrior_vacancies_count, building_site, building_nest)
    
    def build_destroy_nest_operation(self, nest: Nest, worker_vacancies_count: int, warrior_vacancies_count: int, id: int = None, hired_ants: List[Ant] = None, flags: dict = None, formation: BaseFormation = None, fight: Fight = None):
        return DestroyNestOperation(self._event_bus, EventEmitter(), self._formation_factory, self._fight_factory, id, hired_ants, flags, formation, fight, worker_vacancies_count, warrior_vacancies_count, nest)
    
    def build_bring_item_to_nest_operation(self, nest: Nest, item: Item, id: int = None, hired_ants: List[Ant] = None, flags: dict = None, formation: BaseFormation = None, fight: Fight = None):
        return BringItemToNestOperation(self._event_bus, EventEmitter(), self._formation_factory, self._fight_factory, id, hired_ants, flags, formation, fight, nest, item)
    
    def build_pillage_nest_operation(self, nest_to_pillage: Nest, nest_for_loot: Nest, worker_vacancies_count: int, warrior_vacancies_count: int, id: int = None, hired_ants: List[Ant] = None, flags: dict = None, formation: BaseFormation = None, fight: Fight = None):
        return PillageNestOperation(self._event_bus, EventEmitter(), self._formation_factory, self._fight_factory, id, hired_ants, flags, formation, fight, worker_vacancies_count, warrior_vacancies_count, nest_to_pillage, nest_for_loot)
    
    def build_transport_food_operation(self, nest_from: Nest, nest_to: Nest, worker_vacancies_count: int, warrior_vacancies_count: int, id: int = None, hired_ants: List[Ant] = None, flags: dict = None, formation: BaseFormation = None, fight: Fight = None):
        return TransportFoodOperation(self._event_bus, EventEmitter(), self._formation_factory, self._fight_factory, id, hired_ants, flags, formation, fight, worker_vacancies_count, warrior_vacancies_count, nest_from, nest_to)
    
    def build_build_fortification(self, nest: Nest, workers_count: int, id: int = None, hired_ants: List[Ant] = None, flags: dict = None, formation: BaseFormation = None, fight: Fight = None):
        return BuildFortificationOperation(self._event_bus, EventEmitter(), self._formation_factory, self._fight_factory, id, hired_ants, flags, formation, fight, nest, workers_count)