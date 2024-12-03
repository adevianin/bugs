from core.world.entities.action.base.action_types import ActionTypes
from core.world.entities.action.base.actor_types import ActorTypes
from .base.action import Action
from core.world.entities.ant.base.nuptial_environment.specie_builder.specie_chromosome_set import SpecieChromosomeSet

class NuptialEnvironmentSpecieGenesChangedAction(Action):

    def __init__(self, specie_chromosome_set: SpecieChromosomeSet, for_user_id: int):
        super().__init__(None, ActionTypes.NUPTIAL_ENVIRONMENT_SPECIE_GENES_CHANGED, ActorTypes.NUPTIAL_ENVIRONMENT, for_user_id)
        self.specie_chromosome_set = specie_chromosome_set
