import { BaseDomainFacade } from "@common/domain/baseDomainFacade";
import { EntityTypes } from "./enum/entityTypes";

class DomainFacade extends BaseDomainFacade {

    constructor(mainEventBus, accountService, messageHandlerService, worldService, colonyService, userService, nuptialEnvironmentService, nestService, antService) {
        super();
        this._mainEventBus = mainEventBus;
        this._accountService = accountService;
        this._worldService = worldService;
        this._messageHandlerService = messageHandlerService;
        this._colonyService = colonyService;
        this._userService = userService;
        this._nuptialEnvironmentService = nuptialEnvironmentService;
        this._nestService = nestService;
        this._antService = antService;
    }

    get events() {
        return this._mainEventBus;
    }

    get currentStep() {
        return this._worldService.world.currentStep;
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
        return this._nuptialEnvironmentService.getQueensInNuptialFlightFromUser(userData.id);
    }

    getClimate() {
        return this._worldService.world.climate;
    }

    buildMarker(type, point) {
        return this._colonyService.buildMarker(type, point);
    }

    findMyFirstNest() {
        let userData = this.getUserData();
        return this._nestService.findMyFirstNest(userData.id);
    }

    /*======operations========*/

    stopOperation(colonyId, operationId) {
        this._colonyService.stopOperation(colonyId, operationId);
    }

    validateNewNestOperationConditions(colonyId) {
        return this._colonyService.validateNewNestOperationConditions(colonyId);
    }

    buildNewSubNestOperation(performingColonyId, buildingSite, workersCount, warriorsCount, nestName) {
        return this._colonyService.buildNewSubNestOperation(performingColonyId, buildingSite, workersCount, warriorsCount, nestName);
    }

    validateDestroyNestOperationConditions(colonyId) {
        return this._colonyService.validateDestroyNestOperationConditions(colonyId);
    }

    destroyNestOperation(performingColonyId, warriorsCount, workersCount, nest) {
        return this._colonyService.destroyNestOperation(performingColonyId, warriorsCount, workersCount, nest);
    }

    validatePillageNestOperationConditions(colonyId) {
        return this._colonyService.validatePillageNestOperationConditions(colonyId);
    }

    pillageNestOperation(performingColonyId, pillagingNestId, nestForLootId, warriorsCount, workersCount) {
        return this._colonyService.pillageNestOperation(performingColonyId, pillagingNestId, nestForLootId, warriorsCount, workersCount);
    }

    transportFoodOperation(performingColonyId, fromNestId, toNestId, workersCount, warriorsCount) {
        return this._colonyService.transportFoodOperation(performingColonyId, fromNestId, toNestId, workersCount, warriorsCount);
    }

    buildFortificationsOpearation(performingColonyId, nestId, workersCount) {
        return this._colonyService.buildFortificationsOpearation(performingColonyId, nestId, workersCount);
    }

    bringBugOpearation(performingColonyId, nestId) {
        return this._colonyService.bringBugOpearation(performingColonyId, nestId);
    }

    /*========================*/

    foundColony(queenId, nuptialMaleId, nestBuildingSite, colonyName, errCallbacks) {
        return this._nuptialEnvironmentService.foundColony(queenId, nuptialMaleId, nestBuildingSite, colonyName, errCallbacks);
    }

    getMyNuptialMales() {
        return this._nuptialEnvironmentService.nuptialMales;
    }

    findNearestNest(point, excludeColonyId) {
        return this._nestService.findNearestNest(point, excludeColonyId);
    }

    getMySpecie() {
        return this._nuptialEnvironmentService.specie;
    }

    bornNewAntara() {
        this._userService.bornNewAntara();
    }

    layEggInNest(nestId, name, isFertilized) {
        return this._nestService.layEggInNest(nestId, name, isFertilized);
    }

    changeEggCasteInNest(nestId, eggId, antType) {
        return this._nestService.changeEggCasteInNest(nestId, eggId, antType);
    }

    changeEggNameInNest(nestId, eggId, name) {
        return this._nestService.changeEggNameInNest(nestId, eggId, name);
    }

    moveEggToLarvaInNest(nestId, eggId) {
        return this._nestService.moveEggToLarvaInNest(nestId, eggId);
    }

    deleteEggInNest(nestId, eggId) {
        return this._nestService.deleteEggInNest(nestId, eggId);
    }

    deleteLarvaInNest(nestId, larvaId) {
        return this._nestService.deleteLarvaInNest(nestId, larvaId);
    }

    renameNest(nestId, name) {
        return this._nestService.renameNest(nestId, name);
    }

    validateLayingEggInNest(nestId) {
        return this._nestService.validateLayingEggInNest(nestId);
    }

    findClosestBugCorpseNearNest(nestId) {
        return this._colonyService.findClosestBugCorpseNearNest(nestId);
    }

    /*==========ant===========*/

    antFlyNuptialFlight(antId) {
        this._antService.antFlyNuptialFlight(antId);
    }

    antChangeGuardianBehavior(antId, behaviorValue) {
        this._antService.antChangeGuardianBehavior(antId, behaviorValue);
    }

    antToggleCooperativeBehavior(antId, isCooperative) {
        this._antService.antToggleCooperativeBehavior(antId, isCooperative);
    }

    antRelocate(antId, homeNestId) {
        this._antService.antRelocate(antId, homeNestId);
    }

    /*========================*/

    /*==========account===========*/

    logout() {
        return this._accountService.logout();
    }

    getUserData() {
        return this._accountService.getUserData();
    }

    validateUsername(username) {
        return this._accountService.validateUsername(username);
    }

    changeUsername(newUsername) {
        return this._accountService.changeUsername(newUsername);
    }

    changeEmail(newEmail, password) {
        return this._accountService.changeEmail(newEmail, password);
    }

    /*==============================*/

}
export { DomainFacade }