from core.world.entities.ant.ant_factory import AntFactory
from core.world.utils.point import Point
from core.world.entities.ant.base.ant_types import AntTypes
from core.world.entities.base.entity_collection import EntityCollection
from .json_stats_factory import JsonStatsFactory
from .json_genome_factory import JsonGenomeFactory

class JsonAntFactory():

    def __init__(self, json_stats_factory: JsonStatsFactory, json_genome_factory: JsonGenomeFactory, ant_factory: AntFactory):
        self._ant_factory = ant_factory
        self._json_stats_factory = json_stats_factory
        self._json_genome_factory = json_genome_factory

    def build_ant_from_json(self, ant_json: dict, entities_collection: EntityCollection):
        type = AntTypes(ant_json['ant_type'])

        match(type):
            case AntTypes.WORKER:
                return self._build_worker_ant(ant_json, entities_collection)
            case AntTypes.WARRIOR:
                return self._build_warrior_ant(ant_json, entities_collection)
            case AntTypes.QUEEN:
                return self._build_queen_ant(ant_json, entities_collection)
            case _:
                raise Exception('unknown type of ant')

    def _build_worker_ant(self, ant_json: dict, entities_collection: EntityCollection):
        ant_props = self._parse_common_ant_props(ant_json, entities_collection)
        return self._ant_factory.build_worker_ant(**ant_props)
    
    def _build_warrior_ant(self, ant_json: dict, entities_collection: EntityCollection):
        ant_props = self._parse_common_ant_props(ant_json, entities_collection)
        return self._ant_factory.build_warrior_ant(**ant_props)
    
    def _build_queen_ant(self, ant_json: dict, entities_collection: EntityCollection):
        ant_props = self._parse_common_ant_props(ant_json, entities_collection)
        male_chromosomes_set = self._json_genome_factory.build_chromosomes_set_from_json(ant_json['male_chromosomes_set']) if ant_json['male_chromosomes_set'] else None
        ant_props.update({
            "male_chromosomes_set": male_chromosomes_set,
            "is_in_nuptial_flight": ant_json['is_in_nuptial_flight']
        })
        
        return self._ant_factory.build_queen_ant(**ant_props)

    def _parse_common_ant_props(self, ant_json: dict, entities_collection: EntityCollection):   
        return {
            "id": ant_json['id'],
            "from_colony_id": ant_json['from_colony_id'],
            "owner_id": ant_json['owner_id'],
            "position": Point.from_json(ant_json['position']),
            "angle": ant_json['angle'],
            "nest": entities_collection.get_entity_by_id(ant_json['from_nest']) if ant_json['from_nest'] else None,
            "located_in_nest": entities_collection.get_entity_by_id(ant_json['located_in_nest_id']) if ant_json['located_in_nest_id'] else None,
            "picked_item": entities_collection.get_entity_by_id(ant_json['picked_item_id']) if ant_json['picked_item_id'] else None,
            "is_auto_thought_generation": ant_json['is_auto_thought_generation'],
            "is_in_operation": ant_json['is_in_operation'],
            "memory_data": ant_json['memory'],
            "hp": ant_json['hp'],
            "genome": self._json_genome_factory.build_genome_from_json(ant_json['genome'])
        }
