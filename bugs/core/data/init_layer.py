from core.data.repositories.world_data_repository import WorldDataRepository
from core.data.repositories.world_repository import WorldRepository
from core.world.entities.thought.thought_factory import ThoughtFactory
from core.world.entities.ant.ant_factory import AntFactory
from core.world.entities.nest.nest_factory import NestFactory
from core.world.entities.food.food_factory import FoodFactory
from core.world.entities.colony.colony_factory import ColonyFactory
from core.world.entities.colony.operation.operation_factory import OperationFactory
from core.world.entities.world.world_factory import WorldFactory
from core.data.factories.json_nest_factory import JsonNestFactory
from core.data.factories.json_ant_factory import JsonAntFactory
from core.data.factories.json_food_factory import JsonFoodFactory
from core.data.factories.json_colony_factory import JsonColonyFactory
from core.data.factories.json_thought_factory import JsonThoughtFactory
from core.data.factories.json_memory_factory import JsonMemoryFactory

def init_data_layer(thought_factory:ThoughtFactory, ant_factory: AntFactory, nest_factory: NestFactory, food_factory: FoodFactory, colony_factory: ColonyFactory, operation_factory: OperationFactory, world_factory: WorldFactory):
    world_data_repository = WorldDataRepository()

    json_nest_factory = JsonNestFactory(nest_factory)
    json_memory_factory = JsonMemoryFactory()
    json_ant_factory = JsonAntFactory(ant_factory, json_memory_factory)
    json_food_factory = JsonFoodFactory(food_factory)
    json_colony_factory = JsonColonyFactory(colony_factory)
    json_thought_factory = JsonThoughtFactory(thought_factory)
    
    world_repository = WorldRepository(world_data_repository, json_nest_factory, json_ant_factory, json_food_factory, json_colony_factory, json_thought_factory, world_factory)

    return world_repository