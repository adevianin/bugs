from core.world.entities.action.base.action_types import ActionTypes
from core.world.entities.action.base.actor_types import ActorTypes
from core.world.entities.ant.base.genetic.genome import Genome
from .base.action import Action

class AntGotFertilizedAction(Action):
    
    def __init__(self, actor_id, breeding_male_genome: Genome, for_user_id = None):
        super().__init__(actor_id, ActionTypes.ANT_GOT_FERTILIZED, ActorTypes.ENTITY, for_user_id)
        self.breeding_male_genome = breeding_male_genome
