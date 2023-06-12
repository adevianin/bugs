import { BasePopup } from "../base/basePopup";
import bodyTmpl from './body.html';
import { LarvaManager } from "./larvaManager";

class NestPopup extends BasePopup {

    constructor(nest) {
        super();
        this._title = 'nest popup';
        this._nest = nest;

        this._unbindStoredCaloriesChangedListener = this._nest.on('storedCaloriesChanged', this._renderCalories.bind(this))

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
        this._larvaManager = new LarvaManager(this.bodyEl.querySelector('[data-larva-manager]'), this._nest);
    }
    
    onOk() {
        console.log('ok');
    }

    onCancel() {
        this.close();
    }

    _renderCalories() {
        this.bodyEl.querySelector('[data-stored-calories]').innerHTML = this._nest.storedCalories;
    }
}

export { 
    NestPopup
}