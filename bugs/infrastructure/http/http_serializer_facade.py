from infrastructure.serializers.larva_client_serializer import LarvaClientSerializer
from infrastructure.serializers.egg_client_serializer import EggClientSerializer

class HttpSerializersFacade():

    _larva_serializer: LarvaClientSerializer = None
    _egg_serializer: EggClientSerializer = None

    @classmethod
    def init(cls, larva_serializer: LarvaClientSerializer, egg_serializer: EggClientSerializer):
        cls._larva_serializer = larva_serializer
        cls._egg_serializer = egg_serializer

    @classmethod
    def get_larva_serializer(cls) -> LarvaClientSerializer:
        return cls._larva_serializer

    @classmethod
    def get_egg_serializer(cls) -> EggClientSerializer:
        return cls._egg_serializer