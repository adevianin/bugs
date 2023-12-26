import { BaseHTMLView } from "@view/base/baseHTMLView";
import antsListTmpl from './antsListTmpl.html';
import { AntView } from "./antView";
import { EntityTypes } from "@domain/enum/entityTypes";

class AntsListView extends BaseHTMLView {

    constructor(el) {
        super(el);
        this._antViews = {};

        this.$domainFacade.events.on('entityDied', this._onSomeoneDied.bind(this));
        this.$domainFacade.events.on('entityBorn', this._onSomeoneBorn.bind(this));

        this._render();
    }

    manageColony(colony) {
        this._colony = colony;
        this._ants = this.$domainFacade.getAntsFromColony(this._colony.id);

        this._renderAnts();
    }

    _render() {
        this._el.innerHTML = antsListTmpl;
        this._antsContainerEl = this._el.querySelector('[data-ants-container]');
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

    _onSomeoneDied(entity) {
        if (this._isMyAnt(entity)) {
            this._antViews[entity.id].remove();
            this._ants = this._ants.filter(ant => ant.id != entity.id);
        }
    }

    _onSomeoneBorn(entity) {
        if (this._isMyAnt(entity)) {
            this._ants.push(entity);
            this._renderAntView(entity);
        }
    }

    _isMyAnt(entity) {
        return entity.type == EntityTypes.ANT && entity.fromColony == this._colony.id;
    }
}

export {
    AntsListView
}