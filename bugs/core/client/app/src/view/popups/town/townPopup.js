import { BasePopup } from "../base/basePopup";
import bodyTmpl from './body.html';
import { LarvaManager } from "./larvaManager";

class TownPopup extends BasePopup {

    constructor(town) {
        super();
        this._title = 'town popup';
        this._town = town;

        this._unbindStoredCaloriesChangedListener = this._town.on('storedCaloriesChanged', this._renderCalories.bind(this))

        this.render();
    }

    close(){ 
        super.close();
        this._unbindStoredCaloriesChangedListener();
        this._larvaManager.remove();
    }

    render() {
        super.render();
        this.bodyEl.innerHTML = bodyTmpl;
        this._renderCalories();
        this._larvaManager = new LarvaManager(this.bodyEl.querySelector('[data-larva-manager]'), this._town);
    }
    
    onOk() {
        console.log('ok');
    }

    onCancel() {
        this.close();
    }

    _renderCalories() {
        this.bodyEl.querySelector('[data-stored-calories]').innerHTML = this._town.storedCalories;
    }
}

export { 
    TownPopup
}