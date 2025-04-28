class MyStateCollector {

    constructor(eventBus, world, nuptialEnv, entitySerializer, colonySerializer) {
        this._eventBus = eventBus;
        this._world = world;
        this._nuptialEnv = nuptialEnv;
        this._entitySerializer = entitySerializer;
        this._colonySerializer = colonySerializer;

        this._resetMyStatePatch();

        this._eventBus.once('initStepDone', this._onInitStepDone.bind(this));
        this._eventBus.on('nestBorn', this._onNestBorn.bind(this));
        this._eventBus.on('nestDied', this._onNestDied.bind(this));
        this._eventBus.on('antBorn', this._onAntBorn.bind(this));
        this._eventBus.on('antDied', this._onAntDied.bind(this));
        this._eventBus.on('colonyBorn', this._onColonyBorn.bind(this));
        this._eventBus.on('colonyDied', this._onColonyDied.bind(this));
        this._eventBus.on('specieChromosomesGenesChanged', this._onSpecieChromosomesSpecieGenesChanged.bind(this));
        this._nuptialEnv.events.on('nuptialMalesChanged', this._onNuptialMalesChanged.bind(this));
    }

    setUserData(userData) {
        this._userData = userData;
    }

    getMyState() {
        let colonies = this._world.findColoniesByOwnerId(this._userData.id);
        let nests = this._world.findNestsByOwner(this._userData.id);
        let ants = this._world.findAntsByOwnerId(this._userData.id);
        let queenInNuptialFlightIds = ants.filter(a => a.isInNuptialFlight).map(a => a.id);

        return {
            colonies: this._colonySerializer.serializeColonies(colonies),
            nests: this._entitySerializer.serializeNests(nests),
            ants: this._entitySerializer.serializeAnts(ants),
            nuptialEnvironment: {
                queens: queenInNuptialFlightIds,
                males: this._entitySerializer.serializeNuptialMales(this._nuptialEnv.nuptialMales),
                specie: this._nuptialEnv.specieData
            }
        }
    }

    pullPatch() {
        let patch = this._myStatePatch;
        this._resetMyStatePatch();
        return patch;
    }

    _resetMyStatePatch() {
        this._myStatePatch = {
            nests: {
                add: [],
                update: [],
                remove: []
            },
            ants: {
                add: [],
                update: [],
                remove: []
            },
            colonies: {
                add: [],
                update: [],
                remove: []
            },
            nuptialEnvironment: {
                props: {},
                queens: {
                    add: [],
                    remove: []
                },
                specie: {
                    specieChromosomes: {
                        update: []
                    }
                }
            }
        };
    }

    _onInitStepDone() {
        this._listenMyNests();
        this._listenAnts();
        this._listenColonies();
    }

    _listenColonies() {
        let colonies = this._world.findColoniesByOwnerId(this._userData.id);
        for (let colony of colonies) {
            this._listenColony(colony);
        }
    }

    _listenColony(colony) {
        colony.events.on('addedOperation', (newOperation) => {
            this._pushOperationAddToColonyUpdatePatch(colony.id, newOperation);
        });
        colony.events.on('operationChanged', (operation) => {
            this._pushOperationPropsToOperationUpdatePatch(colony.id, operation.id, {
                status: operation.status,
                hiredWarriorsCount: operation.hiredWarriorsCount,
                hiredWorkersCount: operation.hiredWorkersCount
            });
        });
        colony.events.on('operationDeleted', (operation) => {
            this._pushOperationRemoveToColonyUpdatePatch(colony.id, operation.id);
        });
        colony.events.on('enemiesChanged', (operation) => {
            this._pushOperationPropsToOperationUpdatePatch(colony.id, operation.id, {
                enemies: operation.enemies
            });
        });
    }

    _pushOperationAddToColonyUpdatePatch(colonyId, newOperation) {
        let patch = this._getColonyUpdatePatch(colonyId);
        let serializedOperation = this._colonySerializer.serializeOperation(newOperation);
        patch.operations.add.push(serializedOperation);
    }

    _pushOperationPropsToOperationUpdatePatch(colonyId, operationId, props) {
        let operationUpdatePatch = this._getOperationUpdatePatch(colonyId, operationId);
        Object.assign(operationUpdatePatch.props, props);
    }

    _pushOperationRemoveToColonyUpdatePatch(colonyId, operationId) {
        let patch = this._getColonyUpdatePatch(colonyId);
        patch.operations.remove.push(operationId);
    }

    _getColonyUpdatePatch(colonyId) {
        for (let colonyUpdatePatch of this._myStatePatch.colonies.update) {
            if (colonyUpdatePatch.id = colonyId) {
                return colonyUpdatePatch;
            }
        }

        let colonyUpdatePatch = { 
            id: colonyId, 
            props: {}, 
            operations: {
                add: [],
                update: [],
                remove: []
            }
        };
        this._myStatePatch.colonies.update.push(colonyUpdatePatch);
        return colonyUpdatePatch;
    }

    _getOperationUpdatePatch(colonyId, operationId) {
        let colonyUpdatePatch = this._getColonyUpdatePatch(colonyId);
        for (let operationUpdatePatch of colonyUpdatePatch.operations.update) {
            if (operationUpdatePatch.id == operationId) {
                return operationUpdatePatch;
            }
        }

        let operationUpdatePatch = {
            id: operationId,
            props: {}
        }
        colonyUpdatePatch.operations.update.push(operationUpdatePatch);
        return operationUpdatePatch;
    }

    _listenAnts() {
        let ants = this._world.findAntsByOwnerId(this._userData.id);
        for (let ant of ants) {
            this._listenAnt(ant);
        }
    }

    _listenAnt(ant) {
        ant.events.on('homeNestChanged', () => {
            this._pushAntPropsToAntUpdatePatch(ant.id, {
                homeNestId: ant.homeNestId
            });
        });
        ant.events.on('currentActivityChanged', () => {
            this._pushAntPropsToAntUpdatePatch(ant.id, {
                currentActivity: ant.currentActivity
            });
        });
        ant.events.on('isHungryChanged', () => {
            this._pushAntPropsToAntUpdatePatch(ant.id, {
                isHungry: ant.isHungry
            });
        });
        ant.events.on('guardianBehaviorChanged', () => {
            this._pushAntPropsToAntUpdatePatch(ant.id, {
                guardianBehavior: ant.guardianBehavior
            });
        });
        ant.events.on('isCooperativeBehaviorChanged', () => {
            this._pushAntPropsToAntUpdatePatch(ant.id, {
                isCooperativeBehavior: ant.isCooperativeBehavior
            });
        });
        ant.events.on('isInNuptialFlightChanged', () => {
            if (ant.isInNuptialFlight) {
                this._pushQueenAntToNuptialEnvironment(ant.id);
            } else {
                this._pullQueenAntFromNuptialEnvironment(ant.id);
            }
        });
        ant.events.on('fromColonyChanged', () => {
            this._pushAntPropsToAntUpdatePatch(ant.id, {
                fromColony: ant.fromColony
            });
        });
        ant.events.on('gotFertilized', () => {
            this._pushAntPropsToAntUpdatePatch(ant.id, {
                isQueenOfColony: ant.isQueenOfColony,
                breedingMaleGenome: this._entitySerializer.serializeGenome(ant.breedingMaleGenome),
            });
        });
    }

    _pushQueenAntToNuptialEnvironment(antId) {
        this._myStatePatch.nuptialEnvironment.queens.add.push(antId);
    }

    _pullQueenAntFromNuptialEnvironment(antId) {
        this._myStatePatch.nuptialEnvironment.queens.remove.push(antId);
    }

    _pushAntPropsToAntUpdatePatch(antId, props) {
        let antUpdatePatch = this._getAntUpdatePatch(antId);
        Object.assign(antUpdatePatch.props, props);
    }

    _getAntUpdatePatch(antId) {
        for (let antPatch of this._myStatePatch.ants.update) {
            if (antPatch.id == antId) {
                return antPatch;
            }
        }

        let antUpdatePatch = { 
            id: antId, 
            props: {}, 
        };
        this._myStatePatch.ants.update.push(antUpdatePatch);
        return antUpdatePatch;
    }

    _listenMyNests() {
        let nests = this._world.findNestsByOwner(this._userData.id);
        for (let nest of nests) {
            this._listenNest(nest);
        }
    }

    _listenNest(nest) {
        nest.events.on('storedCaloriesChanged', () => {
            this._pushNestPropsToNestUpdatePatch(nest.id, { storedCalories: nest.storedCalories });
        });
        nest.events.on('eggAdded', (egg) => {
            this._pushEggAddToNestUpdatePatch(nest.id, egg);
        });
        nest.events.on('eggUpdated', (eggId, props) => {
            this._pushEggPropsToEggUpdatePatch(nest.id, eggId, props);
        });
        nest.events.on('eggRemoved', (eggId) => {
            this._pushEggRemoveToNestUpdatePatch(nest.id, eggId);
        });
        nest.events.on('larvaAdded', (larva) => {
            this._pushLarvaAddToNestUpdatePatch(nest.id, larva);
        });
        nest.events.on('larvaUpdated', (larvaId, props) => {
            this._pushLarvaPropsToLarvaUpdatePatch(nest.id, larvaId, props);
        });
        nest.events.on('larvaRemoved', (larvaId) => {
            this._pushLarvaRemoveToNestUpdatePatch(nest.id, larvaId);
        });

    }

    _pushLarvaAddToNestUpdatePatch(nestId, newLarva) {
        let patch = this._getNestUpdatePatch(nestId);
        let serializedLarva = this._entitySerializer.serializeLarva(newLarva);
        patch.larvae.add.push(serializedLarva);
    }

    _pushLarvaPropsToLarvaUpdatePatch(nestId, larvaId, props) {
        let larvaPatch = this._getLarvaUpdatePatch(nestId, larvaId);
        Object.assign(larvaPatch.props, props);
    }

    _pushLarvaRemoveToNestUpdatePatch(nestId, larvaId) {
        let nestPatch = this._getNestUpdatePatch(nestId);
        nestPatch.larvae.remove.push(larvaId);
    }

    _pushEggAddToNestUpdatePatch(nestId, newEgg) {
        let patch = this._getNestUpdatePatch(nestId);
        let serializedEgg = this._entitySerializer.serializeEgg(newEgg);
        patch.eggs.add.push(serializedEgg);
    }

    _pushEggPropsToEggUpdatePatch(nestId, eggId, props) {
        let eggPatch = this._getEggUpdatePatch(nestId, eggId);
        Object.assign(eggPatch.props, props);
    }

    _pushEggRemoveToNestUpdatePatch(nestId, eggId) {
        let nestPatch = this._getNestUpdatePatch(nestId);
        nestPatch.eggs.remove.push(eggId);
    }

    _pushNestPropsToNestUpdatePatch(nestId, props) {
        let patch = this._getNestUpdatePatch(nestId);
        Object.assign(patch.props, props);
    }

    _getNestUpdatePatch(nestId) {
        for (let nestPatch of this._myStatePatch.nests.update) {
            if (nestPatch.id = nestId) {
                return nestPatch;
            }
        }

        let nestUpdatePatch = { 
            id: nestId, 
            props: {}, 
            eggs: {
                add: [],
                update: [],
                remove: []
            },
            larvae: {
                add: [],
                update: [],
                remove: []
            }
        };
        this._myStatePatch.nests.update.push(nestUpdatePatch);
        return nestUpdatePatch;
    }

    _getEggUpdatePatch(nestId, eggId) {
        let nestUpdatePatch = this._getNestUpdatePatch(nestId);
        for (let eggUpdatePatch of nestUpdatePatch.eggs.update) {
            if (eggUpdatePatch.id == eggId) {
                return eggUpdatePatch;
            }
        }

        let eggUpdatePatch = {
            id: eggId,
            props: {}
        }
        nestUpdatePatch.eggs.update.push(eggUpdatePatch);
        return eggUpdatePatch;
    }

    _getLarvaUpdatePatch(nestId, larvaId) {
        let nestUpdatePatch = this._getNestUpdatePatch(nestId);
        for (let larvaUpdatePatch of nestUpdatePatch.larvae.update) {
            if (larvaUpdatePatch.id == larvaId) {
                return larvaUpdatePatch;
            }
        }

        let larvaUpdatePatch = {
            id: larvaId,
            props: {}
        }
        nestUpdatePatch.larvae.update.push(larvaUpdatePatch);
        return larvaUpdatePatch;
    }

    _isEntityMy(entity) {
        return entity.ownerId == this._userData.id;
    }

    _isColonyMy(colony) {
        return colony.ownerId == this._userData.id;
    }

    _onColonyBorn(colony) {
        if (this._isColonyMy(colony)) {
            let serializedColony = this._colonySerializer.serializeColony(colony);
            this._myStatePatch.colonies.add.push(serializedColony);
            this._listenColony(colony);
        }
    }

    _onColonyDied(colony) {
        if (this._isColonyMy(colony)) {
            this._myStatePatch.colonies.remove.push(colony.id);
        }
    }

    _onAntBorn(ant) {
        if (this._isEntityMy(ant)) {
            let serializedAnt = this._entitySerializer.serializeAnt(ant);
            this._myStatePatch.ants.add.push(serializedAnt);
            this._listenAnt(ant);
        }
    }

    _onAntDied(ant) {
        if (this._isEntityMy(ant)) {
            this._myStatePatch.ants.remove.push(ant.id);
            if (ant.isInNuptialFlight) {
                this._pullQueenAntFromNuptialEnvironment(ant.id);
            }
        }
    }

    _onNestBorn(nest) {
        if (this._isEntityMy(nest)) {
            let serializedNest = this._entitySerializer.serializeNest(nest);
            this._myStatePatch.nests.add.push(serializedNest);
            this._listenNest(nest);
        }
    }

    _onNestDied(nest) {
        if (this._isEntityMy(nest)) {
            this._myStatePatch.nests.remove.push(nest.id);
        }
    }

    _onNuptialMalesChanged() {
        let serializedNuptialMales = this._entitySerializer.serializeNuptialMales(this._nuptialEnv.nuptialMales);
        this._myStatePatch.nuptialEnvironment.props.males = serializedNuptialMales;
    }

    _onSpecieChromosomesSpecieGenesChanged(specieChromosomeSpecieGenesChange) {
        let specieUpdatePatch = this._myStatePatch.nuptialEnvironment.specie;
        for (let specieChromosomeType in specieChromosomeSpecieGenesChange) {
            let specieGenes = specieChromosomeSpecieGenesChange[specieChromosomeType]
            let specieChromosomeUpdatePatch = {
                type: specieChromosomeType,
                props: {
                    specieGenes 
                }
            };
            specieUpdatePatch.specieChromosomes.update.push(specieChromosomeUpdatePatch);
        }
    }

}

export {
    MyStateCollector
}