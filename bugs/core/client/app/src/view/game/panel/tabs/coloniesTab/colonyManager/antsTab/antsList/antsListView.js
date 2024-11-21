import { BaseHTMLView } from "@view/base/baseHTMLView";
import antsListTmpl from './antsListTmpl.html';
import { AntView } from "./antView";
import { EntityTypes } from "@domain/enum/entityTypes";
import { AntTypes } from "@domain/enum/antTypes";  

class AntsListView extends BaseHTMLView {

    constructor(el) {
        super(el);
        this._antViews = {};

        this._stopListenEntityDied = this.$domainFacade.events.on('entityDied', this._onSomeoneDied.bind(this));
        this._stopListenEntityBorn = this.$domainFacade.events.on('entityBorn', this._onSomeoneBorn.bind(this));
        this._stopListenQueenFlewNuptialFlight = this.$domainFacade.events.on('queenFlewNuptialFlight', this._onSomeoneFlewNuptialFlight.bind(this));

        this._render();
    }

    manageColony(colony) {
        this._colony = colony;
        this._ants = this.$domainFacade.getAntsFromColony(this._colony.id);

        this._renderAnts();
    }

    remove() {
        super.remove();
        this._stopListenEntityDied();
        this._stopListenEntityBorn();
        this._stopListenQueenFlewNuptialFlight();
        this._clearAntViews();
    }

    _render() {
        this._el.innerHTML = antsListTmpl;
        this._antsContainerEl = this._el;
    }

    _renderAnts() {
        this._clearAntViews();
        for (let ant of this._ants) {
            this._renderAntView(ant);
        }
    }

    _renderAntView(ant) {
        let view = new AntView(ant);
        this._antsContainerEl.append(view.el);
        this._antViews[ant.id] = view;
    }

    _clearAntViews() {
        for (let antId in this._antViews) {
            this._antViews[antId].remove();
        }
        this._antViews = {};
    }

    _removeAntFromList(antId) {
        if (this._antViews[antId]) { //if ant died before colony_id changed
            this._antViews[antId].remove();
        }
        this._ants = this._ants.filter(ant => ant.id != antId);
    }

    _onSomeoneDied(entity) {
        if (!this._isActive()) {
            return;
        }
        if (this._isMyAnt(entity)) {
            this._removeAntFromList(entity.id);
        }
    }

    _onSomeoneBorn(entity) {
        if (!this._isActive()) {
            return;
        }
        if (this._isMyAnt(entity)) {
            this._ants.push(entity);
            this._renderAntView(entity);
        }
    }

    _onSomeoneFlewNuptialFlight(ant) {
        if (!this._isActive()) {
            return;
        }
        if (this._isAntInList(ant)) {
            this._removeAntFromList(ant.id);
        }
    }

    _isMyAnt(entity) {
        return entity.type == EntityTypes.ANT && entity.fromColony == this._colony.id;
    }

    _isAntInList(checkingAnt) {
        for (let ant of this._ants) {
            if (ant.id == checkingAnt.id) {
                return true;
            }
        }

        return false;
    }

    _isActive() {
        return !!this._colony;
    }
}

export {
    AntsListView
}