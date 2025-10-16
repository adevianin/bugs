from core.application.engine_communicator_interface import iEngineCommunicator
from typing import Dict
import redis, json, time
import redis.exceptions
from logging import Logger
from core.world.settings import STEP_TIME
import threading
from core.world.utils.event_emiter import EventEmitter
from .redis_channel_names import RedisChannelNames

class EngineCommunicator(iEngineCommunicator):

    def __init__(self, events: EventEmitter, redis: redis.Redis, logger: Logger):
        super().__init__()
        self._events = events
        self._redis = redis
        self._logger = logger
        self._listen_thread: threading.Thread = None
        self._is_started = False

    @property
    def events(self) -> EventEmitter:
        return self._events

    def start(self):
        if self._is_started:
            raise Exception('engine channel is started already')
        
        def listen():
            while True:
                try:
                    pubsub = self._redis.pubsub(ignore_subscribe_messages=True)
                    pubsub.subscribe(RedisChannelNames.CHANNEL_ENGINE_IN)
                    for msg in pubsub.listen():
                        
                        if msg['data'] == '__exit__':
                            pubsub.unsubscribe()
                            pubsub.close()
                            self._logger.info('closed redis engine_in channel')
                            return

                        msg_data_json = json.loads(msg['data'])
                        self._events.emit('message', msg_data_json)
                except redis.exceptions.ConnectionError as e:
                    self._events.emit('connection_error')
                    self._logger.error('redis connection error. engine_in listener')
                    time.sleep(5)

        self._listen_thread = threading.Thread(target=listen, daemon=True)
        self._listen_thread.start()
        self._is_started = True

    def stop(self):
        self._events.remove_all_listeners()
        try:
            self._redis.publish(RedisChannelNames.CHANNEL_ENGINE_IN, '__exit__')
            self._listen_thread.join()
        except Exception as e:
            self._logger.error('stop engine channel error')

    def send_engine_status(self, is_world_inited: bool, is_world_stepping: bool, players_online: int):
        try:
            self._redis.set('engine_status', json.dumps({
                'is_world_inited': is_world_inited,
                'is_world_stepping': is_world_stepping,
                'players_online': players_online
            }), STEP_TIME + 3)
        except redis.exceptions.ConnectionError as e:
            self._logger.error('redis connection error. send_engine_status')

    def send_msg(self, type: str, data: Dict):
        try:
            self._redis.publish(RedisChannelNames.CHANNEL_ENGINE_OUT, json.dumps({
                'type': type,
                'data': data
            }))
        except redis.exceptions.ConnectionError as e:
            self._logger.error('redis connection error. send_msg')