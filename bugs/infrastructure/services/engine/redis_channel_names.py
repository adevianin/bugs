from enum import StrEnum

class RedisChannelNames(StrEnum):
    CHANNEL_ENGINE_IN = 'engine_in'
    CHANNEL_ENGINE_OUT = 'engine_out'