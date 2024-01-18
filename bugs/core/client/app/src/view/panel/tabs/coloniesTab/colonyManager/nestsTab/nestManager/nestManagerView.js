import { BaseHTMLView } from "@view/panel/base/baseHTMLView";
import nestManagerTmpl from './nestManagerTmpl.html';
import { LarvaManager } from "./larvaManager";

class NestManagerView extends BaseHTMLView {

    constructor(el) {
        super(el);
        this._nest = null;

        this._render();
    }

    manageNest(nest) {
        if (this._nest) {
            this._stopListenNest();
        }
        if (this._queen) {
            this._stopListenQueen();
        }

        this._nest = nest;
        this._listenNest();
        
        this._queen = this.$domainFacade.getQueenOfColony(nest.fromColony);
        this._listenQueen();

        this._larvaManager.manageNest(nest);

        this._renderCalories();
        this._renderIsQueenInsideNest();
    }

    _listenNest() {
        this._unbindStoredCaloriesChangedListener = this._nest.on('storedCaloriesChanged', this._renderCalories.bind(this))
    }

    _listenQueen() {
        if (this._queen) {
            this._unbindQueenLocatedInNestListener = this._queen.on('locatedInNestChanged', this._renderIsQueenInsideNest.bind(this));
        }
    }

    _stopListenQueen() {
        if (this._queen) {
            this._unbindQueenLocatedInNestListener();
        }
    }

    _stopListenNest() {
        this._unbindStoredCaloriesChangedListener();
    }

    _render() {
        this._el.innerHTML = nestManagerTmpl;
        this._storedCaloriesEl = this._el.querySelector('[data-stored-calories]');
        this._isQueenInsideIndicatorEl = this._el.querySelector('[data-is-queen-inside]');
        this._larvaManager = new LarvaManager(this._el.querySelector('[data-larva-manager]'));
    }

    _renderCalories() {
        this._storedCaloriesEl.innerHTML = this._nest.storedCalories;
    }

    _renderIsQueenInsideNest() {
        let isQueenInNest = this._queen && this._queen.locatedInNestId == this._nest.id;
        this._isQueenInsideIndicatorEl.innerHTML = isQueenInNest ? '+' : '-';
        this._larvaManager.toggle(isQueenInNest);
    }

}

export { NestManagerView }