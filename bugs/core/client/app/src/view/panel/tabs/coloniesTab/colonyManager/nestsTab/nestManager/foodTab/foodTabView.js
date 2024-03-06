import { BaseHTMLView } from "@view/panel/base/baseHTMLView";

class FoodTabView extends BaseHTMLView {

    constructor(el) {
        super(el);

        this._el.innerHTML = 'food';
    }

}

export {
    FoodTabView
}