import { BaseGameHTMLView } from '@view/base/baseGameHTMLView';
import eggTabTmpl from './eggTabTmpl.html';
import { EggView } from "./eggView";
import { DotsLoaderView } from '@common/view/dotsLoader/dotsLoaderView';

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
        this._addEggLoader = new DotsLoaderView(this._el.querySelector('[data-lay-egg-loader]'));
    }

    manageNest(nest) {
        this._stopListenNest();
        this._nest = nest;
        this._listenNest();

        this._renderEggsList();
        this._renderError('');
    }

    _listenNest() {
        this._stopListenEggDeleted = this._nest.on('eggRemoved', this._onEggDeleted.bind(this));
        this._stopListenEggAdded = this._nest.on('eggAdded', this._onEggAdded.bind(this));
    }

    _stopListenNest() {
        if (!this._nest) {
            return
        }

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

    async _validate() {
        let errorId = await this.$domain.validateLayingEggInNest(this._nest.id);
        this._renderError(this.$messages[errorId]);

        return !errorId;
    }

    _toggleAddEggBtn(isEnabled) {
        this._addEggBtn.disabled = !isEnabled;
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
        let isValid = await this._validate();
        if (!isValid) {
            return;
        }

        this._toggleAddEggBtn(false);
        this._addEggLoader.toggle(true);
        
        let name = this._generateAntName();
        let isFertilized = this._isFertilizeCheckbox.checked;

        let result = await this.$domain.layEggInNest(this._nest.id, name, isFertilized);
        if (!result.success) {
            if (result.errCode == ErrorCodes.CONFLICT) {
                await this._validate();
            } else {
                this._renderError(this.$messages['SOMETHING_WENT_WRONG']);
            }
        }
        
        this._toggleAddEggBtn(true);
        this._addEggLoader.toggle(false);
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