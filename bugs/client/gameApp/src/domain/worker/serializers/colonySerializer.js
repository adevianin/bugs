class ColonySerializer {

    serializeColonies(colonies) {
        let serializedColonies = [];
        for (let colony of colonies) {
            serializedColonies.push(this.serializeColony(colony));
        }
        return serializedColonies;
    }

    serializeColony(colony) {
        let serializedOperations = [];
        for (let operation of colony.operations) {
            serializedOperations.push(this.serializeOperation(operation));
        }
        return {
            'id': colony.id,
            'name': colony.name,
            'operations': serializedOperations,
            'enemies': colony.enemies
        };
    }

    serializeMarker(marker) {
        return {
            'type': marker.type,
            'point': marker.point,
            'params': marker.params
        }
    }

    serializeOperations(operations) {
        let serializedOperations = [];
        for (let operation of operations) {
            serializedOperations.push(this.serializeOperation(operation));
        }

        return serializedOperations;
    }

    serializeOperation(operation) {
        let serializedMarkers = [];
        for (let marker of operation.markers) {
            serializedMarkers.push(this.serializeMarker(marker));
        }
        return {
            'id': operation.id,
            'type': operation.type,
            'status': operation.status,
            'markers': serializedMarkers,
            'workerVacanciesCount': operation.workerVacanciesCount,
            'warriorVacanciesCount': operation.warriorVacanciesCount,
            'hiredWorkersCount': operation.hiredWorkersCount,
            'hiredWarriorsCount': operation.hiredWarriorsCount
        }
    }
}

export {
    ColonySerializer
}