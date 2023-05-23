import { BasePopup } from "../base/basePopup";
import bodyTmpl from './body.html';

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
    }

    render() {
        super.render();
        this.bodyEl.innerHTML = bodyTmpl;
        this._renderCalories();
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