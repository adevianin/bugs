import { BaseHTMLView } from "@view/base/baseHTMLView";
import eggTabTmpl from './eggTabTmpl.html';
import { EggView } from "./eggView";

class EggTabView extends BaseHTMLView {

    constructor(el) {
        super(el);
        this._eggsViews = {};

        this._render();

        this._addEggBtn.addEventListener('click', this._onAddEggBtnClick.bind(this));
        this.$domainFacade.events.addListener('currentSeasonChanged', this._onSeasonChanged.bind(this));
    }

    remove() {
        super.remove();
        this._stopListenNest();
        this._clearEggsViews();
    }

    _render() {
        this._el.innerHTML = eggTabTmpl;
        this._eggsListEl = this._el.querySelector('[data-eggs-list]');
        this._addEggBtn = this._el.querySelector('[data-add-egg]');
        this._isFertilizeCheckbox = this._el.querySelector('[data-is-fertilized]');
        this._notEnoughFoodMsg = this._el.querySelector('[data-not-enough-food-msg]');
        this._notSuitableSeasonMsg = this._el.querySelector('[data-not-suitable-season-msg]');
    }

    manageNest(nest) {
        this._stopListenNest();
        this._nest = nest;
        this._listenNest();

        this._renderEggsList();
        this._renderCanAddNewEgg();
    }

    _listenNest() {
        this._stopListenEggBecameLarva = this._nest.on('eggBecameLarva', this._onEggBecameLarva.bind(this));
        this._stopListenEggDeleted = this._nest.on('eggDeleted', this._onEggDeleted.bind(this));
        this._stopListenEggAdded = this._nest.on('eggAdded', this._onEggAdded.bind(this));
        this._stopListenStoredCaloriesChanged = this._nest.on('storedCaloriesChanged', this._onStoredCaloriesChanged.bind(this));
    }

    _stopListenNest() {
        if (!this._nest) {
            return
        }

        this._stopListenEggBecameLarva();
        this._stopListenEggDeleted();
        this._stopListenEggAdded();
        this._stopListenStoredCaloriesChanged();
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

    _onEggBecameLarva(egg) {
        this._removeEggView(egg);
    }

    _onEggDeleted(egg) {
        this._removeEggView(egg);
    }

    _onEggAdded(egg) {
        this._renderEgg(egg);
    }

    _onStoredCaloriesChanged() {
        this._renderCanAddNewEgg();
    }

    _onAddEggBtnClick() {
        let name = this._generateAntName();
        let isFertilized = this._isFertilizeCheckbox.checked;
        this._nest.addNewEgg(name, isFertilized);
    }

    _onSeasonChanged() {
        this._renderCanAddNewEgg();
    }

    _renderCanAddNewEgg() {
        let haveFood = this._nest.checkHaveEnoughtFoodForNewEgg();
        let isSuitableSeason = this.$domainFacade.world.isSeasonForLayingEggs;
        let canAdd = haveFood && isSuitableSeason;
        this._addEggBtn.disabled = !canAdd;
        this._notEnoughFoodMsg.classList.toggle('hidden', haveFood);
        this._notSuitableSeasonMsg.classList.toggle('hidden', isSuitableSeason);
    }

    _generateAntName() {
        let adjectives = ["Веселий", "Швидкий", "Сміливий", "Маленький", "Розумний", "Спритний"];
        let nouns = ['Трудяга', "Борець", "Мандрівник", "Дослідник", "Боб", "Захисник", 'Мурашко'];

        let randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
        let randomNoun = nouns[Math.floor(Math.random() * nouns.length)];

        return `${randomAdjective} ${randomNoun}`;
    }

}

export {
    EggTabView
}