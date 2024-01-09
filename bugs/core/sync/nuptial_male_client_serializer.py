from core.world.entities.ant.base.nuptial_environment.nuptial_male import NuptialMale
from .genes_client_serializer import GenesClientSerializer

class NuptialMaleClientSerializer():

    def __init__(self, genes_client_serializer: GenesClientSerializer):
        self._genes_client_serializer = genes_client_serializer

    def serialize(self, nuptial_male: NuptialMale) -> dict:
        return {
            'id': nuptial_male.id,
            'genes': self._genes_client_serializer.serialize(nuptial_male.genes)
        }