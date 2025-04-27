import { BaseGameHTMLView } from '@view/base/baseGameHTMLView';
import antsListTmpl from './antsListTmpl.html';
import { AntView } from "./antView";
import { EntityTypes } from "@domain/enum/entityTypes";

class AntsListView extends BaseGameHTMLView {

    constructor(el) {
        super(el);
        this._antViews = {};

        this.$domain.myState.on('antDied', this._onAntDied.bind(this));
        this.$domain.myState.on('antBorn', this._onAntBorn.bind(this));
        this.$domain.myState.nuptialEnvironment.on('queenFlewIn', this._onSomeoneFlewNuptialFlight.bind(this))

        this._render();
    }

    manageColony(colony) {
        this._colony = colony;
        this._ants = this.$domain.myState.getAntsFromColony(this._colony.id);

        this._renderAnts();
        this._renderNoAntsMode();
    }

    _render() {
        this._el.innerHTML = antsListTmpl;
        this._antsContainerEl = this._el.querySelector('[data-ants-container]');
        this._noAntsPlaceholderEl = this._el.querySelector('[data-no-ants-placeholder]');
    }

    _renderNoAntsMode() {
        let isAnyAnts = this._ants.length > 0;
        this._noAntsPlaceholderEl.classList.toggle('g-hidden', isAnyAnts);
    }

    _renderAnts() {
        this._clearAntViews();
        let ants = this._ants.sort((a,b) => {
            if (a.isQueenOfColony) return -1;
            if (b.isQueenOfColony) return 1;
            return 0;
        });
        for (let ant of ants) {
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

    _onAntDied(entity) {
        if (!this._isActive()) {
            return;
        }
        if (this._isMyAnt(entity)) {
            this._removeAntFromList(entity.id);
        }
        this._renderNoAntsMode();
    }

    _onAntBorn(entity) {
        if (!this._isActive()) {
            return;
        }
        if (this._isMyAnt(entity)) {
            this._ants.push(entity);
            this._renderAntView(entity);
        }
        this._renderNoAntsMode();
    }

    _onSomeoneFlewNuptialFlight(antId) {
        if (!this._isActive()) {
            return;
        }
        if (this._isAntInList(antId)) {
            this._removeAntFromList(antId);
        }
    }

    _isMyAnt(entity) {
        return entity.type == EntityTypes.ANT && entity.fromColony == this._colony.id;
    }

    _isAntInList(checkingAntId) {
        for (let ant of this._ants) {
            if (ant.id == checkingAntId) {
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