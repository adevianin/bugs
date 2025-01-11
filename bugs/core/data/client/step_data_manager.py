from core.world.world_facade import WorldFacade
from .serializers.world_client_serializer import WorldClientSerializer
from .serializers.nuptial_environment_client_serializer import NuptialEnvironmentClientSerializer
from .serializers.constants_client_serializer import ConstantsClientSerializer
from .serializers.notification_client_serializer import NotificationClientSerializer
from core.world.entities.action.base.action import Action
from core.data.client.serializers.action_client_serializer import ActionClientSerializer
from core.world.utils.event_emiter import EventEmitter
from typing import List, Callable

class StepDataManager():
    _instance = None

    @staticmethod
    def get_instance() -> 'StepDataManager':
        return StepDataManager._instance
    
    def __init__(self, world_facade: WorldFacade, world_serializer: WorldClientSerializer, nuptial_env_serializer: NuptialEnvironmentClientSerializer, 
                 consts_serializer: ConstantsClientSerializer, notification_serializer: NotificationClientSerializer, action_client_serializer: ActionClientSerializer):
        if StepDataManager._instance != None:
            raise Exception('StepDataManager is singleton')
        else:
            StepDataManager._instance = self
        self.events = EventEmitter()
        self._common_actions: List[Action] = []
        self._personal_actions: List[Action] = []
        self._serialized_common_actions = []
        self._world_facade = world_facade
        self._world_serializer = world_serializer
        self._nuptial_env_serializer = nuptial_env_serializer
        self._consts_serializer = consts_serializer
        self._notification_serializer = notification_serializer
        self._action_client_serializer = action_client_serializer

        self._world_facade.add_listener('action', self._on_action)
        self._world_facade.add_listener('step_done', self._on_step_done)
        
    def get_current_step_data(self, user_id: int):
        world = self._world_facade.world
        return {
            'type': 'step',
            'step': world.current_step,
            'season': world.current_season,
            'actions': self._serialize_actions_for_user(user_id)
        }
    
    def get_init_step_data(self, user_id: int):
        world = self._world_facade.world
        serialized_world = self._world_serializer.serialize(world)
        serialized_specie = self._nuptial_env_serializer.serialize_specie(self._world_facade.get_specie_for_client(user_id))
        serialized_nuptial_males = self._nuptial_env_serializer.serialize_nuptial_males(self._world_facade.get_nuptial_males_for_client(user_id))
        serialized_consts = self._consts_serializer.serialize_constants()
        serialized_notifications = [self._notification_serializer.serialize(notification) for notification in self._world_facade.get_notifications_for_client(user_id)]
        return {
            'type': 'init_step',
            'step': world.current_step,
            'season': world.current_season,
            'world': serialized_world,
            'specie': serialized_specie,
            'nuptialMales': serialized_nuptial_males,
            'consts': serialized_consts,
            'notifications': serialized_notifications,
            'rating': self._world_facade.get_rating()
        }
    
    def _serialize_actions_for_user(self, user_id: int):
        user_filter: Callable[[Action], bool] = lambda action: action.for_user_id == user_id
        personal_actions = list(filter(user_filter, self._personal_actions))
        serialized_personal_actions = [self._action_client_serializer.serialize(action) for action in personal_actions]
        return self._serialized_common_actions + serialized_personal_actions
    
    def _on_action(self, action: Action):
        if action.is_personal():
            self._personal_actions.append(action)
        else:
            self._common_actions.append(action)

    def _on_step_done(self):
        self._serialized_common_actions = [self._action_client_serializer.serialize(action) for action in self._common_actions]
        self.events.emit('step_data_ready')
        self._clear_accumulated_actions_data()

    def _clear_accumulated_actions_data(self):
        self._common_actions.clear()
        self._personal_actions.clear()
        self._serialized_common_actions.clear()
