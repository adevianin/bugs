import { BaseGameHTMLView } from '@view/base/baseGameHTMLView';
import eggTabTmpl from './eggTabTmpl.html';
import { EggView } from "./eggView";
import { ConflictRequestError } from "@common/domain/errors/conflictRequestError";
import { GenericRequestError } from "@common/domain/errors/genericRequestError";

class EggTabView extends BaseGameHTMLView {

    constructor(el) {
        super(el);
        this._eggsViews = {};

        this._render();

        this._addEggBtn.addEventListener('click', this._onAddEggBtnClick.bind(this));
    }

    _render() {
        this._el.innerHTML = eggTabTmpl;
        this._eggsListEl = this._el.querySelector('[data-eggs-list]');
        this._addEggBtn = this._el.querySelector('[data-add-egg]');
        this._isFertilizeCheckbox = this._el.querySelector('[data-is-fertilized]');
        this._errorContainerEl = this._el.querySelector('[data-error-container]');
    }

    manageNest(nest) {
        this._stopListenNest();
        this._nest = nest;
        this._listenNest();

        this._renderEggsList();
        this._renderError('');
    }

    _listenNest() {
        this._stopListenEggBecameLarva = this._nest.on('eggBecameLarva', this._onEggBecameLarva.bind(this));
        this._stopListenEggDeleted = this._nest.on('eggDeleted', this._onEggDeleted.bind(this));
        this._stopListenEggAdded = this._nest.on('eggAdded', this._onEggAdded.bind(this));
    }

    _stopListenNest() {
        if (!this._nest) {
            return
        }

        this._stopListenEggBecameLarva();
        this._stopListenEggDeleted();
        this._stopListenEggAdded();
    }

    _renderEggsList() {
        this._clearEggsViews();
        for (let egg of this._nest.eggs) {
            this._renderEgg(egg);
        }
    }

    _renderEgg(egg) {
        let el = document.createElement('tr');
        this._eggsListEl.append(el);
        let view = new EggView(el, egg, this._nest);
        this._eggsViews[egg.id] = view;
    }

    _clearEggsViews() {
        for (let eggId in this._eggsViews) {
            this._eggsViews[eggId].remove();
        }
        this._eggsViews = {};
    }

    _removeEggView(egg) {
        this._eggsViews[egg.id].remove();
        delete this._eggsViews[egg.id];
    }

    _validate() {
        let errorId = this.$domainFacade.validateLayingEggInNest(this._nest.id);
        this._renderError(this.$messages[errorId]);

        return !errorId;
    }

    _onEggBecameLarva(egg) {
        this._removeEggView(egg);
    }

    _onEggDeleted(egg) {
        this._removeEggView(egg);
    }

    _onEggAdded(egg) {
        this._renderEgg(egg);
    }

    async _onAddEggBtnClick() {
        if (!this._validate()) {
            return;
        }

        let name = this._generateAntName();
        let isFertilized = this._isFertilizeCheckbox.checked;
        try {
            await this.$domainFacade.layEggInNest(this._nest.id, name, isFertilized);
        } catch (e) {
            if (e instanceof ConflictRequestError) {
                this._validate();
            } else if (e instanceof GenericRequestError) {
                this._renderError(this.$messages['SOMETHING_WENT_WRONG']);
            }
        }
        
    }

    _generateAntName() {
        let adjectives = ["Веселий", "Швидкий", "Сміливий", "Маленький", "Розумний", "Спритний"];
        let nouns = ['Трудяга', "Борець", "Мандрівник", "Дослідник", "Боб", "Захисник", 'Мурашко'];

        let randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
        let randomNoun = nouns[Math.floor(Math.random() * nouns.length)];

        return `${randomAdjective} ${randomNoun}`;
    }

    _renderError(errText) {
        this._errorContainerEl.innerHTML = errText || '';
    }

}

export {
    EggTabView
}