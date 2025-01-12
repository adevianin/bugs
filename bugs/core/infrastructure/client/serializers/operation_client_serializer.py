from core.world.entities.colony.colonies.ant_colony.operation.base.operation import Operation

class OperationClientSerializer():

    def serialize(self, operation: Operation):
        return {
            'id': operation.id,
            'name': operation.name,
            'status': operation.status,
            'markers': operation.markers,
            'workerVacanciesCount': operation.worker_vacancies_count,
            'warriorVacanciesCount': operation.warrior_vacancies_count,
            'hiredWorkersCount': operation.hired_workers_count,
            'hiredWarriorsCount': operation.hired_warriors_count
        }