from core.world.entities.colony.colonies.ant_colony.operation.base.operation import Operation
from .util_client_serializer import UtilClientSerializer

class OperationClientSerializer():

    def __init__(self, util_client_serializer: UtilClientSerializer):
        self._util_client_serializer = util_client_serializer

    def serialize(self, operation: Operation):
        return {
            'id': operation.id,
            'name': operation.name,
            'status': operation.status,
            'markers': [self._serialize_marker(marker) for marker in operation.markers],
            'workerVacanciesCount': operation.worker_vacancies_count,
            'warriorVacanciesCount': operation.warrior_vacancies_count,
            'hiredWorkersCount': operation.hired_workers_count,
            'hiredWarriorsCount': operation.hired_warriors_count
        }
    
    def _serialize_marker(self, marker):
        return {
            'type': marker['type'],
            'point': self._util_client_serializer.serialize_point(marker['point']),
            'params': marker['params']
        }