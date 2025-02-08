import { EntityTypes } from "./enum/entityTypes";

class DomainFacade {

    constructor(mainEventBus, accountService, messageHandlerService, worldService, colonyService, userService, nuptialEnvironmentService) {
        this._mainEventBus = mainEventBus;
        this._worldService = worldService;
        this._accountService = accountService;
        this._messageHandlerService = messageHandlerService;
        this._colonyService = colonyService;
        this._userService = userService;
        this._nuptialEnvironmentService = nuptialEnvironmentService;
    }

    get currentStep() {
        return this._worldService.world.currentStep;
    }

    get events() {
        return this._mainEventBus;
    }

    get notificationsContainer() {
        return this._userService.notificationsContainer;
    }

    get ratingContainer() {
        return this._worldService.ratingContainer;
    }

    get world() {
        return this._worldService.world;
    }

    getEntities() {
        return this._worldService.world.entities;
    }

    findEntityById(id) {
        return this._worldService.world.findEntityById(id);
    }

    logout() {
        return this._accountService.logout();
    }

    getUserData() {
        return this._accountService.getUserData();
    }

    start() {
        this._messageHandlerService.connect();
    }

    getWorldSize() {
        return this._worldService.world.size;
    }

    getNestsFromColony(colonyId) {
        return this._worldService.world.findNestsFromColony(colonyId);
    }

    getAntsFromColony(colonyId) {
        return this._worldService.world.findAntsFromColony(colonyId);
    }

    getQueenOfColony(colonyId) {
        return this._worldService.world.getQueenOfColony(colonyId);
    }

    isEntityMy(entity) {
        let userData = this.getUserData();
        return entity.ownerId == userData.id;
    }

    isMyAnt(entity) {
        return this.isEntityMy(entity) && entity.type == EntityTypes.ANT;
    }

    isColonyMy(colony) {
        let userData = this.getUserData();
        return colony.ownerId == userData.id;
    }

    findMyColonies() {
        let userData = this.getUserData();
        return this._worldService.world.findColoniesByOwnerId(userData.id);
    }

    isAnyMyColony() {
        let userData = this.getUserData();
        return this._worldService.world.isAnyColonyByOwnerId(userData.id);
    }

    isAnyMyAnt() {
        let userData = this.getUserData();
        return this._worldService.world.isAnyAntByOwnerId(userData.id);
    }

    getMyQueensInNuptialFlight() {
        let userData = this.getUserData();
        return this._worldService.getQueensInNuptialFlightFromUser(userData.id);
    }

    getClimate() {
        return this._worldService.world.climate;
    }

    buildMarker(type, point) {
        return this._colonyService.buildMarker(type, point);
    }

    /*======operations========*/

    stopOperation(colonyId, operationId) {
        this._colonyService.stopOperation(colonyId, operationId);
    }

    buildNewSubNestOperation(performingColonyId, buildingSite, workersCount, warriorsCount, nestName) {
        return this._colonyService.buildNewSubNestOperation(performingColonyId, buildingSite, workersCount, warriorsCount, nestName);
    }

    destroyNestOperation(performingColonyId, warriorsCount, workersCount, nest) {
        this._colonyService.destroyNestOperation(performingColonyId, warriorsCount, workersCount, nest);
    }

    pillageNestOperation(performingColonyId, pillagingNestId, nestForLootId, warriorsCount, workersCount) {
        this._colonyService.pillageNestOperation(performingColonyId, pillagingNestId, nestForLootId, warriorsCount, workersCount);
    }

    transportFoodOperation(performingColonyId, fromNestId, toNestId, workersCount, warriorsCount) {
        this._colonyService.transportFoodOperation(performingColonyId, fromNestId, toNestId, workersCount, warriorsCount);
    }

    buildFortificationsOpearation(performingColonyId, nestId, workersCount) {
        this._colonyService.buildFortificationsOpearation(performingColonyId, nestId, workersCount);
    }

    bringBugOpearation(performingColonyId, nestId) {
        return this._colonyService.bringBugOpearation(performingColonyId, nestId);
    }

    /*========================*/

    foundColony(queenId, nuptialMaleId, nestBuildingSite, colonyName) {
        this._nuptialEnvironmentService.foundColony(queenId, nuptialMaleId, nestBuildingSite, colonyName);
    }

    getMyNuptialMales() {
        return this._nuptialEnvironmentService.nuptialMales;
    }

    findNearestNest(point, excludeColonyId) {
        return this._worldService.findNearestNest(point, excludeColonyId);
    }

    getMySpecie() {
        return this._nuptialEnvironmentService.specie;
    }

    bornNewAntara() {
        this._userService.bornNewAntara();
    }

}
export { DomainFacade }