from .engine.engine_adapter import EngineAdapter
from infrastructure.services.engine.exceptions import EngineError, EngineStateConflictError
from typing import Dict, Tuple
from infrastructure.utils.clean_str_param import clean_str_param
import logging

class PlayerCommandHandler():

    def __init__(self, ea: EngineAdapter, logger: logging.Logger):
        self._ea = ea
        self._logger = logger

    async def handle_command_msg(self, user_id: int, command_type: str, data: Dict) -> Tuple[bool, Dict]:
        try:
            return await self._handle_player_command(user_id, command_type, data)
        except EngineStateConflictError as e:
            return self._prepare_command_result(False, { 'err_type': 'state_conflict_error', 'step': e.step})
        except EngineError as e:
            self._logger.error(f'player command engine error. command = {command_type}', exc_info=e)
            return self._prepare_command_result(False, { 'err_type': 'engine_error' })

    async def _handle_player_command(self, user_id: str, command_type: str, data: Dict):
        match (command_type):
            case 'fly_nuptial_flight':
                await self._ea.fly_nuptial_flight_command(user_id, data['ant_id'])
                return self._prepare_command_result()
            case 'change_ant_guardian_behavior':
                await self._ea.change_ant_guardian_behavior_command(user_id, data['ant_id'], data['behavior_value'])
                return self._prepare_command_result()
            case 'change_ant_cooperative_behavior':
                await self._ea.change_ant_cooperative_behavior_command(user_id, data['ant_id'], data['is_enabled'])
                return self._prepare_command_result()
            case 'relocate_ant':
                await self._ea.relocate_ant_command(user_id, data['ant_id'], data['nest_id'])
                return self._prepare_command_result()

            case 'stop_operation':
                operation_id = await self._ea.stop_operation_command(user_id, data['colony_id'], data['operation_id'])
                return self._prepare_command_result(True, operation_id)
            case 'build_new_sub_nest_operation':
                operation_id = await self._ea.build_new_sub_nest_operation_command(user_id, data['performing_colony_id'], data['building_site'], data['workers_count'], data['warriors_count'], clean_str_param(data['nest_name']))
                return self._prepare_command_result(True, operation_id)
            case 'destroy_nest_operation':
                operation_id = await self._ea.destroy_nest_operation_command(user_id, data['performing_colony_id'], data['nest_id'], data['workers_count'], data['warriors_count'])
                return self._prepare_command_result(True, operation_id)
            case 'pillage_nest_operation':
                operation_id = await self._ea.pillage_nest_operation_command(user_id, data['performing_colony_id'], data['nest_to_pillage_id'], data['nest_for_loot_id'], data['workers_count'], data['warriors_count'])
                return self._prepare_command_result(True, operation_id)
            case 'transport_food_operation':
                operation_id = await self._ea.transport_food_operation_command(user_id, data['performing_colony_id'], data['from_nest_id'], data['to_nest_id'], data['workers_count'], data['warriors_count'])
                return self._prepare_command_result(True, operation_id)
            case 'build_fortification_operation':
                operation_id = await self._ea.build_fortification_operation_command(user_id, data['performing_colony_id'], data['nest_id'], data['workers_count'])
                return self._prepare_command_result(True, operation_id)
            case 'bring_bug_operation':
                operation_id = await self._ea.bring_bug_operation_command(user_id, data['performing_colony_id'], data['nest_id'])
                return self._prepare_command_result(True, operation_id)

            case 'add_egg':
                egg_id = await self._ea.add_egg_command(user_id, data['nest_id'], clean_str_param(data['name']), data['is_fertilized'])
                return self._prepare_command_result(True, egg_id)
            case 'change_egg_caste':
                await self._ea.change_egg_caste_command(user_id, data['nest_id'], data['egg_id'], data['ant_type'])
                return self._prepare_command_result()
            case 'change_egg_name':
                await self._ea.change_egg_name_command(user_id, data['nest_id'], data['egg_id'], clean_str_param(data['name']))
                return self._prepare_command_result()
            case 'delete_egg':
                await self._ea.delete_egg_command(user_id, data['nest_id'], data['egg_id'])
                return self._prepare_command_result()
            case 'delete_larva':
                await self._ea.delete_larva_command(user_id, data['nest_id'], data['larva_id'])
                return self._prepare_command_result()
            case 'rename_nest':
                await self._ea.rename_nest_command(user_id, data['nest_id'], clean_str_param(data['name']))
                return self._prepare_command_result()

            case 'found_colony':
                await self._ea.found_colony_command(user_id, data['queen_id'], data['nuptial_male_id'], data['nest_building_site'], clean_str_param(data['colony_name']))
                return self._prepare_command_result()
            case 'born_new_antara':
                await self._ea.born_new_antara_command(user_id)
                return self._prepare_command_result()
            case 'change_specie_schema':
                await self._ea.change_specie_schema_command(user_id, data['specie_schema'])
                return self._prepare_command_result()
            
            case _:
                self._logger.warning(f'unknown type of command = "{command_type}"')
                return self._prepare_command_result(False, { 'err_type': 'unknown_command_type' })

    def _prepare_command_result(self, is_success: bool = True, data: Dict = {}):
        return is_success, data

    