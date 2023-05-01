import { BasePopup } from "../base/basePopup";
import bodyTmpl from './body.html';

class TownPopup extends BasePopup {

    constructor() {
        super();
        this._title = 'town popup';

        this.render();
    }

    render() {
        super.render();
        this.bodyEl.innerHTML = bodyTmpl;
    }
    
    onOk() {
        console.log('ok');
    }

    onCancel() {
        this.close();
    }
}

export { 
    TownPopup
}